import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Toast from "./Toast";

const ReqHistoryCard = ({
  date,
  items,           // Array of objects [{ type, quantity, weight }]
  time,
  status,
  address,
  weight,
  scheduledDate,
  requestId,
  onDelete,
  onUpdate,
  points,
  gains,
  instructions,    // <-- new prop
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const displayMaterial = () => {
    if (!items || !items.length) return "N/A";
    return items.map(item => `${item.type}${item.quantity > 1 ? ` x${item.quantity}` : ""}`).join(", ");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setShowDeleteConfirm(false);

    try {
      const res = await api.delete(`/pickups/${requestId}`);
      if (res.data.success) {
        showToast("Pickup deleted successfully", "success");
        if (onDelete) onDelete(requestId);
      } else {
        showToast(res.data.message || "Failed to delete pickup", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete pickup";
      showToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModify = () => {
    if (onUpdate) {
      onUpdate({
        id: requestId,
        address,
        items,
        weight,
        time_slot: time,
        pickupTime: scheduledDate,
        instructions: instructions || "",
      });
      showToast("Editing pickup request - Update the form below", "info");
    }
  };

  const isPending = status?.toLowerCase() === "pending";
  const isCompleted = status?.toLowerCase() === "completed";

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", showDeleteConfirm);
    return () => document.body.classList.remove("overflow-hidden");
  }, [showDeleteConfirm]);

  return (
    <section>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex place-self-center-safe w-full flex-col bg-transparent border-2 border-black rounded-[20px] relative text-start p-3 mb-3">
        <div className="pr-20">
          {requestId && <p className="text-gray-400 text-xs font-mono">ID: {requestId.slice(-8)}</p>}
          <h3 className="font-black text-black text-sm">Requested: {date}</h3>
          {scheduledDate && <p className="text-gray-600 text-xs">Scheduled: {scheduledDate}</p>}
          <p className="text-gray-500 text-xs mt-1">Time: {time}</p>
          <p className="text-gray-500 text-xs">Materials: {displayMaterial()}</p>
          {address && <p className="text-gray-500 text-xs">Address: {address}</p>}
          {weight && <p className="text-gray-500 text-xs">Weight: {weight} kg</p>}
          <p className="text-gray-500 text-xs">Points: {points || 0} pt</p>
          <p className="text-gray-500 text-xs">Earning: {gains?.toFixed(2) || 0} LE</p>

          {/* Instructions */}
          {instructions && (
            <p className="text-gray-500 text-xs mt-1">{instructions}</p>
          )}
        </div>

        <div className="flex gap-1.5 mt-3">
          <button
            onClick={handleModify}
            disabled={!isPending || isModifying}
            className={`bg-transparent border-2 border-black rounded-[10px] px-3 py-1 text-[10px] flex justify-center items-center transition-colors ${
              isPending && !isModifying
                ? "text-black hover:bg-black hover:text-white cursor-pointer"
                : "text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
            }`}
            title={!isPending ? "Only pending pickups can be modified" : "Modify pickup"}
          >
            {isModifying ? "Modifying..." : "Modify"}
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isCompleted || isDeleting}
            className={`bg-transparent border-2 rounded-[10px] px-3 py-1 text-[10px] flex justify-center items-center transition-colors ${
              !isCompleted && !isDeleting
                ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                : "border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
            }`}
            title={isCompleted ? "Cannot delete completed pickups" : "Delete pickup"}
          >
            {isDeleting ? "Deleting..." : "Cancel"}
          </button>
        </div>

        <div className={`${getStatusColor(status)} rounded-xl px-2 py-1 absolute top-2.5 right-2 text-xs font-medium`}>
          <p>{formatStatus(status)}</p>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-11 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Pickup Request?</h3>
            <p className="text-gray-600 text-center mb-2">Are you sure you want to delete this pickup request?</p>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>

            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-900">{requestId.slice(-8)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900">{scheduledDate}</span>
              </div>
              <div className="flex flex-col justify-between sm:flex-row md:flex-row">
                <span className="text-gray-600">Materials:</span>
                <span className="text-gray-900">{displayMaterial()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Keep Request
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReqHistoryCard;
