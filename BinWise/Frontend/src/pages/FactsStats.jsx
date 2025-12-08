import React from "react";
import Awarencecard from "../components/Awarencecard";
import Awarencerate from "../components/Awarencerate";
import WasteLineChart from "../components/WasteLineChart";
import WastePieChart from "../components/WastePieChart";
import {
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";

const FactsStats = () => {
  return (
    <div>
      <div className="grid grid-cols-2  md:grid-cols-4">
        <Awarencecard title="2.01B" description="Tons of waste generated globally per year" icon={GlobeAltIcon} color="blue" />
        <Awarencecard title="32%" description="Global recycling rate" icon={ArrowPathRoundedSquareIcon} color="green" />
        <Awarencecard title="75%" description="Of waste could be recycled or composted" icon={ArrowTrendingUpIcon} color="purple" />
        <Awarencecard title="1.6M" description="Jobs created by recycling industry" icon={ChartBarIcon} color="orange" />
      </div>
      <Awarencerate />
      <WastePieChart />
      <WasteLineChart />
    </div>
  );
};

export default FactsStats;
