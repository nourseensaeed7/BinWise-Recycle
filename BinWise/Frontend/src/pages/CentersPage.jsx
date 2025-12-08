import React, { useState, useEffect } from "react";
import CentersCard from "../components/CentersCard";
import MapComp from "../components/MapComp";
import { MapPinHouse } from 'lucide-react';
import api from "../api/axios";

const CentersPage = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, inactive

  // Function to fetch all centers
  const fetchAllCenters = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(" Fetching centers from API...");
      
      const queryParam = filter !== "all" ? `?status=${filter}` : "";
      const response = await api.get(`/centers${queryParam}`);
      
      console.log("Centers fetched:", response.data);
      
      if (response.data.success) {
        setCenters(response.data.centers);
        console.log(` Total centers: ${response.data.centers.length}`);
      }
    } catch (error) {
      console.error(" Error fetching centers:", error);
      setError(error.response?.data?.message || "Failed to fetch centers");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  fetchAllCenters();
}, [filter]);
  return (
    <section className="min-h-screen bg-gray-100 pb-10">
      {/* Map and Centers */}
      <div className="flex flex-col lg:flex-row gap-6 py-3 rounded-2xl ">
        {/* Map */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-2xl h-fit shadow-md">
       <div className="flex gap-2 items-center">
         <MapPinHouse />
        <h2 className="text-2xl bold">Map</h2>
       </div>
       <p className="text-gray-600 mb-2"> Find the nearst recycling centers on the map below.</p>
          <div className="bg-white rounded-2xl  overflow-hidden relative z-0">
            <MapComp centers={centers} />
          </div>
        </div>

        {/* Centers List */}
        <div className="w-full lg:w-1/2 ">
          <h3 className="text-2xl">Nearby Centers</h3>
          <div className="flex flex-col gap-4 mt-4 bg-white p-6 rounded-2xl shadow-md">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700"> {error}</p>
                <button
                  onClick={fetchAllCenters}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : centers.length > 0 ? (
              centers.map((center) => (
                <CentersCard
                  key={center._id}
                  centerId={center._id}
                  centerName={center.name}
                  address={center.address}
                  number={center.contact}
                  schedule={center.operatingHours}
                  acceptedMaterials={center.acceptedMaterials}
                  status={center.status}
                />
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No centers found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
  </div>
);

export default CentersPage;