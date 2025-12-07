import React, { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import RecycleCamera from "../components/RecycleCamera";
import { FcIdea } from "react-icons/fc";
import { GiProgression } from "react-icons/gi";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { AppContent } from "../context/AppContext";

const RecycleScanner = () => {
  const [selected, setSelected] = useState("Paper");
  const [assigned, setAssigned] = useState(0);
  const [pending, setPending] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [loading, setLoading] = useState(true);
  const [showReward, setShowReward] = useState(false);

  // Get socket from context for real-time updates
  const { socket, userData, isLoggedin } = useContext(AppContent);

  const tips = {
    Plastic: ["Rinse bottles", "Remove caps", "Do not recycle bags"],
    Paper: ["Remove staples", "Avoid wet paper", "Flatten boxes"],
    Glass: ["Rinse jars", "Remove lids", "Do not include broken glass"],
    Metal: ["Rinse cans", "Avoid aerosol cans", "Crush cans"],
  };

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setLoading(true);

      // Fetch user's pickups
      const pickupsRes = await api.get("/api/pickups/my", {
        withCredentials: true,
      });

      const pickups = pickupsRes.data.pickups || [];
      const todayStr = new Date().toDateString();

      // Count assigned pickups today (green stars)
      const assignedToday = pickups.filter(
        (p) =>
          p.status === "assigned" &&
          new Date(p.createdAt).toDateString() === todayStr
      ).length;

      // Count pending pickups today (yellow stars)
      const pendingToday = pickups.filter(
        (p) =>
          p.status === "pending" &&
          new Date(p.createdAt).toDateString() === todayStr
      ).length;

      setAssigned(assignedToday);
      setPending(pendingToday);

      // Check if daily goal is reached (assigned only)
      if (assignedToday >= dailyGoal) {
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      }
    } catch (err) {
      console.error("❌ Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProgress();
  }, []);

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!socket || !isLoggedin || !userData?.id) {
      console.log("⚠️ Socket not available or user not logged in");
      return;
    }

    console.log("📡 Setting up socket listeners in RecycleScanner");

    // Listen for pickup events and refresh progress
    const handlePickupEvent = (data) => {
      console.log("🔄 Pickup event received, refreshing progress");
      fetchProgress();
    };

    socket.on("pickup-created", handlePickupEvent);
    socket.on("pickup-completed", handlePickupEvent);
    socket.on("pickup-assigned-user", handlePickupEvent);
    socket.on("pickup-updated-user", handlePickupEvent);
    socket.on("pickup-deleted-user", handlePickupEvent);

    return () => {
      socket.off("pickup-created", handlePickupEvent);
      socket.off("pickup-completed", handlePickupEvent);
      socket.off("pickup-assigned-user", handlePickupEvent);
      socket.off("pickup-updated-user", handlePickupEvent);
      socket.off("pickup-deleted-user", handlePickupEvent);
      console.log("🧹 Socket listeners cleaned up in RecycleScanner");
    };
  }, [socket, isLoggedin, userData?.id]);

  if (loading) return <LoadingSpinner />;

  return (
    <section>
      <NavBar />
      <div className="bg-gray-100 overflow-x-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Smart Recycling Center</h1>
          <p className="text-gray-600">
            AI-powered recognition to identify recyclable materials
          </p>

          <div className="flex flex-col gap-10 md:flex-row lg:flex-row mt-6">
            <RecycleCamera onPickupCreated={fetchProgress} />

            <div className="flex flex-col gap-8 min-w-[30%]">
              {/* Recycling Tips */}
              <div className="border rounded-xl p-3 bg-white border-gray-300">
                <div className="flex items-center gap-1 p-1">
                  <FcIdea className="text-2xl" />
                  <h3 className="font-semibold text-xl">Recycling Tips</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 m-1 mb-4">
                  {["Plastic", "Paper", "Glass", "Metal"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelected(type)}
                      className={`py-2 cursor-pointer rounded-xl font-medium transition-colors ${
                        selected === type
                          ? "bg-gray-200 text-gray-900"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <ul className="space-y-2">
                  {tips[selected].map((tip, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✔</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress: 5 stars max */}
              <div className="border rounded-xl p-3 bg-white border-gray-300 overflow-hidden relative">
                {/* Reward notification */}
                {showReward && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 px-4 text-center font-semibold animate-bounce z-10">
                    🎉 Daily Goal Reached! +25 Points! 🎉
                  </div>
                )}

                <div className="flex gap-1 items-center">
                  <GiProgression className="text-xl mb-3 text-yellow-400" />
                  <h2 className="text-lg font-semibold mb-3">
                    Today's Progress
                  </h2>
                </div>

                <div className="flex justify-center gap-2 items-center mb-4 w-full px-4">
                  {/* Assigned Stars (Green) - Confirmed pickups */}
                  {Array.from(
                    { length: Math.min(assigned, dailyGoal) },
                    (_, i) => (
                      <span
                        key={`assigned-${i}`}
                        className="text-green-500 text-5xl leading-none transition-all duration-300 hover:scale-110"
                        title="Assigned"
                      >
                        ★
                      </span>
                    )
                  )}

                  {/* Pending Stars (Yellow) - Awaiting assignment */}
                  {Array.from(
                    { length: Math.min(pending, dailyGoal - assigned) },
                    (_, i) => (
                      <span
                        key={`pending-${i}`}
                        className="text-yellow-400 text-5xl leading-none transition-all duration-300 hover:scale-110"
                        title="Pending"
                      >
                        ★
                      </span>
                    )
                  )}

                  {/* Empty Stars (Gray) - Not yet created */}
                  {Array.from(
                    { length: Math.max(dailyGoal - assigned - pending, 0) },
                    (_, i) => (
                      <span
                        key={`empty-${i}`}
                        className="text-gray-300 text-5xl leading-none"
                        title="Not started"
                      >
                        ★
                      </span>
                    )
                  )}
                </div>

                {/* Progress Text */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {assigned >= dailyGoal ? (
                      <span className="text-green-600 font-semibold">
                        Daily goal reached! 🎉
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold text-gray-800">
                          {assigned + pending}/{dailyGoal}
                        </span>
                        {" tasks "}
                        {pending > 0 && (
                          <span className="text-yellow-600">
                            ({pending} pending assignment)
                          </span>
                        )}
                        {assigned > 0 && (
                          <span className="text-green-600">
                            {pending > 0 && ", "}({assigned} assigned)
                          </span>
                        )}
                      </>
                    )}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((assigned + pending) / dailyGoal) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {assigned >= dailyGoal
                      ? "Keep up the great work!"
                      : `${
                          dailyGoal - assigned - pending
                        } more to reach your goal`}
                  </p>
                </div>

                {/* Legend */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-green-500 text-xl">★</span>
                    <span className="text-gray-600">Assigned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-300 text-xl">★</span>
                    <span className="text-gray-600">Not Started</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default RecycleScanner;