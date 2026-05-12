"use client";

import { Card, CardContent } from "@/components/ui/card";
import { insidenData } from "@/lib/data";
import { AlertTriangle, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function IncidentStats() {
  const total = insidenData.length;
  const baru = insidenData.filter((i) => i.status === "baru").length;
  const proses = insidenData.filter((i) => i.status === "proses").length;
  const selesai = insidenData.filter((i) => i.status === "selesai").length;
  const tinggi = insidenData.filter((i) => i.urgensi === "tinggi").length;

  const stats = [
    {
      label: "Total Insiden",
      value: total,
      icon: AlertTriangle,
      color: "#3b82f6",
    },
    {
      label: "Insiden Baru",
      value: baru,
      icon: Clock,
      color: "#3b82f6",
    },
    {
      label: "Sedang Diproses",
      value: proses,
      icon: AlertCircle,
      color: "#f59e0b",
    },
    {
      label: "Selesai",
      value: selesai,
      icon: CheckCircle2,
      color: "#10b981",
    },
    {
      label: "Urgensi Tinggi",
      value: tinggi,
      icon: AlertTriangle,
      color: "#ef4444",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
