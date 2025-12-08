import React from 'react'
import { assets } from '../assets/assets'
import Testmonial from './Testmonial'
const Testmonials = () => {
  return (
    <section className='bg-cover bg-center w-full'  style={{ backgroundImage: `url(${assets.bgtest})` }}>
        <div className='text-center flex flex-col items-center mt-8'>
            <h2 className='capitalize text-2xl md:text-3xl font-extrabold tracking-wide'>Testimonials</h2>
            <div className='w-40 md:w-22  h-1 my-2 bg-[#186933]'></div>
        </div>
        <div className='flex justify-around gap-5  p-6 overflow-scroll no-scrollbar'>
        <Testmonial
        title={'Recycling made simple!'}
        description={'"I used to throw away so many bottles and cans, but now I just drop them at the recycling point and even earn rewards. It feels great to know I’m making a difference and saving money at the same time."'}
        name={'— Sarah M. '}
        job={'Student'}/>
        <Testmonial
        title={'A win for me and the planet'}
        description={'"This program is amazing. I schedule pickups right from my phone, and not only do I keep my home clutter-free, I also get discounts on eco-friendly products. Recycling has never been this motivating!"'}
        name={'— James R. '}
        job={'Small Business Owner'}/>
        <Testmonial
        title={'Turning waste into value'}
        description={'"I’ve always cared about the environment, but now I feel rewarded for it. The points I earn go toward my groceries, and I’m proud to know my kids are growing up in a cleaner community."'}
        name={'— Amira K.'}
        job={'Mother of Two'}/>
        </div>

    </section>
  )
}

export default Testmonials
