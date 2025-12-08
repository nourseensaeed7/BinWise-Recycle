import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const tabs = [
  { id: "centers", label: "Find Centers", path: "centers" },
  { id: "pickup", label: "Schedule Pickup", path: "pickup" },
];

const PickupAndDropoff = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent flashing by delaying UI until routing is resolved
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (location.pathname === "/pickup-and-dropoff") {
      navigate("centers", { replace: true });
    } else {
      setReady(true); // Allow UI to show
    }
  }, [location.pathname, navigate]);

  // BLOCK RENDERING to prevent flashing
  if (!ready) return null;

  const activeTab = location.pathname.split("/").pop();

  return (
    <section>
      <NavBar />
    <div  className="overflow-x-hidden">
      <div className="bg-gray-100 min-h-full pb-10">
        <div className="mx-6">
          <h1 className="text-3xl font-bold text-gray-900 py-6">
            Pickup & Drop-off
          </h1>
          <p className="text-gray-600">
            Find nearby recycling centers or schedule convenient pickup services.
          </p>
        </div>

        <div className="m-6">
          <div className="relative flex bg-gray-200 rounded-full p-1">
            <div
              className={`
                absolute h-[85%] w-[49.5%] bg-white rounded-full shadow-md
                transition-all duration-300 ease-in-out
                ${activeTab === "pickup" ? "translate-x-full" : "translate-x-0"}
              `}
            ></div>

            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`
                  relative z-10 w-1/2 py-2 text-center font-medium transition-all
                  ${activeTab === tab.id ? "text-black" : "text-gray-500"}
                `}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
      </div>
    </section>
  );
};

export default PickupAndDropoff;
