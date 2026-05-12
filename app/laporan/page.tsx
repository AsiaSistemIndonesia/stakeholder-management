"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { IncidentCard } from "@/components/laporan/laporan-card";
import { LaporanDetailModal } from "@/components/laporan/laporan-detail-modal";
import { CreateLaporanModal } from "@/components/laporan/create-laporan-modal";
import { IncidentStats } from "@/components/laporan/laporan-stats";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insidenData, zonaOperasiData, Insiden } from "@/lib/data";
import { Search, Plus, Filter } from "lucide-react";

export default function InsidenPage() {
  const [selectedInsiden, setSelectedInsiden] = useState<Insiden | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgensiFilter, setUrgensiFilter] = useState("all");
  const [zonaFilter, setZonaFilter] = useState("all");

  const filteredInsiden = insidenData.filter((insiden) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !insiden.judul.toLowerCase().includes(searchLower) &&
        !insiden.deskripsi.toLowerCase().includes(searchLower) &&
        !insiden.lokasi.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (statusFilter !== "all" && insiden.status !== statusFilter) {
      return false;
    }
    if (urgensiFilter !== "all" && insiden.urgensi !== urgensiFilter) {
      return false;
    }
    if (zonaFilter !== "all" && insiden.zonaOperasi !== zonaFilter) {
      return false;
    }
    return true;
  });

  const handleIncidentClick = (insiden: Insiden) => {
    setSelectedInsiden(insiden);
    setDetailOpen(true);
  };

  return (
    <DashboardLayout
      title="Laporan Insiden"
      subtitle="Kelola laporan insiden dan isu di seluruh zona operasi"
    >
      {/* Stats */}
      <div className="mb-6">
        <IncidentStats />
      </div>

      {/* Main Content */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari insiden..."
                  className="pl-9 bg-secondary border-border"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Buat Laporan
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Filter:
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-secondary border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="baru">Baru</SelectItem>
                  <SelectItem value="proses">Proses</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgensiFilter} onValueChange={setUrgensiFilter}>
                <SelectTrigger className="w-[140px] bg-secondary border-border">
                  <SelectValue placeholder="Urgensi" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Semua Urgensi</SelectItem>
                  <SelectItem value="tinggi">Tinggi</SelectItem>
                  <SelectItem value="sedang">Sedang</SelectItem>
                  <SelectItem value="rendah">Rendah</SelectItem>
                </SelectContent>
              </Select>

              <Select value={zonaFilter} onValueChange={setZonaFilter}>
                <SelectTrigger className="w-[160px] bg-secondary border-border">
                  <SelectValue placeholder="Zona" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Semua Zona</SelectItem>
                  {zonaOperasiData.map((zona) => (
                    <SelectItem key={zona.id} value={zona.id}>
                      {zona.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(statusFilter !== "all" ||
                urgensiFilter !== "all" ||
                zonaFilter !== "all" ||
                search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all");
                    setUrgensiFilter("all");
                    setZonaFilter("all");
                    setSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </div>

          {/* Incident List */}
          <div className="space-y-4">
            {filteredInsiden.length > 0 ? (
              filteredInsiden.map((insiden) => (
                <IncidentCard
                  key={insiden.id}
                  insiden={insiden}
                  onClick={() => handleIncidentClick(insiden)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Tidak ada insiden yang ditemukan
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <LaporanDetailModal
        insiden={selectedInsiden}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <CreateLaporanModal open={createOpen} onOpenChange={setCreateOpen} />
    </DashboardLayout>
  );
}
