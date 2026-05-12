"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";

const TILE_DARK =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_LIGHT =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    background-color: #ED1A2F;
    width: 22px;
    height: 22px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

interface ClickHandlerProps {
  onKoordinatChange: (k: { lat: number; lng: number }) => void;
}

function ClickHandler({ onKoordinatChange }: ClickHandlerProps) {
  useMapEvents({
    click(e) {
      onKoordinatChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface MapPickerProps {
  koordinat: { lat: number; lng: number } | null;
  onKoordinatChange: (k: { lat: number; lng: number }) => void;
}

export default function MapPicker({
  koordinat,
  onKoordinatChange,
}: MapPickerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={4}
      className="h-full w-full"
      style={{
        background: isDark ? "#1f2937" : "#e8e8e8",
        cursor: "crosshair",
      }}
    >
      <TileLayer
        key={resolvedTheme}
        url={isDark ? TILE_DARK : TILE_LIGHT}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickHandler onKoordinatChange={onKoordinatChange} />
      {koordinat && (
        <Marker position={[koordinat.lat, koordinat.lng]} icon={pinIcon} />
      )}
    </MapContainer>
  );
}
