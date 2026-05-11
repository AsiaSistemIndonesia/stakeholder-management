"use client";

import { Card, CardContent } from "@/components/ui/card";
import { zonaOperasiData, stakeholderData, insidenData } from "@/lib/data";
import { Map, Users, AlertTriangle, Building2 } from "lucide-react";

export function MapStats() {
  const stats = zonaOperasiData.map((zona) => {
    const stakeholders = stakeholderData.filter(
      (sh) => sh.zonaOperasi === zona.id
    );
    const incidents = insidenData.filter((ins) => ins.zonaOperasi === zona.id);
    const activeIncidents = incidents.filter((ins) => ins.status !== "selesai");

    return {
      zona,
      stakeholderCount: stakeholders.length,
      incidentCount: incidents.length,
      activeIncidentCount: activeIncidents.length,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map(({ zona, stakeholderCount, incidentCount, activeIncidentCount }) => (
        <Card key={zona.id} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${zona.warna}20` }}
              >
                <Map className="h-4 w-4" style={{ color: zona.warna }} />
              </div>
              <h3 className="font-medium text-foreground text-sm">
                {zona.nama.replace("Zona ", "")}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  Stakeholder
                </span>
                <span className="font-medium text-foreground">
                  {stakeholderCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  Insiden Aktif
                </span>
                <span
                  className="font-medium"
                  style={{
                    color: activeIncidentCount > 0 ? "#ef4444" : "#10b981",
                  }}
                >
                  {activeIncidentCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
