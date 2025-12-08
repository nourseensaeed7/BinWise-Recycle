import React, { useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineFileUpload, MdDeleteOutline } from "react-icons/md";
import { GrCircleInformation } from "react-icons/gr";

import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const RecycleCamera = () => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgSizes, setImgSizes] = useState({});

  const urlToBlob = async (url) => {
    const res = await fetch(url);
    return await res.blob();
  };

  const sendToAI = async (blob) => {
    setError("");
    try {
      setLoading(true);
      const form = new FormData();
      form.append("image", blob, "photo.jpg");

      const resp = await fetch(
        "https://vhmedmaher-recycling-api.hf.space/detect/",
        { method: "POST", body: form }
      );

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`AI API error ${resp.status} ${text}`);
      }

      const data = await resp.json();
      return data;
    } catch (err) {
      console.error("sendToAI error:", err);
      setError("AI detection failed. Try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  
  const mapApiResponseToPhoto = async (imageSrc, apiData) => {
    const img = new Image();
    img.src = imageSrc;
    await new Promise((res) => (img.onload = res));

    const naturalWidth = img.naturalWidth || 1;
    const naturalHeight = img.naturalHeight || 1;

    const detections = (apiData.detections || []).map((d, idx) => {
      const weightKg = (d.weight_g ?? 0) / 1000;
      return {
        id: `${Date.now()}-${idx}`,
        material: d.material || "unknown",
        weight_g: d.weight_g ?? 0,
        weight_kg: Number(weightKg.toFixed(3)),
        baseWeightKg: Number(weightKg.toFixed(3)),
        box_xyxy: Array.isArray(d.box_xyxy) ? d.box_xyxy : null,
        quantity: 1,
      };
    });

    return {
      id: Date.now().toString(),
      src: imageSrc,
      naturalWidth,
      naturalHeight,
      total_weight_g:
        apiData.total_weight_g ??
        detections.reduce((s, x) => s + (x.weight_g || 0), 0),
      total_weight_kg:
        apiData.total_weight_kg ??
        detections.reduce((s, x) => s + (x.weight_kg || 0), 0),
      detections,
    };
  };

  const capturePhoto = async () => {
    setError("");
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const blob = await urlToBlob(imageSrc);
      const apiData = await sendToAI(blob);
      if (!apiData) return;

      const photo = await mapApiResponseToPhoto(imageSrc, apiData);
      setPhotos((prev) => [photo, ...prev]);
      setIsCameraOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to capture photo.");
    }
  };

  const handleButtonClick = () => fileInputRef.current.click();

  const handleFileChange = async (event) => {
    setError("");
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageURL = URL.createObjectURL(file);
      const apiData = await sendToAI(file);
      if (!apiData) {
        URL.revokeObjectURL(imageURL);
        return;
      }
      const photo = await mapApiResponseToPhoto(imageURL, apiData);
      setPhotos((prev) => [photo, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image.");
    } finally {
      event.target.value = "";
    }
  };

  const deletePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleQuantityChange = (photoId, detectionId, newQty) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== photoId) return p;

        const detections = p.detections.map((d) => {
          if (d.id !== detectionId) return d;

          const qty = newQty < 1 ? 1 : newQty;
          const updatedWeightKg = d.baseWeightKg * qty;

          return {
            ...d,
            quantity: qty,
            weight_kg: updatedWeightKg, // just update weight
          };
        });

        return { ...p, detections };
      })
    );
  };

  const handleSchedulePickup = () => {
    const items = photos.flatMap((p) =>
      p.detections.map((d) => ({
        type: d.material,
        quantity: d.quantity,
        weight_kg: d.weight_kg,
        photoSrc: p.src,
      }))
    );
  
    // Calculate total weight
    const totalWeight = items.reduce((sum, item) => sum + item.weight_kg, 0);
  
    // Add instructions field
    const instructions = `Total weight of items: ${totalWeight.toFixed(2)} kg`;
  
    navigate("/pickup-and-dropoff/pickup", { state: { items, instructions } });
  };
  

  const renderBoundingBoxes = (photo, displayedWidth, displayedHeight) => {
    if (!photo.detections || photo.detections.length === 0) return null;
    const sx = displayedWidth / (photo.naturalWidth || displayedWidth || 1);
    const sy = displayedHeight / (photo.naturalHeight || displayedHeight || 1);

    return photo.detections.map((d) => {
      if (!d.box_xyxy) return null;
      const [x1, y1, x2, y2] = d.box_xyxy;
      const left = x1 * sx;
      const top = y1 * sy;
      const width = Math.max(2, (x2 - x1) * sx);
      const height = Math.max(2, (y2 - y1) * sy);

      return (
        <div
          key={d.id}
          className="absolute pointer-events-none"
          style={{
            left,
            top,
            width,
            height,
            border: "2px solid rgba(56, 189, 130, 0.9)",
            boxShadow: "0 0 6px rgba(56,189,130,0.3)",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              left: 0,
              background: "rgba(24,105,51,0.95)",
              color: "white",
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {d.material}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="border rounded-xl p-4 bg-white border-gray-300 w-full h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 text-xl mb-2">
        <IoCameraOutline className="text-2xl" />
        <h2 className="font-semibold">AI Image Recognition</h2>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Scan or upload an image to identify recyclable materials
      </p>

      {/* Warning box */}
      <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4">
        <AlertTriangle className=" w-fit text-yellow-600  mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 text-sm mb-1">
            Warning!
          </h3>
          <p className="text-yellow-700 text-xs">
            Please ensure your image is clear and well-lit for accurate
            detection.
          </p>
        </div>
      </div>

      {/* Camera */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-6 min-h-[280px] transition-all">
        {isCameraOpen ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="rounded-lg shadow-lg w-full"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "environment",
              }}
            />
            <button
              onClick={capturePhoto}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium"
              disabled={loading}
            >
              {loading ? "Detecting..." : "Capture Photo"}
            </button>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        ) : (
          <>
            <IoCameraOutline className="text-8xl text-gray-400 mb-3" />
            <h3 className="font-semibold text-lg">Ready to Scan</h3>
            <p className="text-gray-600 text-sm mb-3 text-center">
              Take a photo or upload an image to get started
            </p>
            <button
              onClick={() => setIsCameraOpen(true)}
              className="cursor-pointer rounded-xl text-sm md:text-lg px-3 h-9 text-white bg-[#186933] hover:bg-[#124d26] inline-flex items-center justify-center gap-1"
            >
              <IoCameraOutline className="text-lg" /> Take Photo
            </button>
          </>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleButtonClick}
          className="cursor-pointer rounded-xl border border-gray-300 text-sm px-3 w-full h-9 hover:bg-gray-200 inline-flex items-center justify-center gap-1"
        >
          <MdOutlineFileUpload className="text-xl" /> Upload Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      <div className="flex gap-3 bg-blue-100 border border-blue-200 rounded-lg p-2 my-4">
        <div className="flex-1">
          <div className="flex items-center gap-1 my-1">
        <GrCircleInformation className=" w-fit  text-blue-800" />
          <h3 className="font-semibold text-blue-800 text-sm ">
          Notice
          </h3>
         </div>
          <p className="text-blue-700 text-sm">
          All items should ideally be of the same material for accurate pickup.
          </p>
        </div>
      </div>

      {/* Photos History */}
      {photos.length > 0 && (
        <div className="mt-6 flex flex-col gap-5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative flex flex-col md:flex-row items-center md:items-start gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
            >
              <button
                onClick={() => deletePhoto(photo.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 z-10 cursor-pointer"
                title="Delete Photo"
              >
                <MdDeleteOutline className="text-red-600 text-2xl" />
              </button>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={photo.src}
                  alt="Captured or Uploaded"
                  className="rounded-lg shadow-lg w-60 select-none"
                  onLoad={(e) => {
                    const el = e.currentTarget;
                    setImgSizes((prev) => ({
                      ...prev,
                      [photo.id]: {
                        width: el.clientWidth,
                        height: el.clientHeight,
                      },
                    }));
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: imgSizes[photo.id]?.width || 240,
                    height: imgSizes[photo.id]?.height || 180,
                  }}
                >
                  {photo.detections &&
                    renderBoundingBoxes(
                      photo,
                      imgSizes[photo.id]?.width || 240,
                      imgSizes[photo.id]?.height || 180
                    )}
                </div>
              </div>

              {/* Detection cards */}
              <div className="flex flex-col gap-2 text-gray-700 text-sm w-full">
                <h3 className="font-semibold text-base mb-1">
                  Detected Item Info
                </h3>

                {photo.detections.length === 0 ? (
                  <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4">
                    <AlertTriangle className=" w-fit text-yellow-600  mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800 text-sm mb-1">
                        Try Again!
                      </h3>
                      <p className="text-yellow-700 text-xs">
                        No items detected. The image might not be clear. Please
                        try another photo.
                      </p>
                    </div>
                  </div>
                ) : (
                  photo.detections.map((d) => (
                    <div
                      key={d.id}
                      className="mb-2 p-3 rounded-lg bg-white border border-gray-100 shadow-sm"
                    >
                      <div className="flex justify-between flex-col sm:flex-row md:flex-row">
                        <span className="font-medium">Type of Object:</span>
                        <span className="capitalize">{d.material}</span>
                      </div>

                      <div className="flex justify-between flex-col sm:flex-row md:flex-row">
                        <span className="font-medium">Weight:</span>
                        <span>{d.weight_kg.toFixed(2)} kg</span>
                      </div>

                      <div className="flex  gap-2 mt-2 flex-col item sm:flex-row md:flex-row">
                        <span className="font-medium pt-1">Quantity:</span>
                        <input
                          type="number"
                          value={d.quantity}
                          min={1}
                          onChange={(e) =>
                            handleQuantityChange(
                              photo.id,
                              d.id,
                              parseInt(e.target.value || 1)
                            )
                          }
                          className="w-20 border border-gray-300 rounded-md px-2 py-1 text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
          ))}

          <div className="self-center">
            <button
              onClick={handleSchedulePickup}
              className="bg-[#186933] hover:bg-[#124d26] w-full text-white px-4 py-2 rounded-xl cursor-pointer"
            >
              Schedule Pickup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecycleCamera;
