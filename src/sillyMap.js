import React, { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SillyMap = () => {
    const mapRef = useRef(null);
    const latitude = 21.942182926382465;
    const longitude = -102.24716316446698;
  
    return ( 
        <MapContainer center={[latitude, longitude]} zoom={20} ref={mapRef} scrollWheelZoom={false} style={{height: "100vh", width: "100vw"}}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Additional map layers or components can be added here */}
        </MapContainer>
    );
  };
  
  export default SillyMap;