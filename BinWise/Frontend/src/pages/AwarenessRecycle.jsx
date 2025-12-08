import React from 'react'
import { Anvil, StickyNote, Wine  } from 'lucide-react';
import { FaBottleWater } from "react-icons/fa6";
import AwarenessRecyclecard from '../components/AwarenessRecyclecard';
const AwarenessRecycle = () => {
    return (
        <div className="w-full min-h-screen overflow-x-hidden flex flex-col ">
            <div className='flex flex-wrap  justify-center '>
                <AwarenessRecyclecard icon= {<FaBottleWater /> } title="Plastic"text="Clean containers, check recycling numbers" dos={["Clean thoroughly", "Remove caps/lids", "Check numbers 1–7"]}
                    donts={["Plastic bags", "Styrofoam", "Dirty containers"]} />
                <AwarenessRecyclecard icon={<StickyNote/>} title="Paper" text="Keep dry, remove contaminants" dos={["Flatten cardboard ", "Remove staples", "Keep dry"]}
                    donts={["Wet paper", "Wax-coated paper", "Tissue paper"]} />
                <AwarenessRecyclecard icon= {<Wine />} title="Glass" text="Rinse clean, separate by color" dos={["Rinse containers ", "Remove metal lids", "Separate colors"]}
                    donts={["Broken glass", "Light bulbs", "Mirrors"]} />
                <AwarenessRecyclecard icon= {<Anvil/> }  title="Metal" text="Clean cans, separate types" dos={["Clean food residue ", "Crush to save space", "Include steel cans"]}
                    donts={["Paint cans", "Aerosol cans", "Hazardous materials"]} />
            </div>
        </div>
        
    )
    
}
export default AwarenessRecycle;
