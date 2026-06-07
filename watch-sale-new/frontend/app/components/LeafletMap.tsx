"use client";

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
}

const LocationMarker = ({ onLocationSelect, defaultLat = 7.8731, defaultLng = 80.7718 }: LeafletMapProps) => {
  const [position, setPosition] = useState<L.LatLng | null>(new L.LatLng(defaultLat, defaultLng));

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  const markerRef = useRef<L.Marker>(null);

  // Initialize
  useEffect(() => {
    onLocationSelect(defaultLat, defaultLng);
  }, []);

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition(newPos);
            onLocationSelect(newPos.lat, newPos.lng);
          }
        },
      }}
      ref={markerRef}
    />
  );
};

const LeafletMap = ({ onLocationSelect, defaultLat = 7.8731, defaultLng = 80.7718 }: LeafletMapProps) => {
  return (
    <div className="w-full h-[300px] bg-zinc-50 z-0 relative border border-zinc-100">
      <MapContainer 
        center={[defaultLat, defaultLng]} 
        zoom={7} 
        scrollWheelZoom={true}
        touchZoom={true}
        dragging={true}
        tap={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} defaultLat={defaultLat} defaultLng={defaultLng} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
