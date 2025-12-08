import React, { useReducer, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Truck } from "lucide-react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import ReqHistoryCard from "../components/ReqHistoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";

const POINTS_PER_KG = {
  plastic: 167,
  paper: 53,
  metal: 287,
  glass: 23,
  "e-waste": 20,
  electronics: 2000,
  cardboard: 53,
  clothes: 117,
  wood: 100,
};

const initState = {
  address: "",
  material: [],
  weight: "",
  instructions: "",
  scheduled_date: "",
  time_slot: "",
  awardedPoints: 0,
  gains: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_MATERIAL": {
      const material = action.payload.toLowerCase();
      // Replace with single selection
      const currentMaterials = [material];

      // Recalculate points & gains
      const perMaterialWeight =
        state.weight && currentMaterials.length
          ? parseFloat(state.weight) / currentMaterials.length
          : 0;

      const totalPoints = currentMaterials.reduce(
        (sum, mat) => sum + (POINTS_PER_KG[mat] || 0) * perMaterialWeight,
        0
      );
      const totalGains = totalPoints * 0.15;

      return {
        ...state,
        material: currentMaterials,
        awardedPoints: Math.round(totalPoints),
        gains: parseFloat(totalGains.toFixed(2)),
      };
    }

    case "SET_WEIGHT": {
      const weight = parseFloat(action.payload) || 0;
      const perWeight = state.material.length
        ? weight / state.material.length
        : 0;
      const totalPoints = state.material.reduce(
        (sum, m) => sum + (POINTS_PER_KG[m] || 0) * perWeight,
        0
      );
      return {
        ...state,
        weight: action.payload,
        awardedPoints: Math.round(totalPoints),
        gains: parseFloat((totalPoints * 0.15).toFixed(2)),
      };
    }
    case "SET_INSTRUCTIONS":
      return { ...state, instructions: action.payload };
    case "SET_DATE":
      return { ...state, scheduled_date: action.payload };
    case "SET_TIME":
      return { ...state, time_slot: action.payload };
    case "RESET_FORM":
      return { ...initState, address: state.address };
    case "SET_DETECTED_FROM_SCANNER": {
      // action.payload = { items: [{ type, quantity, weight_kg }], totalWeight }
      const { items, totalWeight } = action.payload;

      // Prepare instructions string
      const instructions = `Detected items: ${items
        .map((i) => `${i.type} x ${i.quantity}`)
        .join(", ")} | Total weight: ${totalWeight.toFixed(2)} kg`;

      // Preselect the first detected material
      const selectedMaterial = items.length
        ? [items[0].type.toLowerCase()]
        : [];

      // Calculate points & gains
      const perMaterialWeight = selectedMaterial.length
        ? totalWeight / selectedMaterial.length
        : 0;

      const totalPoints = selectedMaterial.reduce(
        (sum, mat) => sum + (POINTS_PER_KG[mat] || 0) * perMaterialWeight,
        0
      );

      return {
        ...state,
        material: selectedMaterial,
        weight: totalWeight,
        instructions,
        awardedPoints: Math.round(totalPoints),
        gains: parseFloat((totalPoints * 0.15).toFixed(2)),
      };
    }

    default:
      return state;
  }
};

