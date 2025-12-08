import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
const WastePieChart = () => {
    const data = {
        labels: ['Landfill Waste', 'Recycled', 'Incinerated', 'Ocean/Environment'],
        datasets: [
            {
                label: 'Waste Distribution',
                data: [45, 35, 15, 5],
                backgroundColor: ['#FF0000', '#00C49F', '#FFBB28', '#0000FF'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { size: 10 },
                },
            },
        },
    };

    return (
        <div className="m-5 p-4 border-2 border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold mb-1">Global Waste Distribution</h2>
            <p className="mb-4 text-sm text-gray-600">
                How waste is currently managed worldwide
            </p>
            <div className="relative w-full h-72 sm:h-80 md:h-96 flex justify-center items-center">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default WastePieChart;
