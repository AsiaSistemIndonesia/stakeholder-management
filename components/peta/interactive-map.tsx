"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  stakeholderData,
  zonaOperasiData,
  insidenData,
  getOrganisasiById,
  kategoriColors,
  urgensiColors,
  Stakeholder,
  Insiden,
  ZonaOperasi,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertTriangle, MapPin, Building2 } from "lucide-react";
import { useTheme } from "next-themes";

// Fix for default marker icons in Next.js
const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const createInsidenIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker-insiden",
    html: `<div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" stroke-width="2" fill="none"/>
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

interface MapControlsProps {
  activeZona: string | null;
  zones: ZonaOperasi[];
  onZonaChange: (zonaId: string | null) => void;
  showStakeholders: boolean;
  showIncidents: boolean;
  onToggleStakeholders: () => void;
  onToggleIncidents: () => void;
}

function MapControls({
  activeZona,
  zones,
  onZonaChange,
  showStakeholders,
  showIncidents,
  onToggleStakeholders,
  onToggleIncidents,
}: MapControlsProps) {
  return (
    <Card className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur border-border w-64">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Zona Operasi
          </h3>
          <div className="space-y-1">
            <Button
              variant={activeZona === null ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onZonaChange(null)}
            >
              Semua Zona
            </Button>
            {zones.map((zona) => (
              <Button
                key={zona.id}
                variant={activeZona === zona.id ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => onZonaChange(zona.id)}
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: zona.warna }}
                />
                {zona.nama}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Tampilkan
          </h3>
          <div className="space-y-2">
            <Button
              variant={showStakeholders ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs"
              onClick={onToggleStakeholders}
            >
              <Users className="h-3 w-3 mr-2" />
              Stakeholder
            </Button>
            <Button
              variant={showIncidents ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs"
              onClick={onToggleIncidents}
            >
              <AlertTriangle className="h-3 w-3 mr-2" />
              Insiden
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MapLegendProps {
  showStakeholders: boolean;
  showIncidents: boolean;
}

function MapLegend({ showStakeholders, showIncidents }: MapLegendProps) {
  return (
    <Card className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur border-border">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Legenda</h3>

        {showStakeholders && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Kategori Stakeholder
            </p>
            {Object.entries(kategoriColors).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-foreground capitalize">
                  {key}
                </span>
              </div>
            ))}
          </div>
        )}

        {showIncidents && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Urgensi Insiden</p>
            {Object.entries(urgensiColors).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-foreground capitalize">
                  {key}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ZoomToZona({ zona }: { zona: ZonaOperasi | null }) {
  const map = useMap();

  useEffect(() => {
    if (zona) {
      map.flyTo([zona.koordinat.lat, zona.koordinat.lng], 7, { duration: 1 });
    } else {
      map.flyTo([-2.5, 118], 5, { duration: 1 });
    }
  }, [zona, map]);

  return null;
}

export function InteractiveMap() {
  const [mounted, setMounted] = useState(false);
  const [activeZona, setActiveZona] = useState<string | null>(null);
  const [showStakeholders, setShowStakeholders] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[600px] bg-secondary rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Memuat peta...</div>
      </div>
    );
  }

  const filteredStakeholders = activeZona
    ? stakeholderData.filter((sh) => sh.zonaOperasi === activeZona)
    : stakeholderData;

  const filteredIncidents = activeZona
    ? insidenData.filter((ins) => ins.zonaOperasi === activeZona)
    : insidenData;

  const activeZonaData = activeZona
    ? zonaOperasiData.find((z) => z.id === activeZona) || null
    : null;

  return (
    <div className="relative h-[600px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        className="h-full w-full"
        style={{ background: isDark ? "#1f2937" : "#e8e8e8" }}
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/${isDark ? "dark_all" : "light_all"}/{z}/{x}/{y}{r}.png`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ZoomToZona zona={activeZonaData} />

        {/* Zona Polygons */}
        {zonaOperasiData.map((zona) => (
          <Polygon
            key={zona.id}
            positions={zona.batasWilayah.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: zona.warna,
              fillColor: zona.warna,
              fillOpacity: activeZona === zona.id ? 0.3 : 0.1,
              weight: activeZona === zona.id ? 3 : 1,
            }}
          >
            <Popup>
              <div className="text-foreground">
                <h3 className="font-semibold">{zona.nama}</h3>
                <p className="text-sm text-muted-foreground">
                  {zona.deskripsi}
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Stakeholder Markers */}
        {showStakeholders &&
          filteredStakeholders.map((sh) => {
            const org = getOrganisasiById(sh.organisasiId);
            return (
              <Marker
                key={sh.id}
                position={[sh.koordinat.lat, sh.koordinat.lng]}
                icon={createIcon(kategoriColors[sh.kategori])}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: kategoriColors[sh.kategori] }}
                      >
                        {sh.nama
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {sh.nama}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sh.jabatan}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        {org?.nama}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {sh.alamat}
                      </div>
                    </div>
                    <Badge
                      className="mt-2 text-xs"
                      style={{
                        backgroundColor: kategoriColors[sh.kategori],
                        color: "white",
                      }}
                    >
                      {sh.kategori}
                    </Badge>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Incident Markers */}
        {showIncidents &&
          filteredIncidents.map((ins) => (
            <Marker
              key={ins.id}
              position={[ins.koordinat.lat, ins.koordinat.lng]}
              icon={createInsidenIcon(urgensiColors[ins.urgensi])}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle
                      className="h-5 w-5 shrink-0"
                      style={{ color: urgensiColors[ins.urgensi] }}
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {ins.judul}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ins.lokasi}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {ins.deskripsi}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: urgensiColors[ins.urgensi],
                        color: "white",
                      }}
                    >
                      {ins.urgensi}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {ins.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {ins.tanggal}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <MapControls
        activeZona={activeZona}
        zones={zonaOperasiData}
        onZonaChange={setActiveZona}
        showStakeholders={showStakeholders}
        showIncidents={showIncidents}
        onToggleStakeholders={() => setShowStakeholders(!showStakeholders)}
        onToggleIncidents={() => setShowIncidents(!showIncidents)}
      />

      <MapLegend
        showStakeholders={showStakeholders}
        showIncidents={showIncidents}
      />
    </div>
  );
}
