import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const WasteLineChart = () => {
  const data = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Recycled",
        data: [47, 50, 53, 56, 60],
        borderColor: "#00C49F",
        backgroundColor: "#00C49F",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Landfill",
        data: [42, 40, 37, 34, 30],
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Incinerated",
        data: [30, 32, 34, 35, 36],
        borderColor: "#0000FF",
        backgroundColor: "#0000FF",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Ocean/Environment",
        data: [15, 18, 21, 24, 28],
        borderColor: "#A020F0",
        backgroundColor: "#A020F0",
        tension: 0.4,
        fill: false,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        max: 70,
        ticks: {
          stepSize: 15,
        },
      },
    },
  };

  return (
    <div className="m-5 p-4 border-2 border-gray-300 rounded-md ">
      <h2 className="text-lg font-semibold mb-4">
        Waste Reduction Trends (2020-2024)
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Positive trends in waste reduction by material type
      </p>
      <div className="overflow-x-auto" style={{ height: "300px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WasteLineChart;
