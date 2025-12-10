import React, { useEffect, useState, useMemo, useContext } from "react";
import NavBar from "../components/NavBar.jsx";
import { AppContent } from "../context/AppContext";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export default function AdminDashboard() {
  const [pickups, setPickups] = useState([]);
  const [agents, setAgents] = useState([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [activePickup, setActivePickup] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // ✅ Get socket and userData from context
  const { socket, userData } = useContext(AppContent);

  useEffect(() => {
    const loadData = async () => {
      await fetchPickups();
      await fetchAgents();
    };
    loadData();
  }, []);

  // ✅ NEW: Join admin room when socket connects
  useEffect(() => {
    if (!socket || !userData) {
      console.log("⚠️ Socket or user data not available yet");
      return;
    }

    // Only join admin room if user is actually an admin
    if (userData.role === 'admin') {
      console.log("🔑 Joining admin room...");
      socket.emit('join-admin-room');
      
      // Optional: Listen for confirmation (if your backend sends one)
      socket.once('authenticated', (data) => {
        console.log("✅ Admin authenticated in admin room:", data);
      });
    } else {
      console.log("⚠️ User is not admin, skipping admin room join");
    }
  }, [socket, userData]);

  // ✅ Socket listeners for real-time updates
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not available in AdminDashboard");
      return;
    }

    console.log("📡 Setting up socket listeners in AdminDashboard");

    // Listen for new pickups
    const handleNewPickup = (data) => {
      console.log("🆕 New pickup received in admin:", data);
      fetchPickups(); // Refresh the list
    };

    // Listen for pickup updates
    const handlePickupUpdated = (data) => {
      console.log("✏️ Pickup updated in admin:", data);
      fetchPickups();
    };

    // Listen for pickup completion
    const handlePickupCompleted = (data) => {
      console.log("✅ Pickup completed in admin:", data);
      fetchPickups();
    };

    // Listen for pickup deletion
    const handlePickupDeleted = (data) => {
      console.log("🗑️ Pickup deleted in admin:", data);
      fetchPickups();
    };

    // Listen for pickup assignment
    const handlePickupAssigned = (data) => {
      console.log("🚚 Pickup assigned in admin:", data);
      fetchPickups();
    };

    // Register all event listeners
    socket.on("new-pickup", handleNewPickup);
    socket.on("pickup-updated", handlePickupUpdated);
    socket.on("pickup-completed", handlePickupCompleted);
    socket.on("pickup-deleted", handlePickupDeleted);
    socket.on("pickup-assigned", handlePickupAssigned);

    // Cleanup listeners on unmount
    return () => {
      socket.off("new-pickup", handleNewPickup);
      socket.off("pickup-updated", handlePickupUpdated);
      socket.off("pickup-completed", handlePickupCompleted);
      socket.off("pickup-deleted", handlePickupDeleted);
      socket.off("pickup-assigned", handlePickupAssigned);
      console.log("🧹 Socket listeners cleaned up in AdminDashboard");
    };
  }, [socket]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const fetchPickups = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pickups`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPickups(data.pickups || []);
      }
    } catch (err) {
      console.error("Fetch pickups error:", err);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/delivery-agents`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setAgents(data.agents || []);
    } catch (err) {
      console.error("Fetch agents error:", err);
    }
  };

  // Open modal for assigning pickup
  const openAssignModal = (pickup) => {
    setActivePickup({
      ...pickup,
      deliveryAgentId: pickup.deliveryAgentId?._id || "",
    });
    setSelectedDate(
      pickup.pickupTime
        ? new Date(pickup.pickupTime).toISOString().slice(0, 16)
        : ""
    );
    setOpenAssign(true);
  };

  // Assign pickup to agent
  const handleAssign = async () => {
    if (!activePickup.deliveryAgentId) return alert("Select agent");

    console.log("🚚 Attempting to assign pickup:");
    console.log("   Pickup ID:", activePickup._id);
    console.log("   Selected Agent ID:", activePickup.deliveryAgentId);
    console.log("   Available agents:", agents);

    try {
      const res = await fetch(`${API_URL}/api/pickups/${activePickup._id}/assign`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          deliveryAgentId: activePickup.deliveryAgentId,
          pickupTime: selectedDate,
        }),
      });
      const data = await res.json();

      if (data.success) {
        console.log("✅ Full assignment response:", JSON.stringify(data, null, 2));
        console.log("✅ Agent info:", data.pickup?.deliveryAgentId);
        
        // If agent info is missing, fetch fresh data
        if (!data.pickup?.deliveryAgentId) {
          console.log("⚠️ Agent info missing in response, fetching fresh data...");
          await fetchPickups();
        } else {
          // Update local state immediately with the response data
          setPickups((prev) =>
            prev.map((p) =>
              p._id === activePickup._id ? data.pickup : p
            )
          );
        }
        
        setOpenAssign(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Assign pickup error:", err);
    }
  };

  // Mark pickup as completed
  const handleComplete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/pickups/${id}/complete`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        // ✅ Socket event will trigger fetchPickups automatically
        // But we can also update immediately
        setPickups((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: "completed" } : p))
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Complete pickup error:", err);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = pickups.length;
    const pending = pickups.filter((p) => p.status === "pending").length;
    const assigned = pickups.filter((p) => p.status === "assigned").length;
    const completed = pickups.filter((p) => p.status === "completed").length;
    return { total, pending, assigned, completed };
  }, [pickups]);

  // Filtered pickups, sorted by most recent first
  const filteredPickups = useMemo(() => {
    let filtered = pickups;
    if (statusFilter !== "all") {
      filtered = pickups.filter((p) => p.status === statusFilter);
    }
    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [pickups, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <h1 className="text-2xl font-semibold m-6">Recycling Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 m-6">
        <StatCard title="Total Pickups" value={stats.total} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Assigned" value={stats.assigned} />
        <StatCard title="Completed" value={stats.completed} />
      </div>

      {/* Filter */}
      <div className="m-6 mb-3 flex items-center gap-4">
        <label className="text-sm font-medium">Filter by status:</label>
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Pickup Table */}
      <div className="bg-white rounded-2xl shadow-sm p-4 m-6">
        <h2 className="text-lg font-medium mb-3">Pickup Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">User</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Assigned Agent</th>
                <th className="p-2">Status</th>
                <th className="p-2">Pickup Time</th>
                <th className="p-2">Created At</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPickups.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">
                    {p.userId ? `${p.userId.name} (${p.userId.email})` : "—"}
                  </td>
                  <td className="p-2">
                    {p.userId?.phone || "—"}
                  </td>
                  <td className="p-2">
                    {p.deliveryAgentId
                      ? `${p.deliveryAgentId.name} (${p.deliveryAgentId.email})`
                      : "—"}
                  </td>
                  <td className="p-2 capitalize">{p.status}</td>
                  <td className="p-2">
                    {p.pickupTime
                      ? new Date(p.pickupTime).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    {p.status === "pending" && (
                      <button
                        onClick={() => openAssignModal(p)}
                        className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
                      >
                        Assign
                      </button>
                    )}
                    {p.status === "assigned" && (
                      <button
                        onClick={() => handleComplete(p._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
                      >
                        Complete
                      </button>
                    )}
                    {p.status === "completed" && (
                      <span className="text-gray-500 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {openAssign && activePickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setOpenAssign(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <h3 className="text-lg font-semibold mb-3">
              Assign Pickup for {activePickup.userId?.name || "Unknown User"}
            </h3>

            <label className="block text-sm text-gray-600 mb-2">
              Assign To (Delivery Agent):
            </label>
            <select
              className="w-full border rounded-md p-2 mb-4"
              value={activePickup.deliveryAgentId || ""}
              onChange={(e) =>
                setActivePickup({
                  ...activePickup,
                  deliveryAgentId: e.target.value,
                })
              }
            >
              <option value="">-- Select Agent --</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>

            <label className="block text-sm text-gray-600 mb-2">
              Scheduled Date & Time:
            </label>
            <input
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenAssign(false)}
                className="px-4 py-2 border rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
              >
                Confirm Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}