import React from "react";
import { Clock4, Phone, MapPin, Recycle } from "lucide-react";

const CentersCard = ({
  centerId,
  centerName,
  address,
  number,
  schedule,
  acceptedMaterials = [],
  status = "active"
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };


  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-solid border-black relative z-0">
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(status)}`}>
        {status?.toUpperCase()}
      </div>

      {/* Center Name */}
      <h2 className="text-2xl font-semibold mb-2 pr-24">{centerName}</h2>

      {/* Address */}
      <p className="mb-2 flex items-center">
        <MapPin className="mr-2 flex-shrink-0" size={20} />
        <span className="font-medium">Address:</span>
        <span className="ml-2">{address}</span>
      </p>

      {/* Working Hours */}
      <p className="mb-2 flex items-center">
        <Clock4 className="mr-2 flex-shrink-0" size={20} />
        <span className="font-medium">Working Hours:</span>
        <span className="ml-2">{schedule}</span>
      </p>

      {/* Contact Number */}
      <p className="mb-4 flex items-center">
        <Phone className="mr-2 flex-shrink-0" size={20} />
        <span className="font-medium">Contact Number:</span>
        <span className="ml-2">{number}</span>
      </p>

      {/* Accepted Materials */}
      {acceptedMaterials.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Recycle className="mr-2" size={20} />
            <span className="font-medium">Accepted Materials:</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-7">
            {acceptedMaterials.map((material, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full text-xs font-medium"
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CentersCard;
