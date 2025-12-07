import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedin, getUserData, setUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log(`\n${'='.repeat(50)}`);
      console.log(`${state === "Sign Up" ? "📝 REGISTRATION" : "🔐 LOGIN"} ATTEMPT`);
      console.log(`${'='.repeat(50)}`);
      
      let response;

      if (state === "Sign Up") {
        console.log("📤 Sending registration request...");
        response = await api.post("/api/auth/register", {
          name,
          email,
          password,
        });
      } else {
        console.log("📤 Sending login request...");
        response = await api.post("/api/auth/login", {
          email,
          password,
        });
      }

      const data = response.data;
      console.log("📦 Response received:");
      console.log("   Success:", data.success);
      console.log("   Has token:", !!data.token);
      console.log("   User data:", data.userData);

      if (data.success) {
        // ✅ STEP 1: Store token FIRST
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("✅ Token saved to localStorage");
          console.log("   Token length:", data.token.length);
          console.log("   Token preview:", data.token.substring(0, 30) + "...");
          
          // Verify it was saved
          const savedToken = localStorage.getItem("token");
          console.log("   Verification - Token retrieved:", savedToken ? "✅ SUCCESS" : "❌ FAILED");
        } else {
          console.error("⚠️ CRITICAL: No token in response!");
          toast.error("Authentication succeeded but no token received");
          return;
        }

        // ✅ STEP 2: Update context with user data from response
        if (data.userData) {
          setUserData(data.userData);
          setIsLoggedin(true);
          console.log("✅ Context updated with user data");
        }

        // ✅ STEP 3: Show success message
        toast.success(
          state === "Sign Up" 
            ? "Account created successfully!" 
            : "Welcome back!"
        );

        // ✅ STEP 4: Wait a moment for state to settle
        await new Promise(resolve => setTimeout(resolve, 100));

        // ✅ STEP 5: Fetch fresh user data from server (this will use the token)
        console.log("🔄 Fetching fresh user data from server...");
        const freshUserData = await getUserData();
        console.log("📥 Fresh user data received:", freshUserData);

        // ✅ STEP 6: Navigate based on role and verification
        console.log("\n🧭 Navigation logic:");
        console.log("   Role:", freshUserData?.role);
        console.log("   Is verified:", freshUserData?.isAccountVerified);
        console.log("   Is signup:", state === "Sign Up");

        if (freshUserData?.role === "admin") {
          console.log("   → Redirecting to admin dashboard");
          navigate("/admin");
        } else if (!freshUserData?.isAccountVerified) {
          console.log("   → Redirecting to email verification");
          toast.info("Please verify your email to continue");
          navigate("/email-verify");
        } else {
          console.log("   → Redirecting to home");
          navigate("/");
        }

        console.log(`${'='.repeat(50)}`);
        console.log("✅ LOGIN/REGISTRATION COMPLETED SUCCESSFULLY");
        console.log(`${'='.repeat(50)}\n`);

      } else {
        console.error("❌ Response indicates failure:", data.message);
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("\n❌ AUTHENTICATION ERROR:");
      console.error("   Name:", error.name);
      console.error("   Message:", error.message);
      console.error("   Status:", error.response?.status);
      console.error("   Response data:", error.response?.data);
      console.error("   Code:", error.code);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Invalid request");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        toast.error("Network error. Please try again.");
      }
      
      console.log(`${'='.repeat(50)}\n`);
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white max-w-3xl min-h-130 shadow-xl rounded-2xl flex flex-col-reverse md:flex-row items-center overflow-hidden text-green-900">
          {/* Left side - Form */}
          <div className="w-full p-6 md:w-[60%]">
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
                type="submit"
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
          <div className="flex flex-col bg-white items-center justify-between">
            <img
              src={assets.logo}
              className="w-[50%] pt-5 md:w-[70%] md:p-0"
              alt="logo"
            />
            <h3 className="text-green-900 font-bold text-center px-2">
              {state === "Sign Up" 
                ? "Join BinWise to Begin a new Eco Journey!" 
                : "Your recycling journey continues here."}
            </h3>
            <img
              src={assets.leader}
              alt="auth visual"
              className="rounded-xl max-h-[340px] px-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;