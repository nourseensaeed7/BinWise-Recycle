import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import {toast} from "react-toastify";

const ProfileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "Guest User",
    email: "guest@example.com",
    address: "Enter your address",
    profileImage: null,
    level: "Beginner",
    daysRecycled: 0,
    points: 0,
    Gains: 0,
  });
  
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user data
        const res = await axios.get("/api/auth/profile", { withCredentials: true });
        if (res.data.success) setUser(res.data.userData);

        // Fetch user pickups
        const pickupsRes = await axios.get("/api/pickups/my", { withCredentials: true });
        if (pickupsRes.data.success) {
          const pickups = pickupsRes.data.pickups;

          const uniqueDays = new Set(pickups.map((p) => new Date(p.createdAt).toDateString()));

          const totalPointsFromPickups = pickups.reduce(
            (acc, p) => acc + (p.awardedPoints || 0),
            0
          );

          // Update formData with fetched data
          setFormData({
            name: res.data.userData.name,
            email: res.data.userData.email,
            address: res.data.userData.address || "Enter your address",
            // Add server URL to profile image if it exists
            profileImage: res.data.userData.profileImage 
            ? `${import.meta.env.VITE_BACKEND_URL}${res.data.userData.profileImage}`
            : null,
            level: res.data.userData.level || "Beginner",
            daysRecycled: uniqueDays.size,
            points: totalPointsFromPickups,
            Gains: totalPointsFromPickups * 0.15, 
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData({ ...formData, [name]: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("address", formData.address);
      
      // Only append image if it's a new file (File object)
      if (formData.profileImage && formData.profileImage instanceof File) {
        submitData.append("profileImage", formData.profileImage);
      }

      // Send update request
      const res = await axios.put("/api/auth/update-profile", submitData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        // Update local state with new data
        setUser(res.data.userData);
        
        // Update formData with response (including new image URL)
        setFormData(prev => ({
          ...prev,
          address: res.data.userData.address,
          profileImage: res.data.userData.profileImage 
          ? `${import.meta.env.VITE_BACKEND_URL}${res.data.userData.profileImage}`
           : prev.profileImage,
        }));
        
        setIsOpen(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
        <img
          src={
            formData.profileImage
              ? typeof formData.profileImage === "string"
                ? formData.profileImage
                : URL.createObjectURL(formData.profileImage)
              : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="Profile"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-green-500 object-cover shadow-md"
        />
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{formData.name}</h2>
          <p className="text-gray-500 text-xs sm:text-sm">{formData.email}</p>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">{formData.address}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full shadow-sm">
              Level: {formData.level}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full shadow-sm">
              Days Recycled: {formData.daysRecycled}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full shadow-sm">
              Points: {formData.points}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full shadow-sm">
              Gains: {formData.Gains.toFixed(2)} EGP
            </span>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-3 sm:mt-0">
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition font-medium whitespace-nowrap"
        >
          Edit Profile
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-6 w-full max-w-100 relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="name" className="font-medium">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
                readOnly
              />
              <label htmlFor="email" className="font-medium">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
                readOnly
              />
              <label htmlFor="address" className="font-medium">Address:</label>
              <input
                id="address"
                type="text"
                name="address"
                // value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <label htmlFor="pp" className="font-medium">Profile Picture:</label>
              <input
                id="pp"
                type="file"
                name="profileImage"
                onChange={handleChange}
                accept="image/*"
                className="border p-2 rounded"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded cursor-pointer hover:bg-green-900 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;