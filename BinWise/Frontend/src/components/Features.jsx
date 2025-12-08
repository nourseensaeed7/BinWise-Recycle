import React from 'react'
import Cards from './Cards'
import { assets } from '../assets/assets'
import { GiTakeMyMoney} from "react-icons/gi";
import { MdRecycling } from "react-icons/md";
import { GiSmart } from "react-icons/gi";
import { IoFootsteps } from "react-icons/io5";


const Features = () => {
  return (
    <section className=' p-8'>
        <div className='text-center flex flex-col items-center m-8'>
            <h2 className='capitalize  text-2xl md:text-3xl font-extrabold tracking-wide'>Features</h2>
            <div className='w-40 md:w-22  h-1 my-2 bg-[#186933]'></div>
        </div>
        <div className='place-self-center-safe flex flex-col justify-center items-center max-w-100 sm:gap-4 md:max-w-full md:flex-row md:justify-around'>
        <Cards
        title={ <div className="flex items-center gap-2">
          < MdRecycling className="text-green-600 text-2xl" />
          <span>Easy Recycling</span>
        </div>}
        description={'Drop off your items at a nearby station or schedule a doorstep pickup — recycling has never been this simple.'}
        image={assets.Feature1}/>
        <Cards
        title={ <div className="flex items-center gap-2">
          <GiTakeMyMoney className="text-green-600 text-2xl" />
          <span>Earn Rewards</span>
        </div>}
        description={'Every item you recycle earns you points that can be redeemed for cash, discounts, or eco-friendly products.'}
        image={assets.Feature2}/>
        <Cards
        title={<div className="flex pt-4 items-center gap-2">
          <IoFootsteps className="text-green-600 text-2xl" />
          <span>Smart Tracking</span>
        </div>}
        description={'Track your recycling history, monitor your impact, and celebrate every step you take toward a cleaner planet with our easy-to-use app.'}
        image={assets.Feature3}/>
        <Cards
        title={<div className="flex items-center gap-2">
          <GiSmart className="text-green-600 text-2xl" />
          <span>AI Scanner</span>
        </div>}
        description={'Use our smart AI-powered scanner to instantly detect whether an item is recyclable and which category it belongs to.'}
        image={assets.Feature4}/>
        </div>
    </section>
  )
}

export default Features
