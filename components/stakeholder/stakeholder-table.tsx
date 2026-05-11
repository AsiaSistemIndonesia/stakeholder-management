"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Stakeholder,
  stakeholderData,
  getOrganisasiById,
  getZonaById,
  kategoriColors,
} from "@/lib/data";
import { MoreHorizontal, Eye, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { StakeholderDetailModal } from "./stakeholder-detail-modal";

interface StakeholderTableProps {
  filters?: {
    kategori?: string;
    organisasi?: string;
    zona?: string;
    search?: string;
  };
}

export function StakeholderTable({ filters }: StakeholderTableProps) {
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredData = stakeholderData.filter((sh) => {
    if (filters?.kategori && filters.kategori !== "all" && sh.kategori !== filters.kategori) {
      return false;
    }
    if (filters?.organisasi && filters.organisasi !== "all" && sh.organisasiId !== filters.organisasi) {
      return false;
    }
    if (filters?.zona && filters.zona !== "all" && sh.zonaOperasi !== filters.zona) {
      return false;
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        sh.nama.toLowerCase().includes(searchLower) ||
        sh.jabatan.toLowerCase().includes(searchLower) ||
        sh.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleView = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setDetailOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-muted-foreground font-medium">Nama</TableHead>
              <TableHead className="text-muted-foreground font-medium">Jabatan</TableHead>
              <TableHead className="text-muted-foreground font-medium">Organisasi</TableHead>
              <TableHead className="text-muted-foreground font-medium">Kategori</TableHead>
              <TableHead className="text-muted-foreground font-medium">Zona</TableHead>
              <TableHead className="text-muted-foreground font-medium">Kontak</TableHead>
              <TableHead className="text-muted-foreground font-medium w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((stakeholder) => {
              const organisasi = getOrganisasiById(stakeholder.organisasiId);
              const zona = getZonaById(stakeholder.zonaOperasi);

              return (
                <TableRow key={stakeholder.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          className="text-xs font-medium"
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
                      <div>
                        <p className="font-medium text-foreground">
                          {stakeholder.nama}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stakeholder.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {stakeholder.jabatan}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {organisasi?.nama || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: kategoriColors[stakeholder.kategori],
                        color: kategoriColors[stakeholder.kategori],
                      }}
                    >
                      {stakeholder.kategori}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {zona?.nama || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title={stakeholder.email}
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title={stakeholder.telepon}
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem
                          onClick={() => handleView(stakeholder)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <StakeholderDetailModal
        stakeholder={selectedStakeholder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
