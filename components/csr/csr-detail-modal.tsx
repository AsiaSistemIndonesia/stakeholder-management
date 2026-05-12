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
  MapPin,
  Calendar,
  Banknote,
  Building2,
  GraduationCap,
  Leaf,
  TrendingUp,
  HeartHandshake,
  Users,
  Globe,
} from "lucide-react";
import type { CSR } from "@/lib/data";
import {
  csrKategoriColors,
  getStakeholderById,
  kategoriColors,
} from "@/lib/data";

const kategoriIcons: Record<CSR["kategori"], React.ReactNode> = {
  infrastruktur: <Building2 className="h-4 w-4" />,
  pendidikan: <GraduationCap className="h-4 w-4" />,
  lingkungan: <Leaf className="h-4 w-4" />,
  ekonomi: <TrendingUp className="h-4 w-4" />,
  sosial: <HeartHandshake className="h-4 w-4" />,
};

const kategoriLabels: Record<CSR["kategori"], string> = {
  infrastruktur: "Infrastruktur",
  pendidikan: "Pendidikan",
  lingkungan: "Lingkungan",
  ekonomi: "Ekonomi",
  sosial: "Sosial",
};

interface CSRDetailModalProps {
  csr: CSR | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CSRDetailModal({
  csr,
  open,
  onOpenChange,
}: CSRDetailModalProps) {
  if (!csr) return null;

  const stakeholders = csr.stakeholderIds
    .map((id) => getStakeholderById(id))
    .filter(Boolean);

  const formatBudget = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${csrKategoriColors[csr.kategori]}20`,
              }}
            >
              <div style={{ color: csrKategoriColors[csr.kategori] }}>
                {kategoriIcons[csr.kategori]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-foreground text-left">
                {csr.nama}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="gap-1"
                  style={{
                    borderColor: csrKategoriColors[csr.kategori],
                    color: csrKategoriColors[csr.kategori],
                  }}
                >
                  {kategoriIcons[csr.kategori]}
                  {kategoriLabels[csr.kategori]}
                </Badge>
                <Badge
                  variant={csr.status === "active" ? "default" : "secondary"}
                  className={
                    csr.status === "active"
                      ? "bg-success/15 text-success border-success/30"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {csr.status === "active" ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Budget */}
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                  <p className="text-lg font-bold text-success">
                    {formatBudget(csr.budget)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {csr.deskripsi && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Deskripsi
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {csr.deskripsi}
              </p>
            </div>
          )}

          <Separator className="bg-border" />

          {/* Location Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Lokasi
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Pulau</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  {csr.lokasi.pulau}
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Provinsi</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {csr.lokasi.provinsi}
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Kabupaten/Kota</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {csr.lokasi.kabupaten}
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Kecamatan</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {csr.lokasi.kecamatan}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Related Stakeholders */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Stakeholder Terkait ({stakeholders.length})
            </h3>
            {stakeholders.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stakeholders.map(
                  (sh) =>
                    sh && (
                      <div
                        key={sh.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
                      >
                        <Avatar className="h-6 w-6">
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
                        <div>
                          <span className="text-sm text-foreground">
                            {sh.nama}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {sh.jabatan}
                          </p>
                        </div>
                      </div>
                    ),
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Belum ada stakeholder terkait
              </p>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Created Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Dibuat pada{" "}
              {new Date(csr.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
