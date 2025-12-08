import React from 'react'
import { FaArrowRight} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const Cards = ({title,description,image,button,route}) => {
  const navigate = useNavigate();
  return (
    <div  className="min-h-100  md:w-70 bg-white flex flex-col  justify-around p-5 rounded-xl shadow-xl my-4 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {image && (
        <img src={image} alt={title}/>
      )}

        {title &&(
            <h3 className="text-lg font-bold mb-2 px-2">{title}</h3>
        )}
        {description &&(
            <p className=" text-sm text-gray-900 mb-4 px-2">{description}</p>
        )}

        {button &&(
          <button onClick={()=>navigate(route)} className='cursor-pointer rounded-2xl text-sm px-3  h-9 text-white bg-[#186933] hover:bg-[#124d26] inline-flex items-center justify-center gap-1'>{button}<FaArrowRight /></button>
        )}
    </div>
  )
}

export default Cards