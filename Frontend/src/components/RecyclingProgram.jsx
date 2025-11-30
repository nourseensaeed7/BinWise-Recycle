import React, { useContext } from "react";
import Cards from './Cards'
import { AppContent } from "../context/AppContext";

import { assets } from '../assets/assets'
const RecyclingProgram = () => {
    const { userData } = useContext(AppContent);
  
  return (
    <section className='p-8'>
        <div>
            <h2 className='capitalize  text-xl md:text-2xl font-extrabold  tracking-wide'>How Our Recycling Program Works ?</h2>
            <div className='w-60 md:w-80 h-1 my-2 bg-[#186933]'></div>
            <p className='text-[12px]'>Every small step matters. Together, we can reduce waste, save energy, and build a cleaner planet</p>
        </div>
        <div className='place-self-center-safe flex flex-col justify-center items-center lg:gap-20 max-w-100 sm:gap-4 md:max-w-full md:flex-row'>
      <Cards
      title={ 'Collect & Recycle'}
      description={'Gather your recyclable items like plastic, paper, glass,Cloth and metal . Check whether it is recyclable or not from our scanner.'}
      image={assets.collect}
      button={'View Recycle Scanner'}
      route={'/recycle-scanner'}/>
      <Cards
      title={ 'Drop Off or Schedule Pickup'}
      description={'Bring them to a recycling centers or request an easy doorstep pickup. see where is the nearest center.'}
      image={assets.middle}
      button={'View Centers'}
      route={'/pickup-and-dropoff/centers'}/>
      <Cards
      title={ 'Earn Rewards'}
      description={'Get rewarded for every item you recycle — earn points, discounts, or cash-back while helping the planet.'}
      image={assets.last}
      button={'View Points'}
      route={userData?'/profile':'/login'}/>
      </div>
    </section>
  )
}

export default RecyclingProgram
