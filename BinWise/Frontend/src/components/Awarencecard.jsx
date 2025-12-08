import React from "react";


const Awarencecard = (props) => {
    return (<div className="m-5 border-2 bg-white border-gray-300 rounded-lg  p-5 ">
        <props.icon style={{ color: props.color }} className="w-6 h-6" />
        <h3 style={{ color: props.color }} className="font-bold text-lg mb-1">
            {props.title}
        </h3>
        <p className="text-gray-700">{props.description}</p>
    </div>)
};
export default Awarencecard;