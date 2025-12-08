import React from "react";

const Awarencerate = (props) => {
    const materials = [
        { name: "Paper", percent: 68 },
        { name: "Aluminum", percent: 67 },
        { name: "Glass", percent: 31 },
        { name: "Plastic", percent: 9 },
    ];
    return (
        <div className="m-5 p-4 border-2 border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold mb-1">
                Recycling Rates by Material (US)
            </h2>
            <p className="mb-4 text-sm text-gray-600">
                Current recycling percentages for different materials
            </p>
            {materials.map((item, index) => (
                <div key={index} className="mb-4">
                    <span className="flex justify-between text-sm font-medium text-gray-700">
                        {item.name} <span>{item.percent}%</span>
                    </span>
                    <div className="bg-gray-200 mt-2 rounded-xl h-6 overflow-hidden">
                        <div
                            className="bg-black text-white text-xs flex items-center justify-center h-full rounded-xl"
                            style={{ width: `${item.percent}%` }}
                        >
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Awarencerate;
