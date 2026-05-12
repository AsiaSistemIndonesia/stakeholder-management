"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  CheckCircle2,
  Banknote,
  Building2,
  GraduationCap,
  Leaf,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import { csrData, csrKategoriColors, type CSR } from "@/lib/data";

const kategoriIcons: Record<CSR["kategori"], React.ReactNode> = {
  infrastruktur: <Building2 className="h-4 w-4" />,
  pendidikan: <GraduationCap className="h-4 w-4" />,
  lingkungan: <Leaf className="h-4 w-4" />,
  ekonomi: <TrendingUp className="h-4 w-4" />,
  sosial: <HeartHandshake className="h-4 w-4" />,
};

export function CSRStats() {
  const totalCSR = csrData.length;
  const activeCSR = csrData.filter((c) => c.status === "active").length;
  const totalBudget = csrData.reduce((sum, c) => sum + c.budget, 0);

  const byKategori = csrData.reduce(
    (acc, c) => {
      acc[c.kategori] = (acc[c.kategori] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const formatBudget = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(1)} T`;
    }
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`;
    }
    return `Rp ${(amount / 1000000).toFixed(0)} Jt`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Program</p>
              <p className="text-xl font-bold text-foreground">{totalCSR}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Program Aktif</p>
              <p className="text-xl font-bold text-foreground">{activeCSR}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border lg:col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Budget CSR</p>
              <p className="text-xl font-bold text-foreground">
                {formatBudget(totalBudget)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(Object.keys(byKategori) as CSR["kategori"][]).map((kategori) => (
        <Card key={kategori} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${csrKategoriColors[kategori]}20` }}
              >
                <div style={{ color: csrKategoriColors[kategori] }}>
                  {kategoriIcons[kategori]}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground capitalize">
                  {kategori}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {byKategori[kategori]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
