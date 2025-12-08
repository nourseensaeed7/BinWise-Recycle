// Improved Login/Signup component matching your logic and upgraded UI
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
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
    axios.defaults.withCredentials = true;

    if (!backendUrl) {
      toast.error("Backend URL is missing! Check your .env file.");
      console.error("Missing VITE_BACKEND_URL in .env");
      return;
    }

    try {
      setLoading(true);
      let data;

      if (state === "Sign Up") {
        const res = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
        data = res.data;
      } else {
        const res = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        data = res.data;
      }

      if (data.success) {
        toast.success(state === "Sign Up" ? "Account created successfully" : "Welcome back");
        setIsLoggedin(true);

        const user = await getUserData();

        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
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
// import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const navigate = useNavigate();
//   const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

//   const [state, setState] = useState("Sign Up");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     axios.defaults.withCredentials = true;

//     if (!backendUrl) {
//       toast.error("Backend URL is missing! Check your .env file.");
//       console.error("Missing VITE_BACKEND_URL in .env");
//       return;
//     }

//     try {
//       let data;

//       if (state === "Sign Up") {
//         const res = await axios.post(`${backendUrl}/api/auth/register`, {
//           name,
//           email,
//           password,
//         });
//         data = res.data;
//       } else {
//         const res = await axios.post(`${backendUrl}/api/auth/login`, {
//           email,
//           password,
//         });
//         data = res.data;
//       }

//       if (data.success) {
//         toast.success(state === "Sign Up" ? "Account created successfully" : "Welcome back");
//         setIsLoggedin(true);

//         // ✅ fetch user details (with role)
//         const user = await getUserData();
//         console.log("User data after login:", user); // Debug log

//         // ✅ redirect based on role
//         if (user?.role === "admin") {
//           console.log("Redirecting admin to /admin"); // Debug log
//           navigate("/admin");
//         } else {
//           console.log("Redirecting user to /"); // Debug log
//           navigate("/");
//         }
//       } else {
//         toast.error(data.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.error("Error in login/signup:", error);
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Network error. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Logo */}
//       <div className="p-4">
//         <img
//           onClick={() => navigate("/")}
//           src={assets.logo}
//           alt="logo"
//           className="w-28 sm:w-32 cursor-pointer"
//         />
//       </div>

//       {/* Form Card */}
//       <div className="flex items-center justify-center mb-10">
//         <div className="flex gap-4 bg-white shadow-lg rounded-xl ">
//           {/* Left Form Section */}
//           <div className="w-[50%] py-10 px-5">
//             <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
//               <h1 className="text-2xl font-bold">
//                 {state === "Sign Up" ? "Get Started Now" : "Welcome Back!"}
//               </h1>
//               <p className="text-gray-600">
//                 {state === "Sign Up"
//                   ? "Enter your credentials to create an account."
//                   : "Enter your credentials to access your account."}
//               </p>

//               {/* Name Field */}
//               {state === "Sign Up" && (
//                 <div className="flex flex-col">
//                   <label htmlFor="name" className="mb-1 font-medium">
//                     Name
//                   </label>
//                   <input
//                     onChange={(e) => setName(e.target.value)}
//                     value={name}
//                     className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     id="name"
//                     type="text"
//                     placeholder="Enter your Name"
//                     required
//                   />
//                 </div>
//               )}

//               {/* Email Field */}
//               <div className="flex flex-col">
//                 <label htmlFor="email" className="mb-1 font-medium">
//                   Email address
//                 </label>
//                 <input
//                   onChange={(e) => setEmail(e.target.value)}
//                   value={email}
//                   className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   id="email"
//                   type="email"
//                   placeholder="Enter your Email"
//                   required
//                 />
//               </div>

//               {/* Password Field */}
//               <div className="flex flex-col">
//                 <label htmlFor="pass" className="mb-1 font-medium">
//                   Password
//                 </label>
//                 <input
//                   onChange={(e) => setPassword(e.target.value)}
//                   value={password}
//                   className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   id="pass"
//                   type="password"
//                   placeholder="Enter your Password"
//                   required
//                 />
//               </div>

//               {/* Forgot Password */}
//               {state === "Login" && (
//                 <p
//                   onClick={() => navigate("/reset-password")}
//                   className="text-blue-800 cursor-pointer"
//                 >
//                   Forget Password?
//                 </p>
//               )}

//               {/* Submit Button */}
//               <button className="bg-[#186933] text-white rounded-lg py-2 hover:bg-green-700 transition cursor-pointer">
//                 {state === "Sign Up" ? "Sign Up" : "Login"}
//               </button>
//             </form>

//             {/* Toggle Sign Up / Login */}
//             {state === "Sign Up" ? (
//               <p className="text-gray-400 text-xs text-center mt-4">
//                 Already have an account?{" "}
//                 <span
//                   onClick={() => setState("Login")}
//                   className="text-blue-800 cursor-pointer underline"
//                 >
//                   Login here
//                 </span>
//               </p>
//             ) : (
//               <p className="text-gray-400 text-xs text-center mt-4">
//                 Don’t have an account?{" "}
//                 <span
//                   onClick={() => setState("Sign Up")}
//                   className="text-blue-800 cursor-pointer underline"
//                 >
//                   Sign Up
//                 </span>
//               </p>
//             )}
//           </div>

//           {/* Right Side Image */}
//           <div className="flex items-end">
//             <img
//               src={state === "Sign Up" ? assets.leader: assets.login}
//               alt="login"
//               className="rounded-r-xl"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
