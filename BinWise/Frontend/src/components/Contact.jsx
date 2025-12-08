import React from "react";
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaFacebook 
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="w-full bg-white py-16">
      <div className="flex flex-col md:flex-row md:gap-50 md:justify-around text-xl place-self-center-safe">
        
        {/* Social Media Section */}
        <div className="mb-10 md:mb-0">
          <h2 className="font-bold text-gray-800 text-2xl mb-3">Social media</h2>
          <div className="w-20 h-1 bg-green-700 mb-8"></div>

          {/* WhatsApp 1 */}
          <a
            href="https://wa.me/123445678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 mb-6 hover:opacity-80 transition"
          >
            <FaWhatsapp className="text-green-600 text-2xl" />
            <p className="text-gray-700">+112-34-567-89-00</p>
          </a>

          {/* WhatsApp 2 */}
          <a
            href="https://wa.me/123445678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 mb-6 hover:opacity-80 transition"
          >
            <FaWhatsapp className="text-green-600 text-2xl" />
            <p className="text-gray-700">+098-76-543-21-00</p>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/binwise"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <FaFacebook className="text-blue-600 text-2xl" />
            <p className="text-gray-700">Bin Wise</p>
          </a>
        </div>

        {/* Contacts Section */}
        <div>
          <h2 className="font-bold text-2xl text-gray-800 mb-3">Contacts</h2>
          <div className="w-20 h-1 bg-green-700 mb-8"></div>

          {/* Phone */}
          <a
            href="tel:+998905070707"
            className="flex items-center gap-1 mb-6 hover:opacity-80 transition"
          >
            <FaPhoneAlt className="text-green-700" />
            <p className="text-gray-700">+112-34-567-89-00</p>
          </a>

          {/* Email */}
          <a
            href="mailto:BinWise@gmail.com"
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition"
          >
            <FaEnvelope className="text-green-700" />
            <p className="text-gray-700">BinWise@gmail.com</p>
          </a>

          {/* Location */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=El+Shatby+Alexandria"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-1 hover:opacity-80 transition"
          >
            <FaMapMarkerAlt className="text-green-700 mt-1" />
            <p className="text-gray-700">
              El-Shatby, Alexandria, Egypt
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
