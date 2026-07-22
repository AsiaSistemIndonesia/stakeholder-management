"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Organisasi,
  getZonaById,
  getStakeholdersByOrganisasi,
  getChildOrganisasi,
  getOrganisasiById,
  kategoriColors,
} from "@/lib/data";
import { Building2, MapPin, Users, Network, FileText } from "lucide-react";

interface OrgDetailModalProps {
  organisasi: Organisasi | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tipeColors: Record<Organisasi["tipe"], string> = {
  pemerintah: "#EF4444",
  swasta: "#3B82F6",
  bumn: "#F59E0B",
  komunitas: "#10B981",
  internal: "#8B5CF6",
};

export function OrgDetailModal({
  organisasi,
  open,
  onOpenChange,
}: OrgDetailModalProps) {
  if (!organisasi) return null;

  const zona = getZonaById(organisasi.zonaOperasi);
  const stakeholders = getStakeholdersByOrganisasi(organisasi.id);
  const childOrgs = getChildOrganisasi(organisasi.id);
  const parentOrg = organisasi.parentId
    ? getOrganisasiById(organisasi.parentId)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto overflow-x-hidden w-full">
        <DialogHeader>
          <DialogTitle className="sr-only">Detail Organisasi</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-start gap-4 pb-4">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: `${tipeColors[organisasi.tipe]}20` }}
          >
            <Building2
              className="h-10 w-10"
              style={{ color: tipeColors[organisasi.tipe] }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-foreground">
              {organisasi.nama}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                style={{
                  backgroundColor: tipeColors[organisasi.tipe],
                  color: "white",
                }}
              >
                {organisasi.tipe}
              </Badge>
              {zona && (
                <Badge variant="outline" className="border-border">
                  <MapPin className="h-3 w-3 mr-1" />
                  {zona.nama}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Description */}
        <div className="py-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Deskripsi
          </h3>
          <p className="text-sm text-muted-foreground">
            {organisasi.deskripsi}
          </p>
        </div>

        <Separator className="bg-border" />

        {/* Info Cards */}
        <div className="py-4 grid grid-cols-2 gap-4">
          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  <p className="text-sm font-medium text-foreground">
                    {organisasi.alamat}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {parentOrg && (
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Network className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Induk Organisasi
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {parentOrg.nama}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Child Organizations */}
        {childOrgs.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div className="py-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                Sub-Organisasi ({childOrgs.length})
              </h3>
              <div className="space-y-2">
                {childOrgs.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    <Building2
                      className="h-4 w-4"
                      style={{ color: tipeColors[child.tipe] }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {child.nama}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {child.tipe}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Related Stakeholders */}
        <Separator className="bg-border" />
        <div className="py-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Stakeholder Terkait ({stakeholders.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {stakeholders.map((sh) => (
              <div
                key={sh.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className="text-xs"
                    style={{
                      backgroundColor: kategoriColors[sh.kategori],
                      color: "white",
                    }}
                  >
                    {sh.nama
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {sh.nama}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {sh.jabatan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
