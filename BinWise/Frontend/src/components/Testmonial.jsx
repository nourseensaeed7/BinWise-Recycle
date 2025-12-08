import React from "react";

const Testmonial = ({ title, description, name, job }) => {
  return (
    <div className=" flex flex-col justify-between p-4 rounded-2xl  bg-black/10 backdrop-blur-[20px] text-white min-w-65 md:w-70 ">
      <div >
        {title && <h3 className="sm:text-2xl font-semibold">{title}</h3>}
        <div className="w-20 h-1 my-2 bg-[#186933]"></div>
      </div>
      {description && <p className="sm:text-lg font-medium m-2">{description}</p>}
      <div className="bg-[#186933] w-fit  px-10 rounded-xl  ">
        {name && <h4>{name}</h4>}
        {job && <h4>{job}</h4>}
      </div>
    </div>
  );
};

export default Testmonial;
