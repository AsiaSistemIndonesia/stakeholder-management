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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Stakeholder,
  getZonaById,
  getOrganisasiListByIds,
  kategoriColors,
} from "@/lib/data";
import { useStakeholderContext } from "@/lib/stakeholder-context";
import { Mail, Phone, Building2 } from "lucide-react";
import { ActionMenu } from "@/components/shared/action-menu";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { StakeholderFormModal } from "./stakeholder-form-modal";

import { usePermissions } from "@/hooks/usePermissions";

interface StakeholderTableProps {
  filters?: {
    kategori?: string;
    organisasi?: string;
    zona?: string;
    status?: string;
    search?: string;
  };
}

export function StakeholderTable({ filters }: StakeholderTableProps) {
  const { stakeholders, deleteStakeholder, organisasiList } = useStakeholderContext();
  const { hasCrudPermission } = usePermissions();

  const canUpdate = hasCrudPermission("stakeholder", "update");
  const canDelete = hasCrudPermission("stakeholder", "delete");

  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("view");
  const [modalOpen, setModalOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Stakeholder | null>(null);

  const filteredData = stakeholders.filter((sh) => {
    if (filters?.kategori && filters.kategori !== "all" && sh.kategori !== filters.kategori) {
      return false;
    }
    if (filters?.status && filters.status !== "all" && (sh.status || "aktif") !== filters.status) {
      return false;
    }
    if (filters?.organisasi && filters.organisasi !== "all") {
      const hasOrg =
        sh.organisasiIds?.includes(filters.organisasi) ||
        sh.organisasiId === filters.organisasi;
      if (!hasOrg) return false;
    }
    if (filters?.zona && filters.zona !== "all" && sh.zonaOperasi !== filters.zona) {
      return false;
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      const matchName = sh.nama.toLowerCase().includes(query);
      const matchPosition = sh.jabatan.toLowerCase().includes(query);
      const matchCategory = sh.kategori.toLowerCase().includes(query);
      const matchEmail = sh.email.toLowerCase().includes(query);

      const orgs = getOrganisasiListByIds(
        sh.organisasiIds?.length ? sh.organisasiIds : sh.organisasiId ? [sh.organisasiId] : []
      );
      const matchOrg = orgs.some((o) => o.nama.toLowerCase().includes(query));

      return matchName || matchPosition || matchCategory || matchEmail || matchOrg;
    }
    return true;
  });

  const handleView = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteTrigger = (stakeholder: Stakeholder) => {
    setToDelete(stakeholder);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (toDelete) {
      deleteStakeholder(toDelete.id);
      setToDelete(null);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden bg-card">
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
            {filteredData.length > 0 ? (
              filteredData.map((stakeholder) => {
                const orgIds =
                  stakeholder.organisasiIds && stakeholder.organisasiIds.length > 0
                    ? stakeholder.organisasiIds
                    : stakeholder.organisasiId
                    ? [stakeholder.organisasiId]
                    : [];
                const assignedOrgs = organisasiList.filter((o) => orgIds.includes(o.id));
                const zona = getZonaById(stakeholder.zonaOperasi);
                const initials = stakeholder.nama
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);

                return (
                  <TableRow key={stakeholder.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          {stakeholder.foto && (
                            <AvatarImage src={stakeholder.foto} alt={stakeholder.nama} />
                          )}
                          <AvatarFallback
                            className="text-xs font-medium"
                            style={{
                              backgroundColor: kategoriColors[stakeholder.kategori],
                              color: "white",
                            }}
                          >
                            {initials}
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
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {assignedOrgs.length > 0 ? (
                          assignedOrgs.map((org) => (
                            <Badge
                              key={org.id}
                              variant="secondary"
                              className="bg-secondary/80 text-foreground border-border text-[11px] font-normal px-2 py-0.5"
                            >
                              <Building2 className="h-3 w-3 mr-1 text-primary shrink-0" />
                              {org.nama}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: kategoriColors[stakeholder.kategori],
                          color: kategoriColors[stakeholder.kategori],
                        }}
                        className="capitalize"
                      >
                        {stakeholder.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {zona?.nama || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={stakeholder.email}
                        >
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={stakeholder.telepon}
                        >
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActionMenu
                        onView={() => handleView(stakeholder)}
                        onEdit={canUpdate ? () => handleEdit(stakeholder) : undefined}
                        onDelete={canDelete ? () => handleDeleteTrigger(stakeholder) : undefined}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Tidak ada data stakeholder yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <StakeholderFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        stakeholder={selectedStakeholder}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        itemTitle={toDelete?.nama}
      />
    </>
  );
}
