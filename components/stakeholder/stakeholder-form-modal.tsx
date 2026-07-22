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
import { Stakeholder, StakeholderDocument, zonaOperasiData } from "@/lib/data";
import { useStakeholderContext } from "@/lib/stakeholder-context";
import { MultiSelectOrganizations } from "@/components/shared/multi-select-organizations";
import { UploadPhoto } from "@/components/shared/upload-photo";
import { UploadDocuments } from "@/components/shared/upload-documents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, GraduationCap, FileText, Camera, Paperclip } from "lucide-react";

interface StakeholderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view";
  stakeholder?: Stakeholder | null;
}

export function StakeholderFormModal({
  open,
  onOpenChange,
  mode,
  stakeholder,
}: StakeholderFormModalProps) {
  const { addStakeholder, updateStakeholder, organisasiList } = useStakeholderContext();

  const isView = mode === "view";

  const [formData, setFormData] = useState<Partial<Stakeholder>>({
    nama: "",
    jabatan: "",
    kategori: "pemerintah",
    organisasiIds: [],
    zonaOperasi: "zona-1",
    email: "",
    telepon: "",
    alamat: "",
    foto: "",
    dokumen: [],
    status: "aktif",
    alumniPendidikan: "",
    jurusanPendidikan: "",
    catatan: "",
    koordinat: { lat: -6.2088, lng: 106.8456 },
  });

  useEffect(() => {
    if (stakeholder && (mode === "edit" || mode === "view")) {
      setFormData({
        ...stakeholder,
        organisasiIds:
          stakeholder.organisasiIds && stakeholder.organisasiIds.length > 0
            ? stakeholder.organisasiIds
            : stakeholder.organisasiId
            ? [stakeholder.organisasiId]
            : [],
        dokumen: stakeholder.dokumen || [],
        status: stakeholder.status || "aktif",
      });
    } else if (mode === "add") {
      setFormData({
        nama: "",
        jabatan: "",
        kategori: "pemerintah",
        organisasiIds: [],
        zonaOperasi: "zona-1",
        email: "",
        telepon: "",
        alamat: "",
        foto: "",
        dokumen: [],
        status: "aktif",
        alumniPendidikan: "",
        jurusanPendidikan: "",
        catatan: "",
        koordinat: { lat: -6.2088, lng: 106.8456 },
      });
    }
  }, [stakeholder, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (!formData.nama?.trim()) {
      alert("Nama Stakeholder wajib diisi.");
      return;
    }

    if (mode === "add") {
      addStakeholder(formData as Omit<Stakeholder, "id" | "createdAt" | "updatedAt">);
    } else if (mode === "edit" && stakeholder) {
      updateStakeholder(stakeholder.id, formData);
    }

    onOpenChange(false);
  };

  const title =
    mode === "add"
      ? "Tambah Stakeholder"
      : mode === "edit"
      ? "Edit Stakeholder"
      : "Detail Stakeholder";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto overflow-x-hidden w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 w-full overflow-x-hidden">
          {/* Profile Photo Section */}
          <div className="p-4 rounded-lg bg-secondary/20 border border-border w-full overflow-x-hidden">
            <Label className="text-xs font-semibold text-muted-foreground mb-2 block flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-primary" />
              Foto Profil Stakeholder
            </Label>
            <UploadPhoto
              value={formData.foto}
              onChange={(url) => setFormData((prev) => ({ ...prev, foto: url }))}
              readOnly={isView}
              nameFallback={formData.nama || "ST"}
            />
          </div>

          <Tabs defaultValue="profil" className="w-full overflow-x-hidden">
            <TabsList className="bg-secondary border border-border w-full flex flex-wrap h-auto p-1 gap-1 justify-start overflow-x-hidden">
              <TabsTrigger value="profil" className="text-xs">
                <User className="h-3.5 w-3.5 mr-1.5" />
                Informasi Utama
              </TabsTrigger>
              <TabsTrigger value="organisasi" className="text-xs">
                <Building2 className="h-3.5 w-3.5 mr-1.5" />
                Organisasi & Wilayah
              </TabsTrigger>
              <TabsTrigger value="pendidikan" className="text-xs">
                <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                Pendidikan & Catatan
              </TabsTrigger>
              <TabsTrigger value="dokumen" className="text-xs">
                <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                Dokumen Terlampir ({formData.dokumen?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Informasi Utama */}
            <TabsContent value="profil" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Nama Lengkap *</Label>
                  <Input
                    disabled={isView}
                    value={formData.nama || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nama: e.target.value }))
                    }
                    placeholder="Contoh: Dr. Budi Santoso"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Jabatan</Label>
                  <Input
                    disabled={isView}
                    value={formData.jabatan || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, jabatan: e.target.value }))
                    }
                    placeholder="Contoh: Kepala Dinas"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Email</Label>
                  <Input
                    type="email"
                    disabled={isView}
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="budi.santoso@esdm.go.id"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Telepon / WhatsApp</Label>
                  <Input
                    disabled={isView}
                    value={formData.telepon || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, telepon: e.target.value }))
                    }
                    placeholder="+628123456789"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs text-foreground">Alamat</Label>
                  <Input
                    disabled={isView}
                    value={formData.alamat || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, alamat: e.target.value }))
                    }
                    placeholder="Alamat kantor atau lokasi operasi..."
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Organisasi & Wilayah */}
            <TabsContent value="organisasi" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">
                    Organisasi (Bisa Pilih Lebih Dari Satu)
                  </Label>
                  <MultiSelectOrganizations
                    organisasiList={organisasiList}
                    selectedIds={formData.organisasiIds || []}
                    onChange={(ids) =>
                      setFormData((prev) => ({ ...prev, organisasiIds: ids }))
                    }
                    readOnly={isView}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">Kategori</Label>
                    <Select
                      disabled={isView}
                      value={formData.kategori}
                      onValueChange={(val: any) =>
                        setFormData((prev) => ({ ...prev, kategori: val }))
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="pemerintah">Pemerintah</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="komunitas">Komunitas</SelectItem>
                        <SelectItem value="mitra">Mitra</SelectItem>
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

                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">Status</Label>
                    <Select
                      disabled={isView}
                      value={formData.status}
                      onValueChange={(val: any) =>
                        setFormData((prev) => ({ ...prev, status: val }))
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="non-aktif">Non-Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Pendidikan & Catatan */}
            <TabsContent value="pendidikan" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Alumni Pendidikan</Label>
                  <Input
                    disabled={isView}
                    value={formData.alumniPendidikan || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        alumniPendidikan: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Institut Teknologi Bandung"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Jurusan Pendidikan</Label>
                  <Input
                    disabled={isView}
                    value={formData.jurusanPendidikan || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        jurusanPendidikan: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Teknik Perminyakan"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs text-foreground">Catatan Tambahan</Label>
                  <Textarea
                    disabled={isView}
                    value={formData.catatan || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, catatan: e.target.value }))
                    }
                    placeholder="Catatan mengenai perizinan, riwayat komunikasi, dll..."
                    className="bg-secondary border-border min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Dokumen Terlampir */}
            <TabsContent value="dokumen" className="space-y-4 pt-4">
              <UploadDocuments
                documents={formData.dokumen || []}
                onChange={(docs) =>
                  setFormData((prev) => ({ ...prev, dokumen: docs }))
                }
                readOnly={isView}
              />
            </TabsContent>
          </Tabs>

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
                {mode === "add" ? "Simpan Stakeholder" : "Simpan Perubahan"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
