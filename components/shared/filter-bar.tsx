"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Organisasi, zonaOperasiData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export interface FilterState {
  kategori: string;
  organisasi: string;
  zona: string;
  status: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  organisasiList: Organisasi[];
  showStatus?: boolean;
}

export function FilterBar({
  filters,
  onFilterChange,
  organisasiList,
  showStatus = true,
}: FilterBarProps) {
  const handleSelect = (field: keyof FilterState, val: string) => {
    onFilterChange({
      ...filters,
      [field]: val,
    });
  };

  const handleReset = () => {
    onFilterChange({
      kategori: "all",
      organisasi: "all",
      zona: "all",
      status: "all",
    });
  };

  const isFiltered =
    filters.kategori !== "all" ||
    filters.organisasi !== "all" ||
    filters.zona !== "all" ||
    filters.status !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category Filter */}
      <Select
        value={filters.kategori}
        onValueChange={(val) => handleSelect("kategori", val)}
      >
        <SelectTrigger className="w-[150px] bg-secondary border-border text-xs">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border text-xs">
          <SelectItem value="all">Semua Kategori</SelectItem>
          <SelectItem value="pemerintah">Pemerintah</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="komunitas">Komunitas</SelectItem>
          <SelectItem value="mitra">Mitra</SelectItem>
          <SelectItem value="internal">Internal</SelectItem>
        </SelectContent>
      </Select>

      {/* Organization Filter */}
      <Select
        value={filters.organisasi}
        onValueChange={(val) => handleSelect("organisasi", val)}
      >
        <SelectTrigger className="w-[180px] bg-secondary border-border text-xs">
          <SelectValue placeholder="Semua Organisasi" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border text-xs max-h-60">
          <SelectItem value="all">Semua Organisasi</SelectItem>
          {organisasiList.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.nama}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Zone Filter */}
      <Select
        value={filters.zona}
        onValueChange={(val) => handleSelect("zona", val)}
      >
        <SelectTrigger className="w-[150px] bg-secondary border-border text-xs">
          <SelectValue placeholder="Semua Zona" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border text-xs">
          <SelectItem value="all">Semua Zona</SelectItem>
          {zonaOperasiData.map((zona) => (
            <SelectItem key={zona.id} value={zona.id}>
              {zona.nama}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      {showStatus && (
        <Select
          value={filters.status}
          onValueChange={(val) => handleSelect("status", val)}
        >
          <SelectTrigger className="w-[130px] bg-secondary border-border text-xs">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-xs">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="non-aktif">Non-Aktif</SelectItem>
          </SelectContent>
        </Select>
      )}

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-muted-foreground hover:text-foreground h-9 px-2"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Reset Filter
        </Button>
      )}
    </div>
  );
}
