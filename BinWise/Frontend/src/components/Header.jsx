import React, { useContext} from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  return (
<header className="flex flex-col-reverse sm:flex-row md:flex-row lg:flex-row px-3 justify-center items-center max-w-7xl mx-auto">
  <div className="self-center px-5 flex-1 min-w-0">
    {userData ? (
      <h2 className="capitalize sm:text-base md:text-lg  lg:text-xl p-2 md:p-3">
        Welcome to BinWise, {userData.name}!
      </h2>
    ) : (
      <h2 className="text-lg lg:text-xl p-2 md:p-3">
        Welcome to BinWise, Eco-hero!
      </h2>
    )}
    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
      Recycle Today,
      <span className="block text-[#186933]">Save Tomorrow</span>
    </h1>
    <p className="text-lg p-2 sm:p-3 md:p-4 font-medium">
      Every small step matters. Together, we can reduce waste, save energy,
      and build a cleaner planet.
    </p>
    <button onClick={()=>navigate("/recycle-scanner")} className="bg-[#186933] hover:bg-[#124d26] transition-colors text-white  font-medium p-2 sm:p-3 m-2 sm:m-3 w-37 rounded-xl cursor-pointer">
      Start Recycling
    </button>
  </div>
  <div className=" w-70 sm:w-70 md:w-100 lg:w-140">
    <img 
      src={assets.bg} 
      alt="Hero" 
      className="w-full h-auto object-contain" 
    />
  </div>
</header>
  );
};

export default Header;
