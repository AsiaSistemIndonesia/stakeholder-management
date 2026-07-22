"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Stakeholder,
  getOrganisasiById,
  getZonaById,
  getFungsiById,
  kategoriColors,
} from "@/lib/data";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Calendar,
  FileText,
  Network,
} from "lucide-react";

interface StakeholderDetailModalProps {
  stakeholder: Stakeholder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StakeholderDetailModal({
  stakeholder,
  open,
  onOpenChange,
}: StakeholderDetailModalProps) {
  if (!stakeholder) return null;

  const orgId = stakeholder.organisasiIds?.[0] || stakeholder.organisasiId;
  const organisasi = orgId ? getOrganisasiById(orgId) : undefined;
  const zona = getZonaById(stakeholder.zonaOperasi);
  const fungsi = stakeholder.fungsiId
    ? getFungsiById(stakeholder.fungsiId)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto overflow-x-hidden w-full">
        <DialogHeader>
          <DialogTitle className="sr-only">Detail Stakeholder</DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex items-start gap-4 pb-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback
              className="text-2xl font-semibold"
              style={{
                backgroundColor: kategoriColors[stakeholder.kategori],
                color: "white",
              }}
            >
              {stakeholder.nama
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-foreground">
              {stakeholder.nama}
            </h2>
            <p className="text-muted-foreground">{stakeholder.jabatan}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                style={{
                  backgroundColor: kategoriColors[stakeholder.kategori],
                  color: "white",
                }}
              >
                {stakeholder.kategori}
              </Badge>
              {zona && (
                <Badge variant="outline" className="border-border">
                  {zona.nama}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-secondary shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">
                    {stakeholder.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-secondary shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <p className="text-sm font-medium text-foreground">
                    {stakeholder.telepon}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border md:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  <p className="text-sm font-medium text-foreground">
                    {stakeholder.alamat}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-border" />

        {/* Organization & Function */}
        <div className="py-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Organisasi & Fungsi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organisasi && (
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Organisasi</p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {organisasi.nama}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {organisasi.tipe}
                  </p>
                </CardContent>
              </Card>
            )}

            {fungsi && (
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Network
                      className="h-4 w-4"
                      style={{ color: fungsi.warna }}
                    />
                    <p className="text-xs text-muted-foreground">Fungsi</p>
                  </div>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {fungsi.nama}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {
                      fungsi.anggota.find(
                        (a) => a.stakeholderId === stakeholder.id,
                      )?.peran
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Education */}
        {(stakeholder.alumniPendidikan || stakeholder.jurusanPendidikan) && (
          <>
            <Separator className="bg-border" />
            <div className="py-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Pendidikan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stakeholder.alumniPendidikan && (
                  <Card className="bg-secondary/30 border-border">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">
                        Alumni Pendidikan
                      </p>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {stakeholder.alumniPendidikan}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {stakeholder.jurusanPendidikan && (
                  <Card className="bg-secondary/30 border-border">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Jurusan</p>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {stakeholder.jurusanPendidikan}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        {stakeholder.catatan && (
          <>
            <Separator className="bg-border" />
            <div className="py-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Catatan
              </h3>
              <p className="text-sm text-muted-foreground">
                {stakeholder.catatan}
              </p>
            </div>
          </>
        )}

        {/* Timestamps */}
        <Separator className="bg-border" />
        <div className="py-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Dibuat: {stakeholder.createdAt}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Diperbarui: {stakeholder.updatedAt}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
