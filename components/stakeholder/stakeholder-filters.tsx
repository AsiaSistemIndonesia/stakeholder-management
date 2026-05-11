"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { organisasiData, zonaOperasiData } from "@/lib/data";
import { Search, Plus, Download, Filter } from "lucide-react";

interface StakeholderFiltersProps {
  filters: {
    kategori: string;
    organisasi: string;
    zona: string;
    search: string;
  };
  onFiltersChange: (filters: {
    kategori: string;
    organisasi: string;
    zona: string;
    search: string;
  }) => void;
}

const kategoriOptions = [
  { value: "all", label: "Semua Kategori" },
  { value: "customer", label: "Customer" },
  { value: "pemerintah", label: "Pemerintah" },
  { value: "komunitas", label: "Komunitas" },
  { value: "mitra", label: "Mitra" },
  { value: "internal", label: "Internal" },
];

export function StakeholderFilters({
  filters,
  onFiltersChange,
}: StakeholderFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, jabatan, email..."
            className="pl-9 bg-secondary border-border"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Stakeholder
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filter:
        </div>

        <Select
          value={filters.kategori}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, kategori: value })
          }
        >
          <SelectTrigger className="w-[160px] bg-secondary border-border">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {kategoriOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.organisasi}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, organisasi: value })
          }
        >
          <SelectTrigger className="w-[200px] bg-secondary border-border">
            <SelectValue placeholder="Organisasi" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Semua Organisasi</SelectItem>
            {organisasiData.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.zona}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, zona: value })
          }
        >
          <SelectTrigger className="w-[180px] bg-secondary border-border">
            <SelectValue placeholder="Zona Operasi" />
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

        {(filters.kategori !== "all" ||
          filters.organisasi !== "all" ||
          filters.zona !== "all" ||
          filters.search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFiltersChange({
                kategori: "all",
                organisasi: "all",
                zona: "all",
                search: "",
              })
            }
            className="text-muted-foreground hover:text-foreground"
          >
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}
