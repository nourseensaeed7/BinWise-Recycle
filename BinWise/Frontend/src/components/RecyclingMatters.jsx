import React from 'react'

const RecyclingMatters = () => {
  return (
    <section  className='p-8'>
        <div>
            <h2 className='capitalize  text-xl md:text-2xl font-extrabold  tracking-wide'>Why Recycling Matters</h2>
            <div className='w-40 md:w-50 h-1 my-2 bg-[#186933]'></div>
            <p className='text-[12px]'>Recycle Today, Save Tomorrow</p>
        </div>
        <div>
            <div className='flex flex-col justify-between p-2 sm:flex-row md:flex-row '>
                <div className='sm:w-120 md:w-140'>
                    <h3 className='font-bold capitalize'>1.reduce waste</h3>
                    <p className='text-sm p-1  '>“Recycling keeps tons of waste out of landfills and oceans, protecting nature and wildlife.”</p>
                </div>
                <div  className='sm:w-120 md:w-140'>
                    <h3 className='font-bold capitalize'>2.save energy</h3>
                    <p className='text-sm p-1  '>“Recycled materials use far less energy to process than raw resources — reducing pollution and carbon emissions.”</p>
                </div>
            </div>
            <div className='flex flex-col justify-between p-2 sm:flex-row md:flex-row '>
                <div  className='sm:w-120 md:w-140'>
                    <h3 className='font-bold capitalize'>3.conserve resources</h3>
                    <p className='text-sm p-1  '>“Paper, plastic, glass, and metals can all be reused, helping preserve forests, water, and natural habitats.”</p>
                </div>
                <div  className='sm:w-120 md:w-140'>
                    <h3 className='font-bold capitalize'>4.build sustainable communities</h3>
                    <p className='text-sm p-1  '>“Recycling creates jobs, supports green innovation, and inspires communities to live more sustainably.”</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default RecyclingMatters