const PickupPage = () => {
  const { userData, isLoggedin, loadingUser, backendUrl } =
    useContext(AppContent);
  const [state, dispatch] = useReducer(reducer, initState);
  const [pickupHistory, setPickupHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const location = useLocation();
  // const prefilledItems = location.state?.items || [];
  const prefilledItems = location.state?.items || [];

  useEffect(() => {
    if (!prefilledItems.length) return;

    // Calculate total weight from detected items
    const totalWeight = prefilledItems.reduce(
      (sum, i) => sum + (i.weight_kg || i.weight || 0),
      0
    );

    // Dispatch to prefill the form: first material selected, weight displayed, instructions filled
    dispatch({
      type: "SET_DETECTED_FROM_SCANNER",
      payload: {
        items: prefilledItems,
        totalWeight,
      },
    });
  }, [prefilledItems]);

  // Load user address
  useEffect(() => {
    if (!isLoggedin || !userData?.id || loadingUser) return;
    axios
      .get(`${backendUrl}/api/auth/profile`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.userData.address)
          dispatch({ type: "SET_ADDRESS", payload: res.data.userData.address });
      })
      .catch(console.error);
  }, [isLoggedin, userData?.id, loadingUser, backendUrl]);

  // Fetch pickup history
  const fetchPickups = async () => {
    if (!isLoggedin) return setPickupHistory([]);
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/pickups/my`, {
        withCredentials: true,
      });
      setPickupHistory(res.data.success ? res.data.pickups.slice(0, 3) : []);
    } catch (err) {
      console.error(err);
      setPickupHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) fetchPickups();
  }, [isLoggedin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!isLoggedin) return toast.error("Please log in to schedule a pickup.");
    if (
      !state.scheduled_date ||
      !state.time_slot ||
      !state.address ||
      !state.material.length ||
      !state.weight
    ) {
      setSubmitting(false);
      return;
    }

    const itemsData = state.material.map((type) => ({
      type,
      quantity: 1,
      weight: parseFloat(state.weight) / state.material.length,
    }));

    const pickupData = {
      address: state.address,
      items: itemsData,
      weight: parseFloat(state.weight),
      instructions: state.instructions,
      pickupTime: new Date(state.scheduled_date),
      time_slot: state.time_slot,
      awardedPoints: state.awardedPoints,
      gains: state.gains,
    };

    try {
      if (editingId) {
        await axios.put(`${backendUrl}/api/pickups/${editingId}`, pickupData, {
          withCredentials: true,
        });
        setEditingId(null);
      } else {
        await axios.post(`${backendUrl}/api/pickups`, pickupData, {
          withCredentials: true,
        });
      }
      fetchPickups();
      dispatch({ type: "RESET_FORM" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setPickupHistory((prev) => prev.filter((p) => p._id !== id));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleUpdate = (pickup) => {
    setEditingId(pickup._id);
    dispatch({ type: "SET_ADDRESS", payload: pickup.address || "" });
    dispatch({ type: "SET_WEIGHT", payload: pickup.weight || 0 });
    dispatch({
      type: "SET_DATE",
      payload: pickup.pickupTime
        ? new Date(pickup.pickupTime).toISOString().split("T")[0]
        : "",
    });
    dispatch({ type: "SET_TIME", payload: pickup.time_slot || "" });
    dispatch({ type: "SET_INSTRUCTIONS", payload: pickup.instructions || "" });
    dispatch({ type: "RESET_FORM" });
    if (Array.isArray(pickup.items))
      pickup.items.forEach((item) =>
        dispatch({ type: "SET_MATERIAL", payload: item.type })
      );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loadingUser) return <LoadingSpinner />;

  return (
    <section className="mb-10 min-h-screen bg-gray-100">
      <div className="flex flex-col gap-2 mt-10 md:flex-row">
        {/* Pickup Form */}
        <div className="bg-white border-none rounded-2xl text-gray-500 p-4 flex-1">
          <div className="flex items-center">
            <Truck className="w-20 h-20" />
            <div className="ml-2">
              <h2 className="text-black leading-none">Schedule Pickup</h2>
              <p>Convenient pickup service for your recyclable materials</p>
            </div>
          </div>

          {isLoggedin && userData ? (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs md:text-sm text-blue-700">
                <span className="font-medium">Scheduling as:</span>{" "}
                {userData.name} ({userData.email})
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Note:</span> You cannot schedule
                pickups without logging in
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 mt-4 shadow-xl px-5 rounded-[20px] py-5 w-full"
          >
            {/* Date & Time */}
            <div className="flex gap-5 flex-col md:flex-row">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-black">Preferred Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={state.scheduled_date}
                  onChange={(e) =>
                    dispatch({ type: "SET_DATE", payload: e.target.value })
                  }
                  className="border-2 border-transparent rounded-xl p-2 bg-gray-100 text-gray-500 focus:outline-none focus:border-2 focus:border-black w-full"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-black">Time Slot</label>
                <select
                  required
                  value={state.time_slot}
                  onChange={(e) =>
                    dispatch({ type: "SET_TIME", payload: e.target.value })
                  }
                  className="border-2 border-transparent rounded-xl p-2 bg-gray-100 text-gray-500 focus:outline-none focus:border-2 focus:border-black w-full"
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
            <div className="flex flex-col gap-2">
              <label className="text-black">Pickup Address</label>
              <input
                type="text"
                required
                value={state.address}
                onChange={(e) =>
                  dispatch({ type: "SET_ADDRESS", payload: e.target.value })
                }
                className="border-2 border-transparent rounded-xl p-2 bg-gray-100 text-gray-500 w-full focus:outline-none focus:border-2 focus:border-black"
              />
            </div>

            {/* Materials */}
            <div className="flex flex-col gap-1">
              <label className="text-black">Material for pickup</label>
              <p className="text-xs mx-1">You can Only pick on material.</p>
              <div className="grid capitalize grid-cols-2 gap-1 md:m-1 md:gap-3">
                {[
                  "plastic",
                  "glass",
                  "cardboard",
                  "clothes",
                  "paper",
                  "metal",
                  "electronics",
                  "wood",
                ].map((item) => (
                  <div key={item}>
                    <input
                      type="checkbox"
                      id={item}
                      value={item}
                      checked={state.material.includes(item)} // only one can be selected
                      onChange={() =>
                        dispatch({ type: "SET_MATERIAL", payload: item })
                      } // replace previous selection
                      className="accent-gray-800 capitalize"
                    />
                    <label
                      htmlFor={item}
                      className="text-black ml-1 capitalize"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-2">
              <label className="text-black">Estimated Weight (kg)</label>
              <input
                type="number"
                min={0.1} // now the minimum is 0.1
                step="0.1" // allows decimal increments like 0.1
                required
                value={state.weight} // will display prefilled weight from scanner
                onChange={(e) =>
                  dispatch({ type: "SET_WEIGHT", payload: e.target.value })
                }
                className="border-2 border-transparent rounded-xl p-2 bg-gray-100 text-gray-500 w-full focus:outline-none focus:border-2 focus:border-black"
              />
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-2">
              <label className="text-black">Detected Items</label>
              <textarea
                value={state.instructions}
                onChange={(e) =>
                  dispatch({
                    type: "SET_INSTRUCTIONS",
                    payload: e.target.value,
                  })
                }
                className="border-2 border-black rounded-2xl p-2 w-full h-16 bg-transparent focus:border-2 focus:border-black"
                placeholder="Detected items will appear here — this field cannot be edited."
                readOnly
              />
            </div>

            {/* Points & Earnings */}
            {state.awardedPoints > 0 && (
              <div className="flex justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <span className="font-medium">Total Points:</span>
                <span>{state.awardedPoints} pts</span>
                <span className="font-medium ml-4">Total Earnings:</span>
                <span>{state.gains.toFixed(2)} EGP</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-[95%] mt-2 flex items-center justify-center gap-2 rounded-full p-3 transition-all cursor-pointer ${
                submitting
                  ? "bg-green-600 text-white"
                  : "bg-green-700 text-white hover:bg-green-800"
              }`}
            >
              <Truck className="mr-1" />
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Scheduling..."
                : editingId
                ? "Update"
                : "Schedule Pickup"}
            </button>

            {success && (
              <div className="mt-4 p-4 bg-[rgba(0,0,0,0.2)] border border-green-200 rounded-lg text-green-800">
                Pickup scheduled successfully! wait for confirmation.
              </div>
            )}
          </form>
        </div>

        {/* Pickup History */}
        <div className="flex flex-col gap-5 w-full md:w-[35%]">
          <div className="bg-white rounded-2xl p-4 shadow-xl px-5">
            <div className="text-start mb-4">
              <h3 className="text-black font-semibold">My Pickup History</h3>
              {isLoggedin ? (
                <p className="text-gray-500">
                  Your recent pickup requests and their status
                </p>
              ) : (
                <p className="text-gray-500">
                  Please log in to view your pickup history
                </p>
              )}
            </div>

            <div className="space-y-3">
              {loadingUser ? (
                <div className="text-center py-4">
                  <LoadingSpinner />
                </div>
              ) : !isLoggedin ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-medium">
                    Please log in to view your pickup history
                  </p>
                </div>
              ) : loading ? (
                <div className="text-center py-4">
                  <LoadingSpinner />
                </div>
              ) : pickupHistory.length > 0 ? (
                pickupHistory.map((pickup) => (
                  <ReqHistoryCard
                    key={pickup._id}
                    date={new Date(pickup.createdAt).toLocaleDateString(
                      "en-EG"
                    )}
                    material={pickup.items.map((i) => i.type).join(", ")}
                    items={pickup.items}
                    time={pickup.time_slot}
                    status={pickup.status}
                    address={pickup.address}
                    weight={pickup.weight}
                    scheduledDate={new Date(
                      pickup.pickupTime
                    ).toLocaleDateString("en-EG")}
                    requestId={pickup._id}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    points={pickup.awardedPoints}
                    gains={pickup.gains}
                    instructions={pickup.instructions} // <-- add this
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-medium">
                    No pickup history found
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Schedule your first pickup above to get started!
                  </p>
                </div>
              )}
            </div>

            {isLoggedin && pickupHistory.length > 0 && (
              <div className="flex justify-around mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs">To see the rest Pickups ,Check your profile</p>
                <button
                  onClick={fetchPickups}
                  className="text-green-700 hover:text-green-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Refresh History
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 text-black space-y-2 shadow-xl px-5">
            {[
              "Convenient door-to-door service",
              "Proper sorting and handling",
              "Flexible scheduling options",
              "Real-time updates",
              "Earn points for every pickup",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
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
