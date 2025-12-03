import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from "react-router-dom";
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const {backendUrl}=useContext(AppContent)
  axios.defaults.withCredentials=true
  const navigate = useNavigate();
  const [email,setEmail]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [isEmailSent,setIsEmailSent]=useState('')
  const [otp,setOtp]=useState(0)
  const [isOtpSubmited,setIsOtpSubmited]=useState(false)
  const inputRefs = React.useRef([]);
    const handleInput = (e, index) => {
      if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    };
    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    };
    const handlePaste=(e)=>{
      const paste=e.clipboardData.getData('text')
      const pasteArray=paste.split('');
      pasteArray.forEach((char,index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char;
        }
      })
    }

    const oneSubmitEmail=async(e)=>{
      e.preventDefault();
      try{
        const {data}=await axios.post(backendUrl +'/api/auth/send-reset-otp',{email})
        data.success ? toast.success(data.message):toast.error(data.message)
        data.success&&setIsEmailSent(true)
      }catch(error){
        toast.error(error.message)
      }
    }
    const onSubmitOtp=async(e)=>{
      e.preventDefault();
      const otpArray=inputRefs.current.map(e=>e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmited(true)
    }
    const onSubmitNewPassword=async(e)=>{
      e.preventDefault();
      try{
        const {data}=await axios.post(backendUrl +'/api/auth/reset-password',{email,otp,newPassword})
        data.success?toast.success(data.message):toast.error(data.message)
        data.success&&navigate('/login')
      }catch(error){
        toast.error(error.message)
      }
    }
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen overflow-x-hidden">
      <div className="p-4">
              <img
                onClick={() => navigate("/")}
                src={assets.logo}
                alt="logo"
                className="w-28 sm:w-32 cursor-pointer"
              />
      </div>
      {!isEmailSent &&
      <form onSubmit={oneSubmitEmail} className='rounded-lg shadow-lg md:w-96 text-sm p-8 mx-4 bg-white self-center flex flex-col'>
      <h1 className="text-center text-2xl font-semibold mb-4">Reset Password</h1>
        <p className="text-center mb-6">
          Enter your registered email address.
        </p>
        <div>
          <input type='email' placeholder='Email Address' className='border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
          value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <button className="bg-[#186933] text-white rounded-lg py-2 hover:bg-green-700 transition cursor-pointer mt-5">
          Submit
        </button>
      </form>}

        {!isOtpSubmited&& isEmailSent &&
      <form onSubmit={onSubmitOtp} className="rounded-lg shadow-lg w-96 text-sm p-8 bg-white self-center flex flex-col ">
      <h1 className="text-center text-2xl font-semibold mb-4">Reset Password OTP</h1>
        <p className="text-center mb-6">
          Enter the 6-digit code sent to your email.
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
                className="w-12 h-12 text-center border border-[#186933] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
        </div>
        <button className="bg-[#186933] text-white rounded-lg p-2 hover:bg-green-700 transition cursor-pointer"
        >
          Submit
        </button>
      </form>}
      {isOtpSubmited&&isEmailSent&&
      <form onSubmit={onSubmitNewPassword} className='rounded-lg shadow-lg w-96 text-sm p-8 bg-white self-center flex flex-col'>
      <h1 className="text-center text-2xl font-semibold mb-4">New Password</h1>
        <p className="text-center mb-6">
          Enter your new Password.
        </p>
        <div>
          <input type='password' placeholder='New Password' className='border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
          value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/>
        </div>
        <button className="bg-[#186933] text-white rounded-lg py-2 hover:bg-green-700 transition cursor-pointer mt-5">
          Submit
        </button>
      </form>}
    </div>
  )
}

export default ResetPassword
