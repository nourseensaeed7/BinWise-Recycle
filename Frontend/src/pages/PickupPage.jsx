import React, { useReducer, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Truck } from "lucide-react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import ReqHistoryCard from "../components/ReqHistoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";

const initState = {
  address: "",
  material: [],
  weight: "",
  instructions: "",
  scheduled_date: null,
  time_slot: null,
  created_at: new Date().toLocaleDateString("en-EG", {
    timeZone: "Africa/Cairo",
    awardedPoints: 0,
    gains: 0,
  }),
};

const reducers = (state, action) => {
  switch (action.type) {
    case "SET_DATE":
      return { ...state, scheduled_date: action.payload };
    case "SET_TIME":
      return { ...state, time_slot: action.payload };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_MATERIAL": {
      const material = action.payload.toLowerCase();
      const currentMaterials = state.material;
      if (currentMaterials.includes(material)) {
        return { ...state, material: currentMaterials.filter((m) => m !== material) };
      }
      return { ...state, material: [...currentMaterials, material] };
    }
    case "SET_DETECTED_MATERIALS":
      return { ...state, material: action.payload.map((m) => m.toLowerCase()) };
    case "SET_WEIGHT":
      return { ...state, weight: action.payload };
    case "SET_INSTRUCTIONS":
      return { ...state, instructions: action.payload };
    case "RESET_FORM":
      return {
        ...initState,
        created_at: new Date().toLocaleDateString("en-EG", {
          timeZone: "Africa/Cairo",
        }),
      };
      case "SET_PONTS":
      return { ...state, awardedPoints: action.payload };
      case "SET_GAINS":
      return { ...state, gains: action.payload };
    default:
      return state;
  }
};

