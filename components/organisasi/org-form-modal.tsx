"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Organisasi, zonaOperasiData } from "@/lib/data";
import { useStakeholderContext } from "@/lib/stakeholder-context";

interface OrgFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view";
  organisasi?: Organisasi | null;
}

export function OrgFormModal({
  open,
  onOpenChange,
  mode,
  organisasi,
}: OrgFormModalProps) {
  const { addOrganisasi, updateOrganisasi, organisasiList } = useStakeholderContext();

  const isView = mode === "view";

  const [formData, setFormData] = useState<Partial<Organisasi>>({
    nama: "",
    tipe: "pemerintah",
    parentId: undefined,
    alamat: "",
    deskripsi: "",
    zonaOperasi: "zona-1",
    koordinat: { lat: -6.2088, lng: 106.8456 },
  });

  useEffect(() => {
    if (organisasi && (mode === "edit" || mode === "view")) {
      setFormData({ ...organisasi });
    } else if (mode === "add") {
      setFormData({
        nama: "",
        tipe: "pemerintah",
        parentId: undefined,
        alamat: "",
        deskripsi: "",
        zonaOperasi: "zona-1",
        koordinat: { lat: -6.2088, lng: 106.8456 },
      });
    }
  }, [organisasi, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (!formData.nama?.trim()) {
      alert("Nama Organisasi wajib diisi.");
      return;
    }

    if (mode === "add") {
      addOrganisasi(formData as Omit<Organisasi, "id">);
    } else if (mode === "edit" && organisasi) {
      updateOrganisasi(organisasi.id, formData);
    }

    onOpenChange(false);
  };

  const title =
    mode === "add"
      ? "Tambah Organisasi"
      : mode === "edit"
      ? "Edit Organisasi"
      : "Detail Organisasi";

  const availableParents = organisasiList.filter(
    (o) => !organisasi || o.id !== organisasi.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border-border max-h-[90vh] overflow-y-auto overflow-x-hidden w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 w-full overflow-x-hidden">
          <div className="space-y-2">
            <Label className="text-xs text-foreground">Nama Organisasi *</Label>
            <Input
              disabled={isView}
              value={formData.nama || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nama: e.target.value }))
              }
              placeholder="Contoh: PT Medco Energi"
              className="bg-secondary border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-foreground">Tipe Organisasi</Label>
              <Select
                disabled={isView}
                value={formData.tipe}
                onValueChange={(val: any) =>
                  setFormData((prev) => ({ ...prev, tipe: val }))
                }
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="pemerintah">Pemerintah</SelectItem>
                  <SelectItem value="swasta">Swasta</SelectItem>
                  <SelectItem value="bumn">BUMN</SelectItem>
                  <SelectItem value="komunitas">Komunitas</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-foreground">Zona Operasi</Label>
              <Select
                disabled={isView}
                value={formData.zonaOperasi}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, zonaOperasi: val }))
                }
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {zonaOperasiData.map((zona) => (
                    <SelectItem key={zona.id} value={zona.id}>
                      {zona.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-foreground">Induk Organisasi (Opsional)</Label>
            <Select
              disabled={isView}
              value={formData.parentId || "none"}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  parentId: val === "none" ? undefined : val,
                }))
              }
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Tanpa Induk (Mandiri)" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border max-h-52">
                <SelectItem value="none">Tanpa Induk (Mandiri)</SelectItem>
                {availableParents.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-foreground">Alamat Kantor</Label>
            <Input
              disabled={isView}
              value={formData.alamat || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, alamat: e.target.value }))
              }
              placeholder="Jl. Jenderal Sudirman No. 1, Jakarta"
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-foreground">Deskripsi</Label>
            <Textarea
              disabled={isView}
              value={formData.deskripsi || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))
              }
              placeholder="Deskripsi singkat peran dan bidang aktivitas organisasi..."
              className="bg-secondary border-border min-h-[90px]"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              {isView ? "Tutup" : "Batal"}
            </Button>
            {!isView && (
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {mode === "add" ? "Simpan Organisasi" : "Simpan Perubahan"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
