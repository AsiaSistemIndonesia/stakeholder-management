"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Organisasi,
  getZonaById,
  getStakeholdersByOrganisasi,
  getChildOrganisasi,
} from "@/lib/data";
import { Building2, Users, MapPin, ChevronRight, Network } from "lucide-react";

interface OrgCardProps {
  organisasi: Organisasi;
  onClick?: () => void;
}

const tipeColors: Record<Organisasi["tipe"], string> = {
  pemerintah: "#EF4444",
  swasta: "#3B82F6",
  bumn: "#F59E0B",
  komunitas: "#10B981",
  internal: "#8B5CF6",
};

export function OrgCard({ organisasi, onClick }: OrgCardProps) {
  const zona = getZonaById(organisasi.zonaOperasi);
  const stakeholders = getStakeholdersByOrganisasi(organisasi.id);
  const childOrgs = getChildOrganisasi(organisasi.id);

  return (
    <Card
      className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${tipeColors[organisasi.tipe]}20` }}
            >
              <Building2
                className="h-6 w-6"
                style={{ color: tipeColors[organisasi.tipe] }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {organisasi.nama}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {organisasi.deskripsi}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge
                  variant="outline"
                  style={{
                    borderColor: tipeColors[organisasi.tipe],
                    color: tipeColors[organisasi.tipe],
                  }}
                >
                  {organisasi.tipe}
                </Badge>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {zona?.nama || "-"}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {stakeholders.length} stakeholder
                </div>

                {childOrgs.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Network className="h-3 w-3" />
                    {childOrgs.length} sub-organisasi
                  </div>
                )}
              </div>
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
