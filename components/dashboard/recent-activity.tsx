"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { insidenData, getStakeholderById, urgensiColors, statusColors } from "@/lib/data";
import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

const statusIcons = {
  baru: Clock,
  proses: AlertTriangle,
  selesai: CheckCircle2,
};

export function RecentActivity() {
  const recentInsiden = insidenData.slice(0, 5);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base font-medium text-card-foreground">
          Laporan Insiden Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInsiden.map((insiden) => {
            const pelapor = getStakeholderById(insiden.pelapor);
            const StatusIcon = statusIcons[insiden.status];

            return (
              <div
                key={insiden.id}
                className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${urgensiColors[insiden.urgensi]}20` }}
                >
                  <StatusIcon
                    className="h-4 w-4"
                    style={{ color: urgensiColors[insiden.urgensi] }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {insiden.judul}
                    </p>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs"
                      style={{
                        borderColor: statusColors[insiden.status],
                        color: statusColors[insiden.status],
                      }}
                    >
                      {insiden.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {insiden.deskripsi}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {insiden.lokasi}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {pelapor?.nama}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {insiden.tanggal}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
