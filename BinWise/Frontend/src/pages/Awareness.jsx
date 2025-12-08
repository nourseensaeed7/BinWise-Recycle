import React from "react";
import NavBar from "../components/NavBar";
import Awarenceheader from "../components/Awarenceheader";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
const Awareness = () => {
    return (
    <div>
        <NavBar />
        <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 flex flex-col ">

        <Awarenceheader />
        <Outlet />
        <Footer />
    </div>
    </div>
    )
};

export default Awareness;
