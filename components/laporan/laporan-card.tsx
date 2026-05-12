"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Insiden,
  getStakeholderById,
  getZonaById,
  urgensiColors,
  statusColors,
} from "@/lib/data";
import {
  MapPin,
  Calendar,
  User,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface IncidentCardProps {
  insiden: Insiden;
  onClick?: () => void;
}

const statusIcons = {
  baru: Clock,
  proses: AlertTriangle,
  selesai: CheckCircle2,
};

export function IncidentCard({ insiden, onClick }: IncidentCardProps) {
  const pelapor = getStakeholderById(insiden.pelapor);
  const zona = getZonaById(insiden.zonaOperasi);
  const StatusIcon = statusIcons[insiden.status];

  return (
    <Card
      className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-lg shrink-0"
            style={{ backgroundColor: `${urgensiColors[insiden.urgensi]}20` }}
          >
            <StatusIcon
              className="h-5 w-5"
              style={{ color: urgensiColors[insiden.urgensi] }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {insiden.judul}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: urgensiColors[insiden.urgensi],
                    color: "white",
                  }}
                >
                  {insiden.urgensi}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: statusColors[insiden.status],
                    color: statusColors[insiden.status],
                  }}
                >
                  {insiden.status}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {insiden.deskripsi}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {insiden.lokasi}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {insiden.tanggal}
              </div>
              {pelapor && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {pelapor.nama}
                </div>
              )}
              {zona && (
                <Badge variant="outline" className="text-xs border-border">
                  {zona.nama}
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
