import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import RecycleCamera from "../components/RecycleCamera";
import { FcIdea } from "react-icons/fc";
import { GiProgression } from "react-icons/gi";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const RecycleScanner = () => {
  const [selected, setSelected] = useState("Paper");
  const [assigned, setAssigned] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [loading, setLoading] = useState(true);

  const tips = {
    Plastic: ["Rinse bottles", "Remove caps", "Do not recycle bags"],
    Paper: ["Remove staples", "Avoid wet paper", "Flatten boxes"],
    Glass: ["Rinse jars", "Remove lids", "Do not include broken glass"],
    Metal: ["Rinse cans", "Avoid aerosol cans", "Crush cans"],
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const profileRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
          {
            withCredentials: true,
          }
        );
        const user = profileRes.data.userData;
        setDailyGoal(user.dailyGoal || 5);

        // Fetch user's pickups
        const pickupsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/pickups/my`,
          {
            withCredentials: true, // keep this if your backend uses cookies/auth
          }
        );
        
        const pickups = pickupsRes.data.pickups || [];
        const todayStr = new Date().toDateString();

        // Count completed pickups today
        const completedToday = pickups.filter(
          (p) =>
            p.status === "completed" &&
            new Date(p.createdAt).toDateString() === todayStr
        ).length;

        // Count assigned pickups today
        const assignedToday = pickups.filter(
          (p) =>
            p.status === "assigned" &&
            new Date(p.createdAt).toDateString() === todayStr
        ).length;

        setCompleted(completedToday);
        setAssigned(assignedToday);
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Determine stars to display (max 5)
  const totalProgress = Math.min(completed + assigned, 5);
  const pending = Math.max(dailyGoal - totalProgress, 0);

  return (
    <section >
      <NavBar />
      <div className="bg-gray-100 overflow-x-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Smart Recycling Center</h1>
        <p className="text-gray-600">
          AI-powered recognition to identify recyclable materials
        </p>

        <div className="flex flex-col gap-10 md:flex-row lg:flex-row mt-6">
          <RecycleCamera />

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
                    className={`py-2 cursor-pointer rounded-xl font-medium ${
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
            <div className="border rounded-xl p-3 bg-white border-gray-300 overflow-hidden">
              <div className="flex gap-1 items-center ">
                <GiProgression className="text-xl mb-3 text-yellow-400" />
                <h2 className="text-lg font-semibold mb-3">Today's Progress</h2>
              </div>

              <div className="flex justify-center gap-2  items-center mb-4 w-full px-4">
                {/* Completed */}
                {Array.from({ length: Math.min(completed, 5) }, (_, i) => (
                  <span
                    key={i}
                    className="text-green-500 text-5xl  leading-none"
                  >
                    ★
                  </span>
                ))}

                {/* Assigned */}
                {Array.from(
                  { length: Math.min(assigned, 5 - completed) },
                  (_, i) => (
                    <span
                      key={i + completed}
                      className="text-yellow-400 text-5xl leading-none"
                    >
                      ★
                    </span>
                  )
                )}

                {/* Pending */}
                {Array.from(
                  { length: Math.max(5 - completed - assigned, 0) },
                  (_, i) => (
                    <span
                      key={i + completed + assigned}
                      className="text-gray-300 text-5xl leading-none"
                    >
                      ★
                    </span>
                  )
                )}
              </div>

              <p className="text-sm text-gray-600 mb-2">
                {completed + assigned < dailyGoal
                  ? `${dailyGoal - completed - assigned} tasks pending`
                  : "Daily goal reached! 🎉"}
              </p>
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
