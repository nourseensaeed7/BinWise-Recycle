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
  const [loading, setLoading] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Set minimum loading time (e.g., 1 second)
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);

    // Preload critical images
    const imagesToPreload = [
      assets.bg,
      assets.last,
      assets.middle,
      assets.collect,
      assets.bgtest,
      assets.Feature1,
      assets.Feature2,
      assets.Feature3,
      assets.Feature4
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        // Wait for both minimum time and images to load
        const checkReady = setInterval(() => {
          if (minTimeElapsed) {
            setLoading(false);
            clearInterval(checkReady);
          }
        }, 100);
      }
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded; // Continue even if image fails
    });

    // Fallback: Hide loading after max 3 seconds regardless
    const maxTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [minTimeElapsed]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div 
      className="transition-opacity duration-700 ease-out opacity-100"
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