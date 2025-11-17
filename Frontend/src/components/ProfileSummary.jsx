import React, { useEffect, useState } from "react";
import axios from "axios";
import { CgCalendarDates } from "react-icons/cg";
import { IoIosStar } from "react-icons/io";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaMedal } from "react-icons/fa6";

const ProfileSummary = () => {
  const [user, setUser] = useState(null);
  const [daysRecycled, setDaysRecycled] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchUserAndPickups = async () => {
      try {
        // جلب بيانات المستخدم
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          withCredentials: true,
        });
        setUser(res.data.userData);

        // Fetch pickups
        const pickupsRes = await axios.get("http://localhost:5000/api/pickups/my", {
          withCredentials: true,
        });

        if (pickupsRes.data.success) {
          const pickups = pickupsRes.data.pickups;

          // حساب عدد الأيام المختلفة اللي فيها pickups
          const uniqueDays = new Set(pickups.map((p) => new Date(p.createdAt).toDateString()));
          setDaysRecycled(uniqueDays.size);

          // حساب مجموع النقاط من كل الـ pickups
          const totalPointsFromPickups = pickups.reduce(
            (acc, p) => acc + (p.awardedPoints || 0),
            0
          );
          setTotalPoints(totalPointsFromPickups);
        }
      } catch (err) {
        console.error("Error fetching user profile or pickups:", err);
      }
    };

    fetchUserAndPickups();
  }, []);

  const cardColor = "bg-green-100 text-green-700";

  const summaryCards = [
    {
      title: "Days Recycled",
      value: `${daysRecycled} days`,
      color: cardColor,
      icon: <CgCalendarDates />,
    },
    {
      title: "Total Points",
      value:` ${totalPoints}`,
      color: cardColor,
      icon: <IoIosStar className="text-yellow-400 fill-yellow-400" />,
    },
    {
      title: "Level",
      value:` ${user?.level || "Beginner"}`,
      color: cardColor,
      icon: <SiLevelsdotfyi className="text-blue-400 fill-blue-400" />,
    },
    {
      title: "Badges",
      value: user?.badges?.length ? user.badges.join(", ") : "Eco Starter",
      color: cardColor,
      icon: <FaMedal className="text-blue-400 fill-yellow-400" />,
    },
  ];

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {summaryCards.map((card, i) => (
        <div
          key={i}
          className={`flex flex-col items-center justify-center p-5 rounded-2xl shadow-md w-full ${card.color}hover:scale-105 transition-transform`}
        >
          <div className="text-2xl sm:text-3xl mb-2">{card.icon}</div>
          <h3 className="text-base sm:text-lg font-semibold">{card.title}</h3>
          <p className="text-sm sm:text-base font-medium">{card.value}</p>
        </div>
      ))}
    </div>
  );
};


export default ProfileSummary;