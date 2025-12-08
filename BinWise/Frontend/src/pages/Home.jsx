import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import RecyclingMatters from '../components/RecyclingMatters';
import RecyclingProgram from '../components/RecyclingProgram';
import Features from '../components/Features';
import Testmonials from '../components/Testmonials';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { assets } from '../assets/assets';
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = assets.bgtest;
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div 
    className={`transition-opacity duration-700 ease-out ${bgLoaded ? "opacity-100" : "opacity-0"}`}
  >
      <NavBar />
      <div className='flex flex-col min-h-screen overflow-x-hidden'>
        <Header />
        <RecyclingMatters />
        <RecyclingProgram />
        <Testmonials />
        <Features />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
