import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

const centerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

const activeCenterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png", // Green icon
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

const inactiveCenterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png", // Gray icon
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

// Component to move map when user location changes
function LocationMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);
  
  return position ? (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <b>📍 You are here</b>
          <br />
          <small>Current Location</small>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

export default function MapComp({ centers = [] }) {
  const [userPosition, setUserPosition] = useState(null);
  const [centerLocations, setCenterLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert address to coordinates using Nominatim API
  async function fetchCoordinates(address) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", address, error);
      return null;
    }
  }

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = [pos.coords.latitude, pos.coords.longitude];
          setUserPosition(userCoords);
        },
        (err) => {
          console.warn(" Could not get user location:", err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Fetch coordinates for all centers from backend
  useEffect(() => {
    async function loadCenters() {
      if (centers.length === 0) {
        setCenterLocations([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const results = [];
      
      for (const center of centers) {
        // Check if center already has coordinates
        if (center.coordinates?.lat && center.coordinates?.lng) {
          results.push({
            ...center,
            coords: [center.coordinates.lat, center.coordinates.lng],
          });
        } else {
          // Geocode the location/address
          const coords = await fetchCoordinates(center.location || center.address);
          if (coords) {
            results.push({ ...center, coords });
          } else {
            console.warn(` Could not geocode center: ${center.name}`);
          }
        }
        
        // Add small delay to respect Nominatim rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    
      setCenterLocations(results);
      setLoading(false);
    }
    
    loadCenters();
  }, [centers]);

  // Get icon based on center status
  const getCenterIcon = (status) => {
    switch (status) {
      case "active":
        return activeCenterIcon;
      case "inactive":
        return inactiveCenterIcon;
      default:
        return centerIcon;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const defaultCenter = userPosition || [31.2001, 29.9187]; // Alexandria as default

  return (
    <div className="w-full h-[500px] relative">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">Loading centers on map...</p>
        </div>
      )}
      
      <MapContainer
        center={defaultCenter}
        zoom={userPosition ? 13 : 10}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User location marker */}
        <LocationMarker position={userPosition} />

        {/* Center markers */}
        {centerLocations.map((center) => (
          <Marker
            key={center._id}
            position={center.coords}
            icon={getCenterIcon(center.status)}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1">{center.name}</h3>
                
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getStatusColor(center.status)}`}>
                  {center.status?.toUpperCase()}
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    📍 {center.location || center.address}
                  </p>
                  
                  {center.contact && (
                    <p className="text-gray-600">
                      📞 {center.contact}
                    </p>
                  )}
                  
                  {center.operatingHours && (
                    <p className="text-gray-600">
                      🕒 {center.operatingHours}
                    </p>
                  )}
                  
                  {center.acceptedMaterials && center.acceptedMaterials.length > 0 && (
                    <p className="text-gray-600">
                      ♻️ {center.acceptedMaterials.join(", ")}
                    </p>
                  )}
                  
              
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