const PickupPage = () => {
  const { userData, isLoggedin, loadingUser, refreshUserData, backendUrl } = useContext(AppContent);
  const location = useLocation();
  const prefilledItems = location.state?.items || []; // Expecting array of objects when present (B)

  const [state, dispatch] = useReducer(reducers, initState);
  const [submited, setSubmited] = useState(false);
  const [pickupHistory, setPickupHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingPickupId, setEditingPickupId] = useState(null);

  // Prefill AI-detected items (expects objects: { type, quantity, baseWeight, points, estimatedValue })
  useEffect(() => {
    if (!prefilledItems || !prefilledItems.length) return;

    const detectedMaterials = prefilledItems.map((i) => i.type);
    dispatch({ type: "SET_DETECTED_MATERIALS", payload: detectedMaterials });

    const totalWeight = prefilledItems.reduce(
      (sum, i) => sum + (i.baseWeight || 0) * (i.quantity || 1),
      0
    );
    dispatch({ type: "SET_WEIGHT", payload: totalWeight ? totalWeight.toFixed(2) : "" });

    dispatch({
      type: "SET_INSTRUCTIONS",
      payload: `Detected: ${prefilledItems.map((i) => `${i.quantity || 1}× ${i.type}`).join(", ")}`,
    });
  }, [prefilledItems]);

  // Fetch user's pickup history
  const fetchMyPickups = async () => {
    if (!isLoggedin || !userData?.id) return setPickupHistory([]);
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/pickups/my`, { withCredentials: true });
      if (res.data?.success) {
        setPickupHistory(res.data.pickups.slice(0, 3));
      } else {
        setPickupHistory([]);
      }
    } catch (err) {
      console.error("Error fetching pickups:", err);
      setPickupHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.id && !loadingUser) fetchMyPickups();
    else setPickupHistory([]);
  }, [isLoggedin, userData?.id, loadingUser]);

const calculatePointsAndDistributeWeight = (items, totalWeight) => {
  const POINTS_PER_KG = {
    Plastic: 167,
    plastic: 167,
    Paper: 53,
    paper: 53,
    Metal: 287,
    metal: 287,
    Glass: 23,
    glass: 23,
    "E-Waste": 20,
    "e-waste": 20,
    electronics: 2000,
    Electronics: 2000,
    cardboard: 53,
    Cardboard: 53,
    clothes:117,
    Clothes:117,
  };
  
  // Check if items already have weights
  const totalItemWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);
  const hasItemWeights = totalItemWeight > 0;
  
  let processedItems = [...items];
  
  // If items don't have individual weights, distribute total weight evenly
  if (!hasItemWeights && totalWeight > 0) {
    const weightPerItem = totalWeight / items.length;
    processedItems = items.map(item => ({
      ...item,
      weight: weightPerItem
    }));
  }
  
  // Calculate total points
  const totalPoints = processedItems.reduce((acc, item) => {
    const perKg = POINTS_PER_KG[item.type] || 0;
    return acc + perKg * (item.weight || 0);
  }, 0);
  
  return {
    processedItems,
    totalPoints: Math.round(totalPoints) // Round to nearest integer
  };
};

//GAINS CALCULATION: 1 point = 0.15 EGP
const calculateGains = (points) => {
  return parseFloat((points * 0.15).toFixed(2));
};

  // Submit pickup (supports AI-prefilled items and manual simple-material -> convert to objects)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmited(true);

    if(!isLoggedin){
      return toast.error("Please log in to schedule a pickup.");
    }

    if (
      !state.scheduled_date ||
      !state.time_slot ||
      !state.address ||
      (state.material.length === 0 && prefilledItems.length === 0) ||
      !state.weight
    ) {
      setSubmited(false);
      return;
    }

    // Build items payload (B: objects expected by backend)
    const itemsData = prefilledItems.length
      ? prefilledItems.map((item) => ({
          type: item.type,
          quantity: item.quantity || 1,
          weight: item.baseWeight || item.weight || 0,
          points: item.points || 0,
          estimatedValue: item.estimatedValue || 0,
        }))
      : state.material.map((type) => ({ type, quantity: 1 }));

    const pickupData = {
      address: state.address,
      items: itemsData,
      weight: parseFloat(state.weight),
      instructions: state.instructions,
      pickupTime: new Date(state.scheduled_date),
      time_slot: state.time_slot,
      awardedPoints: calculatePointsAndDistributeWeight(itemsData, parseFloat(state.weight)).totalPoints,
      gains: calculateGains(calculatePointsAndDistributeWeight(itemsData, parseFloat(state.weight)).totalPoints)
    };

    try {
      // If editing, call PUT
      if (editingPickupId) {
        await axios.put(`${backendUrl}/api/pickups/${editingPickupId}`, pickupData, { withCredentials: true });
        setEditingPickupId(null);
      } else {
        await axios.post(`${backendUrl}/api/pickups`, pickupData, { withCredentials: true });
      }

      // If items were prefilling from AI, reward points & log activities
      if (prefilledItems.length) {
        const activities = prefilledItems.map((item) => ({
          action: `Recycled ${item.quantity || 1}× ${item.type}`,
          points: item.points || 0,
          date: new Date(),
        }));

        try {
          await axios.post(
            `${backendUrl}/api/auth/add-activity`,
            { activities },
            { withCredentials: true }
          );
          // refresh user data to reflect points
          if (typeof refreshUserData === "function") await refreshUserData();
        } catch (err) {
          console.warn("Failed to add activities after pickup:", err);
        }
      }

      fetchMyPickups();
      dispatch({ type: "RESET_FORM" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating/updating pickup:", err);
    } finally {
      setSubmited(false);
    }
  };

  // Remove pickup from list locally (called by ReqHistoryCard after successful delete)
  const handleDeletePickup = (pickupId) => {
    console.log(" Removing pickup from list:", pickupId);
    setPickupHistory((prev) => prev.filter((p) => p._id !== pickupId));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Populate form for editing
  const handleUpdatePickup = (pickupData) => {
 setEditingPickupId(pickupData._id || pickupData.id || null);

    // pickupData expected to include: address, weight, time_slot, pickupTime, items, _id
    dispatch({ type: "SET_ADDRESS", payload: pickupData.address || "" });
    dispatch({ type: "SET_WEIGHT", payload: pickupData.weight || 0 });
    dispatch({ type: "SET_TIME", payload: pickupData.time_slot || "" });

    if (pickupData.pickupTime) {
      const isoDate = new Date(pickupData.pickupTime).toISOString().split("T")[0];
      dispatch({ type: "SET_DATE", payload: isoDate });
    }

    // set materials from items array
    if (Array.isArray(pickupData.items)) {
  
      pickupData.items.forEach((item) => {
        const material = (item.type || item.category || item).toLowerCase();
        dispatch({ type: "SET_MATERIAL", payload: material });
      });
    }

    dispatch({ type: "SET_INSTRUCTIONS", payload: pickupData.instructions || "" });

    window.scrollTo({ top: 0, behavior: "smooth" });
   
  };

  if (loadingUser) return <LoadingSpinner />;

  return (
    <section id="pickup" className="mb-10 min-h-screen bg-gray-100 ">
      <div className="flex flex-col gap-2 mt-10 md:flex-row">
        <div className="bg-white border-none rounded-2xl text-gray-500 p-4 flex-1">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-truck-icon"
            >
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
              <path d="M15 18H9" />
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
              <circle cx="17" cy="18" r="2" />
              <circle cx="7" cy="18" r="2" />
            </svg>

            <div className="ml-2">
              <h2 className="text-black text-start leading-none">Schedule Pickup</h2>
              <p>Convenient pickup service for your recyclable materials</p>
            </div>
          </div>

          {/* User Status Info */}
          {isLoggedin && userData ? (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs md:text-sm  text-blue-700">
                <span className="font-medium">Scheduling as:</span> 
                {userData.name} ({userData.email})
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Note:</span> You can schedule pickups without logging in for testing purposes
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4 shadow-xl px-5 rounded-[20px] py-5 w-full">
            {/* Date + Time */}
            <div className="flex gap-5 flex-col md:flex-row">
              <div className="flex flex-col items-start gap-2 flex-1">
                <label htmlFor="date" className="text-black">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  value={state.scheduled_date || ""}
                  onChange={(e) => dispatch({ type: "SET_DATE", payload: e.target.value })}
                  className="border-2 border-transparent  rounded-xl p-2 bg-gray-100 text-gray-500 focus:outline-none focus:border focus:border-2 focus:border-solid focus:border-black transtion duration-100 w-full"
                />
              </div>

              <div className="flex flex-col items-start gap-2 flex-1">
                <label htmlFor="time" className="text-black">
                  Time Slot
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  value={state.time_slot || ""}
                  onChange={(e) => dispatch({ type: "SET_TIME", payload: e.target.value })}
                  className="border-2 border-transparent rounded-xl p-2 bg-gray-100 text-gray-500 focus:outline-none  focus:border-2 focus:border-solid focus:border-black transtion duration-100 w-full"
                >
                  <option value="" disabled>
                    Select time slot
                  </option>
                  <option value="10AM-12PM">10AM-12PM</option>
                  <option value="4PM-5PM">4PM-5PM</option>
                  <option value="7PM-8PM">7PM-8PM</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="address" className="text-black">
                Pickup Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter your pickup address"
                required
                value={state.address}
                onChange={(e) => dispatch({ type: "SET_ADDRESS", payload: e.target.value })}
                className="border-2 border-transparent  rounded-xl p-2 bg-gray-100  focus:border-2 focus:border-solid focus:border-black transtion duration-100 text-gray-500 w-full focus:outline-none"
              />
            </div>

            {/* Material */}
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="material" className="text-black">
                Material for pickup
              </label>

                <div className="grid grid-cols-2 gap-1 md:m-1 md:gap-3">
                  {["plastic", "glass", "cardboard","clothes","paper", "metal", "electronics"].map((item) => (
                    <div key={item}>
                      <input
                        type="checkbox"
                        id={item}
                        value={item}
                        checked={state.material.includes(item)}
                        onChange={(e) => dispatch({ type: "SET_MATERIAL", payload: e.target.value })}
                        className="accent-gray-800"
                      />
                      <label htmlFor={item} className="text-black ml-1  capitalize">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
            </div>

            {/* Weight */}
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="weight" className="text-black">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                placeholder="e.g. 5"
                min={1}
                required
                /* value={state.weight|| 0} */
                onChange={(e) => dispatch({ type: "SET_WEIGHT", payload: e.target.value })}
                className="border-2 border-transparent  rounded-xl p-2 bg-gray-100 text-gray-500 w-full focus:outline-none focus:border-2 focus:border-solid focus:border-black transtion duration-100"
              />
            </div>

            {/* Instructions */}
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="instructions" className="text-black">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                placeholder="Any special instructions for pickup"
                value={state.instructions}
                onChange={(e) => dispatch({ type: "SET_INSTRUCTIONS", payload: e.target.value })}
                className="border-2 border-black rounded-2xl p-2 w-full h-16 bg-transparent focus:border-2 focus:border-solid focus:border-black transtion duration-100"
              ></textarea>
            </div>

      

            <button
              type="submit"
              disabled={submited}
              className={`w-[95%] mt-2 flex items-center justify-center gap-2 rounded-full p-3 transition-all cursor-pointer ${
                submited ? "bg-green-600 text-white " : "bg-green-700 text-white hover:bg-green-800"
              }`}
            >
              <Truck className="mr-1" />
              {submited && userData ? (editingPickupId ? "Updating..." : "Scheduling...") : editingPickupId ? "Update" : "Schedule Pickup"}
            </button>
          </form>

          {success && (
            <div className="mt-4 p-4 bg-[rgba(0,0,0,0.2)]  border border-green-200 rounded-lg text-green-800">
              Pickup scheduled successfully! wait for confirmation.
            </div>
          )}
        </div>

        {/* Pickup History */}
        <div className="flex flex-col gap-5 w-full md:w-[35%]">
          <div className="bg-white rounded-2xl p-4 shadow-xl px-5">
            <div className="text-start mb-4">
              <h3 className="text-black font-semibold">My Pickup History</h3>
              {isLoggedin && userData ? (
                <p className="text-gray-500">Your recent pickup requests and their status</p>
              ) : (
                <p className="text-gray-500">Please log in to view your pickup history</p>
              )}
            </div>

            <div className="space-y-3">
              {loadingUser ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading user data...</p>
                </div>
              ) : !isLoggedin ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">Please log in to view your pickup history</p>
                  <p className="text-sm text-gray-400 mt-2">You need to be logged in to schedule and track pickups</p>
                </div>
              ) : loading ? (
                <div className="text-center py-4">
                  <LoadingSpinner />
                </div>
              ) : pickupHistory.length > 0 ? (
                pickupHistory.map((pickup) => (
                  <ReqHistoryCard
                    key={pickup._id}
                    date={new Date(pickup.createdAt).toLocaleDateString("en-EG", { timeZone: "Africa/Cairo" })}
                    material={Array.isArray(pickup.items) ? pickup.items.map((i) => i.type || i).join(", ") : pickup.items}
                    items={pickup.items}
                    time={pickup.time_slot}
                    status={pickup.status}
                    address={pickup.address}
                    weight={pickup.weight}
                    scheduledDate={new Date(pickup.pickupTime).toLocaleDateString()}
                    requestId={pickup._id}
                    onDelete={handleDeletePickup}
                    onUpdate={handleUpdatePickup}
                    refreshHistory={fetchMyPickups}
                    backendUrl={backendUrl}
                    agentName={pickup.deliveryAgentId?.name || ""}
                    points={pickup.awardedPoints}
                    gains={pickup.gains}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No pickup history found</p>
                  <p className="text-sm text-gray-400 mt-2">Schedule your first pickup above to get started!</p>
                </div>
              )}
            </div>

            {isLoggedin && pickupHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button onClick={fetchMyPickups} className="text-green-700 hover:text-green-800 text-sm font-medium transition-colors cursor-pointer">
                  Refresh History
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-white  rounded-2xl p-4 text-black space-y-2 shadow-xl px-5">
            {[
              "Convenient door-to-door service",
              "Proper sorting and handling",
              "Flexible scheduling options",
              "Real-time updates",
              "Earn points for every pickup",
            ].map((text, i) => (
              <div key={i} className="flex items-center  gap-2">
                {/* <svg
                  width="30"
                  height="30"
                  fill="#004932"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#004932"
                >
                  <path d="M177.6,80.43a10,10,0,1,0-19.5,4.5,60.76,60.76,0,0,1-6,44.5c-16.5,28.5-53.5,38.5-82,22-28.5-16-38.5-53-22-81.5s53.5-38.5,82-22a9.86,9.86,0,1,0,10-17c-38.5-22.5-87-9.5-109.5,29a80.19,80.19,0,1,0,147,20.5Z" />
                </svg> */}
                <FaCheckCircle className="text-green-600 text-xl" />

                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PickupPage;
