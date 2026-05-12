"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Banknote,
  Building2,
  GraduationCap,
  Leaf,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import type { CSR } from "@/lib/data";
import { csrKategoriColors, getStakeholderById } from "@/lib/data";

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

interface CSRCardProps {
  csr: CSR;
  onClick: () => void;
}

export function CSRCard({ csr, onClick }: CSRCardProps) {
  const stakeholders = csr.stakeholderIds
    .map((id) => getStakeholderById(id))
    .filter(Boolean);

  const formatBudget = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(1)} T`;
    }
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`;
    }
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(0)} Jt`;
    }
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  return (
    <Card
      className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2">
              {csr.nama}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {csr.lokasi.kabupaten}, {csr.lokasi.provinsi}
              </span>
            </div>
          </div>
          <Badge
            variant={csr.status === "active" ? "default" : "secondary"}
            className={
              csr.status === "active"
                ? "bg-success/15 text-success border-success/30 shrink-0"
                : "bg-muted text-muted-foreground shrink-0"
            }
          >
            {csr.status === "active" ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="gap-1.5"
            style={{
              borderColor: csrKategoriColors[csr.kategori],
              color: csrKategoriColors[csr.kategori],
            }}
          >
            {kategoriIcons[csr.kategori]}
            {kategoriLabels[csr.kategori]}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Banknote className="h-4 w-4 text-success" />
            {formatBudget(csr.budget)}
          </div>
        </div>

        {csr.deskripsi && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {csr.deskripsi}
          </p>
        )}

        {stakeholders.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-border">
            <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {stakeholders.length} stakeholder terkait
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
