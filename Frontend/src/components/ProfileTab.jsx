import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { CiDiscount1 } from "react-icons/ci";
import { FaHeart, FaFire } from "react-icons/fa";
import { FaGifts, FaMedal } from "react-icons/fa6";
import { PiPlantFill } from "react-icons/pi";
import LoadingSpinner from "../components/LoadingSpinner";
import { AppContent } from "../context/AppContext";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [daysRecycled, setDaysRecycled] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // ✅ Get socket from context
  const { socket, userData, isLoggedin } = useContext(AppContent);

  // ✅ Fetch user data with pickup integration
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const profileRes = await api.get("/api/auth/profile", {
        withCredentials: true,
      });
      
      console.log("📋 Profile response:", profileRes.data);
      
      if (profileRes.data.success) {
        const userData = profileRes.data.user || profileRes.data.userData;
        setUser(userData);
        
        // ✅ Fetch pickups data to merge with activities
        try {
          const pickupsRes = await api.get("/api/pickups/my", {
            withCredentials: true,
          });

          if (pickupsRes.data.success) {
            const pickups = pickupsRes.data.pickups;
            console.log("📦 Pickups fetched:", pickups.length);

            // 🔥 Map pickups to activities with all details
            const mappedActivities = pickups.map((pickup) => {
              const points = pickup.awardedPoints || 0;
              const isCompleted = pickup.status === "completed";

              // Real gains from backend (fallback to calculation)
              const totalMoney = pickup.gains || (points * 0.15);

              // ✅ Only show "Pickup Completed" if completed, otherwise just "Pickup Pending/Assigned"
              let actionText = "Pickup Pending"; // Default to pending
              if (pickup.status === "completed") {
                actionText = "Pickup Completed";
              } else if (pickup.status === "assigned") {
                actionText = "Pickup Assigned";
              }

              return {
                action: actionText,
                date: pickup.createdAt,
                Points: points,
                gains: totalMoney,
                isCompleted: isCompleted,
                status: pickup.status,
                items: pickup.items || [],
                isPickup: true, // ✅ Mark as pickup to avoid duplicates
              };
            });

            // ✅ Get user activities from profile, excluding pickup-related activities
            const userActivities = Array.isArray(userData.activity) 
              ? userData.activity.filter(activity => {
                  // ✅ Filter out activities that match pickup creation patterns
                  const action = activity.action?.toLowerCase() || "";
                  const isPickupActivity = 
                    action.includes("pickup") || 
                    action.includes("created pickup") ||
                    action.includes("pickup request");
                  
                  // Keep non-pickup activities only
                  return !isPickupActivity;
                })
              : [];
            
            // ✅ Merge and sort by date (most recent first)
            const allActivities = [...mappedActivities, ...userActivities].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            
            console.log("📊 Total activities:", allActivities.length);
            console.log("   - Pickups:", mappedActivities.length);
            console.log("   - Other activities:", userActivities.length);
            setActivities(allActivities);

            // Calculate unique recycling days (completed pickups only)
            const completedPickups = pickups.filter((p) => p.status === "completed");
            const uniqueDays = new Set(
              completedPickups.map((p) => new Date(p.createdAt).toDateString())
            );
            setDaysRecycled(uniqueDays.size);
          }
        } catch (pickupErr) {
          console.error("⚠️ Error fetching pickups:", pickupErr);
          // Fallback to profile activities only (still filter pickup activities)
          const userActivities = Array.isArray(userData.activity) 
            ? userData.activity.filter(activity => {
                const action = activity.action?.toLowerCase() || "";
                return !action.includes("pickup") && 
                       !action.includes("created pickup") &&
                       !action.includes("pickup request");
              })
            : [];
          setActivities(userActivities.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
      }
    } catch (err) {
      console.error("❌ Error fetching profile data:", err);
      setActivities([]);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // ✅ Setup socket listeners for real-time updates
  useEffect(() => {
    if (!socket || !isLoggedin || !userData?.id) {
      console.log("⚠️ Socket not available or user not logged in");
      return;
    }
  
    console.log("📡 Setting up socket listeners in ProfileTab for user:", userData.id);

    // Authenticate socket connection
    socket.emit("authenticate", userData.id);
  
    // Listen for new pickup creation
    const handlePickupCreated = (data) => {
      console.log("🆕 Pickup created event received:", data);
      fetchUserData(); // Refresh to show new activity
    };
  
    // Listen for pickup completion
    const handlePickupCompleted = (data) => {
      console.log("✅ Pickup completed event received:", data);
      fetchUserData(); // Refresh to show completed status
    };
  
    // Listen for points awarded
    const handlePointsAwarded = (data) => {
      console.log("💰 Points awarded event received:", data);
      
      // ✅ Update user points immediately with null checks
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          points: data.totalPoints || prev.points,
          gains: data.totalGains || prev.gains,
        };
      });
      
      // Refresh full profile
      fetchUserData();
    };
  
    // Listen for pickup updates
    const handlePickupUpdatedUser = (data) => {
      console.log("✏️ Pickup updated event received:", data);
      fetchUserData(); // Refresh to show updates
    };
  
    // Listen for pickup deletion
    const handlePickupDeletedUser = (data) => {
      console.log("🗑️ Pickup deleted event received:", data);
      fetchUserData(); // Refresh to remove deleted activity
    };

    // Listen for pickup assignment
    const handlePickupAssignedUser = (data) => {
      console.log("🚚 Pickup assigned event received:", data);
      fetchUserData(); // Refresh to show assignment
    };
  
    // Register all event listeners
    socket.on("pickup-created", handlePickupCreated);
    socket.on("pickup-completed", handlePickupCompleted);
    socket.on("points-awarded", handlePointsAwarded);
    socket.on("pickup-updated-user", handlePickupUpdatedUser);
    socket.on("pickup-deleted-user", handlePickupDeletedUser);
    socket.on("pickup-assigned-user", handlePickupAssignedUser);
  
    // Cleanup listeners on unmount
    return () => {
      socket.off("pickup-created", handlePickupCreated);
      socket.off("pickup-completed", handlePickupCompleted);
      socket.off("points-awarded", handlePointsAwarded);
      socket.off("pickup-updated-user", handlePickupUpdatedUser);
      socket.off("pickup-deleted-user", handlePickupDeletedUser);
      socket.off("pickup-assigned-user", handlePickupAssignedUser);
      console.log("🧹 Socket listeners cleaned up in ProfileTab");
    };
  }, [socket, isLoggedin, userData?.id]);

  // Rewards data
  const rewards = [
    {
      title: "Discount Voucher",
      desc: "10% off your next purchase",
      icon: <CiDiscount1 className="text-red-600 text-4xl" />,
      pointsCost: 1000,
    },
    {
      title: "Bonus Points",
      desc: "+500 points for consistent recycling",
      icon: <FaHeart className="text-green-600 text-4xl" />,
      pointsCost: 2000,
    },
    {
      title: "Free Gift",
      desc: "Reusable water bottle",
      icon: <FaGifts className="text-[#C2A070] text-4xl" />,
      pointsCost: 1500,
    },
  ];

  // Achievements data
  const achievements = [
    {
      title: "Eco Starter",
      desc: "Completed your first recycling activity",
      icon: <PiPlantFill className="text-green-800 text-4xl" />,
      unlocked: activities.some((a) => a.isCompleted || a.action?.toLowerCase().includes("completed")),
    },
    {
      title: "Green Hero",
      desc: "Recycled 100+ items",
      icon: <FaMedal className="text-yellow-500 text-4xl" />,
      unlocked: (user?.points || 0) >= 1000,
    },
    {
      title: "Streak Master",
      desc: "Recycled for 7 days in a row",
      icon: <FaFire className="text-orange-500 text-4xl" />,
      unlocked: daysRecycled >= 7,
    },
  ];

  if (loading) return <LoadingSpinner />;

  // ✅ Safely get user data with defaults
  const userPoints = user?.points || 0;

  return (
    <div className="mt-10 bg-white rounded-4xl shadow-md p-4 sm:p-6">
      {/* Tabs Navigation */}
      <div className="bg-gray-200 rounded-4xl p-1 flex justify-between">
        {[
          { key: "activity", label: "Recent Activity" },
          { key: "rewards", label: "Rewards" },
          { key: "achievements", label: "Achievements" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-1/3 py-2 text-xs sm:text-base font-semibold capitalize transition-all duration-300 cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-md rounded-4xl"
                : "bg-gray-200 text-gray-700 rounded-4xl"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <>
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No activity yet. Start recycling today!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {activities.map((item, i) => {
                  // Determine activity status and type
                  const isCompleted = item.isCompleted || item.action?.toLowerCase().includes("completed");
                  const isAssigned = item.status === "assigned" || item.action?.toLowerCase().includes("assigned");
                  const isPending = item.status === "pending" || item.action?.toLowerCase().includes("pending");
                  
                  // Get status text
                  let statusText = item.status || "completed";
                  if (isCompleted) statusText = "completed";
                  else if (isAssigned) statusText = "assigned";
                  else if (isPending) statusText = "pending";

                  // Get points and gains (handle both Points and points)
                  const activityPoints = item.Points || item.points || 0;
                  const activityGains = item.gains || 0;

                  return (
                    <div
                      key={i}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-lg p-3 sm:p-4 transition ${
                        isCompleted
                          ? "bg-green-50 hover:bg-green-100 border border-green-200"
                          : isAssigned
                          ? "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                          : "bg-yellow-50 hover:bg-yellow-100 border border-yellow-200"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-800">{item.action}</p>

                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              isCompleted
                                ? "bg-green-200 text-green-800"
                                : isAssigned
                                ? "bg-blue-200 text-blue-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {statusText}
                          </span>

                          {/* Gains badge (only if > 0) */}
                          {activityGains > 0 && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              {activityGains.toFixed(2)} EGP
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(item.date).toLocaleDateString()}
                        </p>

                        {/* Show items if available */}
                        {item.items && item.items.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            Items: {item.items.map((i) => i.type).join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Points & Gains */}
                      <div className="flex flex-col right-0 sm:flex-row items-end sm:items-center gap-2 mt-2 sm:mt-0">
                        {activityGains > 0 && (
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full shadow-sm ${
                              isCompleted
                                ? "bg-emerald-200 text-emerald-800"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isCompleted ? "+" : "~"}
                            {activityGains.toFixed(2)} EGP
                          </span>
                        )}

                        {activityPoints > 0 && (
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full shadow-sm ${
                              isCompleted
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isCompleted ? "+" : "~"}
                            {activityPoints} pts
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* REWARDS TAB */}
        {activeTab === "rewards" && (
          <>
            <h3 className="text-gray-800 font-semibold mb-4">
              Redeem your points for amazing rewards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
              {rewards.map((reward, i) => {
                const canAfford = userPoints >= reward.pointsCost;
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition ${
                      canAfford ? "bg-green-50" : "bg-gray-100"
                    }`}
                  >
                    <div className="mb-2">{reward.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-800 text-center">
                      {reward.title}
                    </h4>
                    <p className="text-sm text-gray-600 text-center mb-2">
                      {reward.desc}
                    </p>
                    <button
                      disabled={!canAfford}
                      className={`mt-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                        canAfford
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {reward.pointsCost} pts
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === "achievements" && (
          <>
            <h3 className="text-gray-800 font-semibold mb-4">Your Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((ach, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition ${
                    ach.unlocked
                      ? "bg-yellow-50 border-2 border-yellow-400"
                      : "bg-gray-100 opacity-60"
                  }`}
                >
                  <div className="mb-2 relative">
                    {ach.icon}
                    {ach.unlocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-lg font-semibold text-gray-800 text-center">
                    {ach.title}
                  </h4>
                  <p className="text-sm text-gray-600 text-center">{ach.desc}</p>

                  {ach.unlocked && (
                    <span className="mt-2 text-xs font-medium text-green-600">
                      Unlocked! 🎉
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;