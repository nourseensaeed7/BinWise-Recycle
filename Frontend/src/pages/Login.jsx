// Improved Login/Signup component matching your logic and upgraded UI
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    api.defaults.withCredentials = true;

    if (!backendUrl) {
      toast.error("Backend URL is missing! Check your .env file.");
      console.error("Missing VITE_BACKEND_URL in .env");
      return;
    }

    try {
      setLoading(true);
      let data;

      if (state === "Sign Up") {
        const res = await api.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
        data = res.data;
      } else {
        const res = await api.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        data = res.data;
      }

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem("token", data.token); // <-- This line
      
        toast.success(state === "Sign Up" ? "Account created successfully" : "Welcome back");
        setIsLoggedin(true);
      
        const user = await getUserData(); // fetch user data after token is set
      
        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
      
    }catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => navigate("/")}
          className="w-32 cursor-pointer"
        />
      </div>

      {/* Main Card */}
      <div className="flex justify-center items-center m-3 pb-10">
        <div className="bg-white max-w-3xl min-h-130 shadow-xl  rounded-2xl flex flex-col-reverse md:flex-row items-center overflow-hidden text-green-900 ">
          {/* Left side - Form */}
          <div className="w-full p-6 md:w-[60%] ">
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              {state === "Sign Up" ? "Get Started Now" : "Welcome Back!"}
            </h1>
            <p className="text-green-900 mb-6">
              {state === "Sign Up"
                ? "Enter your credentials to create an account."
                : "Enter your credentials to access your account."}
            </p>

            <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
              {/* Name Field */}
              {state === "Sign Up" && (
                <div>
                  <label className="font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-green-600 outline-none"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="font-medium">Email address</label>
                <input
                  type="email"
                  className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-green-600 outline-none"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-green-600 outline-none"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Forgot Password */}
              {state === "Login" && (
                <p
                  onClick={() => navigate("/reset-password")}
                  className="text-green-700 cursor-pointer text-sm hover:underline"
                >
                  Forgot Password?
                </p>
              )}

              {/* Submit Button */}
              <button
                className="bg-green-700 cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-green-400"
                disabled={loading}
              >
                {loading ? "Processing..." : state === "Sign Up" ? "Sign Up" : "Login"}
              </button>
            </form>

            {/* Toggle state */}
            <div className="text-center text-sm text-gray-600 mt-4">
              {state === "Sign Up" ? (
                <p>
                  Already have an account?{' '}
                  <span
                    className="text-green-700 cursor-pointer underline"
                    onClick={() => setState("Login")}
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p>
                  Don’t have an account?{' '}
                  <span
                    className="text-green-700 cursor-pointer underline"
                    onClick={() => setState("Sign Up")}
                  >
                    Sign Up
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Right side illustration */}
          <div className=" flex flex-col bg-white items-center justify-between">
            <img
            src={assets.logo}
            className="w-[50%] pt-5 md:w-[70%] md:p-0 "
            alt="logo"/>
            <h3 className="text-green-900 font-bold text-center px-2 ">
              {state === "Sign Up" ? "Join BinWise to Begin a new Eco Journey!" : "Your recycling journey continues here."}
            </h3>
            <img
              src={assets.leader}
              alt="auth visual"
              className="rounded-xl max-h-[340px] px-5 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
