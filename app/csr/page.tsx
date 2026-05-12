"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CSRCard } from "@/components/csr/csr-card";
import { CSRDetailModal } from "@/components/csr/csr-detail-modal";
import { CreateCSRModal } from "@/components/csr/create-csr-modal";
import { CSRStats } from "@/components/csr/csr-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, Heart } from "lucide-react";
import { csrData, type CSR } from "@/lib/data";

export default function CSRPage() {
  const [selectedCSR, setSelectedCSR] = useState<CSR | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [pulauFilter, setPulauFilter] = useState("all");

  const filteredCSR = csrData.filter((csr) => {
    const matchesSearch =
      csr.nama.toLowerCase().includes(search.toLowerCase()) ||
      csr.lokasi.kabupaten.toLowerCase().includes(search.toLowerCase()) ||
      csr.lokasi.provinsi.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || csr.status === statusFilter;
    const matchesKategori =
      kategoriFilter === "all" || csr.kategori === kategoriFilter;
    const matchesPulau =
      pulauFilter === "all" || csr.lokasi.pulau === pulauFilter;
    return matchesSearch && matchesStatus && matchesKategori && matchesPulau;
  });

  const uniquePulau = Array.from(new Set(csrData.map((c) => c.lokasi.pulau)));

  const handleCardClick = (csr: CSR) => {
    setSelectedCSR(csr);
    setDetailOpen(true);
  };

  return (
    <DashboardLayout
      title="Corporate Social Responsibility"
      subtitle="Kelola program CSR di seluruh zona operasi"
    >
      <div className="space-y-6">
        {/* Stats */}
        {/* <CSRStats /> */}

        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Daftar Program CSR
              </CardTitle>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambahkan CSR
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari program CSR..."
                  className="pl-10 bg-secondary border-border"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filter:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={kategoriFilter}
                  onValueChange={setKategoriFilter}
                >
                  <SelectTrigger className="w-[150px] bg-secondary border-border">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="infrastruktur">Infrastruktur</SelectItem>
                    <SelectItem value="pendidikan">Pendidikan</SelectItem>
                    <SelectItem value="lingkungan">Lingkungan</SelectItem>
                    <SelectItem value="ekonomi">Ekonomi</SelectItem>
                    <SelectItem value="sosial">Sosial</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={pulauFilter} onValueChange={setPulauFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border">
                    <SelectValue placeholder="Pulau" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Semua Pulau</SelectItem>
                    {uniquePulau.map((pulau) => (
                      <SelectItem key={pulau} value={pulau}>
                        {pulau}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSR Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCSR.map((csr) => (
            <CSRCard
              key={csr.id}
              csr={csr}
              onClick={() => handleCardClick(csr)}
            />
          ))}
        </div>

        {filteredCSR.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Tidak ada program CSR ditemukan
              </h3>
              <p className="text-sm text-muted-foreground">
                Coba ubah filter pencarian atau tambahkan program CSR baru.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <CSRDetailModal
        csr={selectedCSR}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <CreateCSRModal open={createOpen} onOpenChange={setCreateOpen} />
    </DashboardLayout>
  );
}
