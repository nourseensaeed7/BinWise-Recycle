import React from 'react'
import { AlertTriangle } from "lucide-react";

const Notrecyclecard = (props) => {
  return (
    <div className='border-2 bg-white border-gray-300 rounded-lg p-4 m-5 max-w-80'>
        <h2 className='font-bold text-lg mb-2 flex gap-2 items-center'><AlertTriangle className=" w-fit text-red-600   mt-0.5"/>{props.title}</h2>
        <p className='text-gray-800 mb-4'>why not recyclable:{props.text}</p>
       <div className='px-2 py-0.5 bg-emerald-100 rounded-lg text-xs'>Alternative: {props.items} </div>
    </div>
  )
}
export default Notrecyclecard
