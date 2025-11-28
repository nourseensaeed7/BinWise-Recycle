import React from 'react'
import { Book } from 'lucide-react'
const ResourseCard = (props) => {
    return (
        <div>
            <div className="m-5 border-2 bg-white border-black rounded-2xl shadow-xl p-4 max-w-80 ">
                <div className='flex justify-between'> 
                <div className='bg-gray-300 text-black px-3 py-1 rounded-md mb-2'>{props.buton}</div><span>{props.date}</span>
                </div>
                <h2 className='text-lg mb-2'>{props.title}</h2>
                <p className='text-sm text-gray-500 mb-4'>{props.text}</p>
                <div className='flex justify-between  text-gray-500'>{props.text2}<button className='border rounded-md px-1 border-gray-400 text-black cursor-pointer hover:bg-gray-100 flex items-center gap-2'onClick={() => window.open(props.url, "_blank")}><Book/>Read More</button></div>
            </div>
        </div>
    )
}
export default ResourseCard

