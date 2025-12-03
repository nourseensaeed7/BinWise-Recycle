import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const [menuOpen, setMenuOpen] = useState(false);

  // Send verification OTP
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message || "Verification email sent!");
        navigate("/email-verify");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  //NavLink styling function
  const navLinkClass = ({ isActive }) =>
    isActive
  ? "text-[#186933] font-semibold drop-shadow-[0_1px_3px_rgba(24,105,51,0.5)]"
  : "hover:text-[#186933]";

  return (
    <nav className="sticky w-full flex justify-between items-center p-4 bg-white shadow-sm top-0 z-50">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="w-24 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 text-sm lg:text-base text-gray-800 font-medium">
        <li>
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/recycle-scanner" className={navLinkClass}>
            Recycle Scanner
          </NavLink>
        </li>
        <li>
          <NavLink to="/pickup-and-dropoff" className={navLinkClass}>
            Pickup & Drop-off
          </NavLink>
        </li>
        <li>
          <NavLink to="/about-us" className={navLinkClass}>
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/awareness" className={navLinkClass}>
            Awareness
          </NavLink>
        </li>
      </ul>

      {/* Desktop User Section */}
      {userData ? (
        <div className="relative hidden md:flex group mr-6 w-8 h-8 justify-center items-center rounded-full bg-[#186933] text-white cursor-pointer">
          {userData.name?.[0]?.toUpperCase() || "?"}

          {/* Dropdown */}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="bg-gray-100 text-sm rounded shadow-md min-w-[140px]">
              <li
                onClick={() => navigate("/profile")}
                className="p-2 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
              >
                Profile
              </li>

              {!userData?.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="p-2 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                Log out
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="hidden cursor-pointer md:flex items-center gap-2 border border-gray-500 rounded-full px-5 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Sign Up <FaArrowRight />
        </button>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="transition-transform duration-300"
        >
          {menuOpen ? (
            <FaTimes
              size={22}
              className="transform rotate-180 transition-all duration-300"
            />
          ) : (
            <FaBars
              size={22}
              className="transform rotate-0 transition-all duration-300"
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md z-10 flex flex-col items-center py-4 text-sm transition-all duration-300 ease-in-out transform ${
          menuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        {/* Mobile User Section */}
        {userData ? (
          <div className="flex flex-col items-center w-full text-sm  border-gray-200">
            <span className="font-semibold text-gray-700 mb-2">
              Hello, {userData.name || "User"}
            </span>

            <button
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              className="w-3/4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>

            {!userData?.isAccountVerified && (
              <button
                onClick={() => {
                  sendVerificationOtp();
                  setMenuOpen(false);
                }}
                className="w-3/4 py-2 border-b hover:bg-gray-100"
              >
                Verify Email
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-5 py-2 mb-2 text-gray-800 hover:bg-gray-100 transition-all"
          >
            Sign Up <FaArrowRight />
          </button>
        )}

        {/* Mobile Nav Links */}
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="w-3/4 py-2 text-center hover:bg-gray-100"
        >
          Home
        </NavLink>

        <NavLink
          to="/recycle-scanner"
          onClick={() => setMenuOpen(false)}
          className="w-3/4 py-2 text-center hover:bg-gray-100"
        >
          Recycle Scanner
        </NavLink>

        <NavLink
          to="/pickup-and-dropoff"
          onClick={() => setMenuOpen(false)}
          className="w-3/4 py-2 text-center hover:bg-gray-100"
        >
          Pickup & Drop-off
        </NavLink>

        <NavLink
          to="/about-us"
          onClick={() => setMenuOpen(false)}
          className="w-3/4 py-2 text-center hover:bg-gray-100"
        >
          About Us
        </NavLink>

        <NavLink
          to="/awareness"
          onClick={() => setMenuOpen(false)}
          className="w-3/4 py-2 text-center hover:bg-gray-100"
        >
          Awareness
        </NavLink>

        {userData && (
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="w-3/4 py-2 hover:bg-gray-100"
          >
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;