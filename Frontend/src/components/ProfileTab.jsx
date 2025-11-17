import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiDiscount1 } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaGifts } from "react-icons/fa6";
import { PiPlantFill } from "react-icons/pi";
import { FaMedal } from "react-icons/fa6";
import { FaFire } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // جلب بيانات البروفايل
        const profileRes = await axios.get("http://localhost:5000/api/auth/profile", {
          withCredentials: true,
        });
        if (profileRes.data.success) setUser(profileRes.data.userData);

        
        const pickupsRes = await axios.get("http://localhost:5000/api/pickups/my", {
          withCredentials: true,
        });
        if (pickupsRes.data.success) {
          const mappedActivities = pickupsRes.data.pickups.map((pickup) => ({
            action: `Pickup ${pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}`,
            date: pickup.createdAt,
            Points: pickup.awardedPoints || 0, 
          }));
          setActivities(mappedActivities);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const rewards = [
    {
      title: "Discount Voucher",
      desc: "10% off your next purchase",
      icon: <CiDiscount1 className="text-red-600 text-4xl" />,
    },
    {
      title: "Bonus Points",
      desc: "+500 points for consistent recycling",
      icon: <FaHeart className="text-green-600 text-4xl" />,
    },
    {
      title: "Free Gift",
      desc: "Reusable water bottle",
      icon: <FaGifts className="text-[#C2A070] text-4xl" />,
    },
  ];

  const achievements = [
    {
      title: "Eco Starter",
      desc: "Completed your first recycling activity",
      icon: <PiPlantFill className="text-green-800 text-4xl" />,
    },
    {
      title: "Green Hero",
      desc: "Recycled 100+ items",
      icon: <FaMedal className="text-yellow-500 text-4xl" />,
    },
    {
      title: "Streak Master",
      desc: "Recycled for 7 days in a row",
      icon: <FaFire className="text-orange-500 text-4xl" />,
    },
  ];

  const greenMessage = (
    <div className="mt-6 bg-green-200 text-green-900 text-sm font-medium p-4 rounded-lg text-center">
      <b>Great Job this week!</b> You are on a{" "}
      {user?.stats?.thisWeek || 0}-day recycling streak!
      <br />
      Keep it up — you’re only{" "}
      <b>{5000 - (user?.points || 0)} points</b> away from reaching the next
      level!
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-10 bg-white rounded-4xl shadow-md p-4 sm:p-6">
      <div className="bg-gray-200 rounded-4xl p-1 flex justify-between">
        {[
          { key: "activity", label: "Recent Activity" },
          { key: "rewards", label: "Rewards" },
          { key: "achievements", label: "Achievements" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-1/3 py-2 text-sm sm:text-base font-semibold capitalize transition-all duration-300
              ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-md rounded-4xl"
                  : "bg-gray-200 text-gray-700 rounded-4xl"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "activity" && (
          <>
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No activity yet. Start recycling today!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {activities.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 rounded-lg p-3 sm:p-4 hover:bg-gray-200 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-green-200 text-green-800 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                      +{item.Points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
            {greenMessage}
          </>
        )}

        {activeTab === "rewards" && (
          <>
            <h3 className="text-gray-800 font-semibold mb-4">
              Redeem your points for amazing rewards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {rewards.map((reward, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-green-50 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="mb-2">{reward.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-800 text-center">
                    {reward.title}
                  </h4>
                  <p className="text-sm text-gray-600 text-center">
                    {reward.desc}
                  </p>
                </div>
              ))}
            </div>
            {greenMessage}
          </>
        )}

        {activeTab === "achievements" && (
          <>
            <h3 className="text-gray-800 font-semibold mb-4">
              Your Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((ach, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-yellow-50 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="mb-2">{ach.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-800 text-center">
                    {ach.title}
                  </h4>
                  <p className="text-sm text-gray-600 text-center">
                    {ach.desc}
                  </p>
                </div>
              ))}
            </div>
            {greenMessage}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;