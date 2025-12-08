import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images on component mount
  useEffect(() => {
    const imagesToPreload = [assets.logo, assets.leader];
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === imagesToPreload.length) {
        setImagesLoaded(true);
      }
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded; // Continue even if image fails
    });

    // Fallback: Show content after 2 seconds regardless
    const fallbackTimer = setTimeout(() => {
      setImagesLoaded(true);
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let response;

      if (state === "Sign Up") {
        console.log("📝 Attempting registration...");
        response = await api.post("/api/auth/register", {
          name,
          email,
          password,
        });
      } else {
        console.log("🔐 Attempting login...");
        response = await api.post("/api/auth/login", {
          email,
          password,
        });
      }

      const data = response.data;
      console.log("📦 Response:", data);

      if (data.success) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("✅ Token saved to localStorage");
        } else {
          console.warn("⚠️ No token in response!");
        }

        toast.success(
          state === "Sign Up" 
            ? "Account created successfully! Please verify your email." 
            : "Welcome back!"
        );
        
        setIsLoggedin(true);

        const user = await getUserData();
        console.log("👤 User data fetched:", user);

        if (user?.role === "admin") {
          navigate("/admin");
        } else if (!user?.isAccountVerified && state === "Sign Up") {
          navigate("/email-verify");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("❌ Auth error:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while images are loading
  if (!imagesLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col transition-opacity duration-700 ease-out opacity-100">
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
                  Don't have an account?{' '}
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