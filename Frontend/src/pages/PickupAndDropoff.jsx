import React, { useState } from "react";
import NavBar from "../components/NavBar";
import PickupPage from "./PickupPage";
import CentersPage from "./CentersPage";
import Footer from "../components/Footer";

const tabs = [
  { id: "centers", label: "Find Centers" },
  { id: "pickup", label: "Schedule Pickup" },
];

const PickupAndDropoff = () => {
  const [activePage, setActivePage] = useState("centers");
  const handlePageChange = (newPage) => {
    setActivePage(newPage);
    window.location.href = `#${newPage}`;
  };
  return (
    <section className="overflow-x-hidden">
      <NavBar />
      <div className="bg-gray-100 min-h-full pb-10">
        {/* Header */}
        <div className="mx-6">
          <h1 className="text-3xl font-bold  text-gray-900 py-6">
            Pickup & Drop-off
          </h1>
          <p className="text-gray-600">
            Find nearby recycling centers or schedule convenient pickup services
            for your recyclable materials.
          </p>
        </div>

        <div className="m-6">
          <div className="relative flex bg-gray-200 rounded-full  p-1">
            {/* Sliding Background */}
            <div
              className={`
      absolute h-[85%] w-[49.5%] bg-white rounded-full shadow-md transition-all  duration-300 ease-in-out 
      ${activePage === "pickup" ? "translate-x-full" : "translate-x-0"}
    `}
            ></div>

            {/* Buttons using map() */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handlePageChange(tab.id)}
                className={`
        relative z-10 w-1/2 py-2 font-medium text-center transition-all duration-300 cursor-pointer
        ${activePage === tab.id ? "text-black" : "text-gray-500"}
      `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Page content */}
          <div className="mt-6">
            {activePage === "centers" ? <CentersPage /> : <PickupPage />}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default PickupAndDropoff;
