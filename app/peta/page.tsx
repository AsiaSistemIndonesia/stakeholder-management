"use client";

import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MapStats } from "@/components/peta/map-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

// Dynamically import the map component to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(
  () => import("@/components/peta/interactive-map").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-secondary rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Memuat peta...</div>
      </div>
    ),
  }
);

export default function PetaPage() {
  return (
    <DashboardLayout
      title="Peta Interaktif"
      subtitle="Visualisasi sebaran stakeholder dan insiden di seluruh zona operasi"
    >
      {/* Stats */}
      <div className="mb-6">
        <MapStats />
      </div>

      {/* Map */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Peta Zona Operasi Pertamina Drilling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InteractiveMap />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
