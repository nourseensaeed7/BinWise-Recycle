import React, { useContext, useEffect, useRef, useState} from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, getUserData, setUserData } =
    useContext(AppContent);

  const inputRefs = useRef([]);
  const [canResend, setCanResend] = useState(false);
const [timer, setTimer] = useState(45);

useEffect(() => {
  if (!canResend && timer > 0) {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }

  if (timer === 0) {
    setCanResend(true);
  }
}, [timer, canResend]);

const handleResendOTP = async () => {
  if (!canResend) return;

  try {
    // Change this line:
    await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {}, { withCredentials: true });

    toast.success("A new OTP has been sent to your email");

    // restart timer
    setCanResend(false);
    setTimer(45);

  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to resend OTP");
  }
};


  // 👉 handle typing input
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 👉 handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // 👉 handle paste (e.g., entire OTP copied)
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
  };

  // 👉 handle form submit (verify OTP)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otp = inputRefs.current.map((input) => input.value).join("");
      if (otp.length < 6) return toast.error("Please enter the full 6-digit OTP");
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-email`, { otp }, { withCredentials: true });
      if (data.success) {
        toast.success("Email verified successfully!");
      
        // Optimistically update context
        setUserData((prev) => ({
          ...prev,
          isAccountVerified: true,
        }));
      
        // Ensure backend state sync (this will overwrite with confirmed data)
        await getUserData();
      
        // Redirect to home
        navigate("/");
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔒 Protect route: redirect if not logged in or already verified
  // useEffect(() => {
  //   const protectPage = async () => {
  //     await getUserData(); // ensure fresh user data

  //     // not logged in → login page
  //     if (!isLoggedin) {
  //       navigate("/login");
  //       return;
  //     }

  //     // already verified → home
  //     if (userData?.isAccountVerified) {
  //       navigate("/");
  //     }
  //   };

  //   protectPage();
  // }, [isLoggedin, userData]);

  useEffect(() => {
    const checkAccess = async () => {
      await getUserData(); // ensure latest data from backend
  
      if (!isLoggedin) {
        navigate("/login");
        return;
      }
  
      if (userData?.isAccountVerified) {
        navigate("/");
      }
    };
  
    checkAccess();
  }, [isLoggedin, userData?.isAccountVerified]);
  
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen overflow-x-hidden  items-center justify-center">
      <div className="p-4 absolute top-4 left-4">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="logo"
          className="w-28 sm:w-32 cursor-pointer"
        />
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="rounded-lg shadow-lg md:w-96 text-sm p-8 bg-green-50"
      >
        <h1 className="text-center text-2xl font-semibold mb-4">
          Verify Your Email
        </h1>
        <p className="text-center mb-6 text-gray-600">
          Enter the 6-digit OTP sent to your email address.
        </p>

        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                className="w-12 h-12 text-center border border-[#186933] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
        </div>

        <button
          type="submit"
          className="bg-[#186933] text-white rounded-lg p-2 hover:bg-green-700 transition cursor-pointer w-full"
        >
          Verify Account
        </button>

        <div className="text-center mt-4">
  <button
    type="button"
    onClick={handleResendOTP}
    disabled={!canResend}
    className={`text-sm font-semibold ${
      canResend ? "text-green-700 cursor-pointer" : "text-gray-400 cursor-not-allowed"
    }`}
  >
    {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
  </button>
</div>
      </form>
    </div>
  );
};

export default EmailVerify;
