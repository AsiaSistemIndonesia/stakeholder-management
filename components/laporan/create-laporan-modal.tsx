"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  zonaOperasiData,
  stakeholderData,
  getZonaFromCoordinat,
} from "@/lib/data";
import {
  AlertTriangle,
  MapPin,
  Upload,
  X,
  CheckCircle2,
  Search,
  Users,
  ChevronDown,
  Loader2,
  History,
} from "lucide-react";
import { useTheme } from "next-themes";

// Dynamically import Leaflet components to avoid SSR issues
const MapPicker = dynamic(() => import("./map-picker"), { ssr: false });

interface CreateLaporanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLaporanModal({
  open,
  onOpenChange,
}: CreateLaporanModalProps) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [urgensi, setUrgensi] = useState<string>("");
  const [lokasi, setLokasi] = useState("");
  const [zonaOperasi, setZonaOperasi] = useState("");
  const [lampiran, setLampiran] = useState<string[]>([]);
  const [koordinat, setKoordinat] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [zonaAutoDetected, setZonaAutoDetected] = useState(false);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>(
    [],
  );
  const [stakeholderSearch, setStakeholderSearch] = useState("");
  const [stakeholderDropdownOpen, setStakeholderDropdownOpen] = useState(false);
  const [pesanMilestone, setPesanMilestone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-detect zona when map pin is placed
  useEffect(() => {
    if (koordinat) {
      const detectedZona = getZonaFromCoordinat(koordinat.lat, koordinat.lng);
      if (detectedZona) {
        setZonaOperasi(detectedZona);
        setZonaAutoDetected(true);
      } else {
        setZonaAutoDetected(false);
      }
    } else {
      setZonaAutoDetected(false);
    }
  }, [koordinat]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setStakeholderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredStakeholders = stakeholderData.filter(
    (sh) =>
      sh.nama.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
      sh.jabatan.toLowerCase().includes(stakeholderSearch.toLowerCase()),
  );

  const toggleStakeholder = (id: string) => {
    setSelectedStakeholders((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const removeStakeholder = (id: string) => {
    setSelectedStakeholders((prev) => prev.filter((s) => s !== id));
  };

  const getStakeholderById = (id: string) =>
    stakeholderData.find((sh) => sh.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
        onOpenChange(false);
      }, 1500);
    }, 1000);
  };

  const resetForm = () => {
    setJudul("");
    setDeskripsi("");
    setUrgensi("");
    setLokasi("");
    setZonaOperasi("");
    setZonaAutoDetected(false);
    setLampiran([]);
    setKoordinat(null);
    setSelectedStakeholders([]);
    setStakeholderSearch("");
    setPesanMilestone("");
  };

  const handleFileUpload = () => {
    const fakeFiles = [`dokumen-${Date.now()}.pdf`];
    setLampiran([...lampiran, ...fakeFiles]);
  };

  const removeFile = (index: number) => {
    setLampiran(lampiran.filter((_, i) => i !== index));
  };

  const isFormValid = judul && deskripsi && urgensi && lokasi && zonaOperasi;

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-card border-border">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="p-4 rounded-full bg-success/20">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Laporan Berhasil Dibuat
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Laporan telah berhasil disimpan dan akan segera ditindaklanjuti.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Buat Laporan Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Judul */}
          <div className="space-y-2">
            <Label htmlFor="judul" className="text-foreground font-medium">
              Judul Laporan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="judul"
              placeholder="Masukkan judul laporan..."
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-foreground font-medium">
              Deskripsi <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="deskripsi"
              placeholder="Jelaskan detail insiden yang terjadi..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="bg-secondary border-border min-h-[100px]"
            />
          </div>

          {/* Urgensi & Zona */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">
                Tingkat Urgensi <span className="text-destructive">*</span>
              </Label>
              <Select value={urgensi} onValueChange={setUrgensi}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Pilih urgensi" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="tinggi">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive" />
                      Tinggi
                    </div>
                  </SelectItem>
                  <SelectItem value="sedang">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      Sedang
                    </div>
                  </SelectItem>
                  <SelectItem value="rendah">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      Rendah
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium flex items-center gap-2">
                Zona Operasi <span className="text-destructive">*</span>
                {zonaAutoDetected && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 bg-success/15 text-success border-success/30"
                  >
                    Terdeteksi otomatis
                  </Badge>
                )}
              </Label>
              <Select
                value={zonaOperasi}
                onValueChange={(val) => {
                  setZonaOperasi(val);
                  setZonaAutoDetected(false);
                }}
              >
                <SelectTrigger
                  className={`bg-secondary border-border transition-colors ${
                    zonaAutoDetected
                      ? "border-success/50 ring-1 ring-success/30"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Pilih zona atau tandai peta" />
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

          {/* Lokasi teks */}
          <div className="space-y-2">
            <Label htmlFor="lokasi" className="text-foreground font-medium">
              Nama Lokasi <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="lokasi"
                placeholder="Contoh: Rig A-15, Duri"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="bg-secondary border-border pl-9"
              />
            </div>
          </div>

          {/* Peta koordinat */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              Koordinat Lokasi
            </Label>
            <p className="text-xs text-muted-foreground">
              Klik pada peta untuk menentukan titik lokasi kejadian.
            </p>
            <div className="rounded-lg overflow-hidden border border-border h-56">
              <MapPicker
                koordinat={koordinat}
                onKoordinatChange={setKoordinat}
              />
            </div>
            {koordinat && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/60 rounded-md px-3 py-2">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span>
                  Lat:{" "}
                  <span className="text-foreground font-mono">
                    {koordinat.lat.toFixed(5)}
                  </span>
                  &nbsp;&nbsp;Lng:{" "}
                  <span className="text-foreground font-mono">
                    {koordinat.lng.toFixed(5)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setKoordinat(null)}
                  className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Hapus koordinat"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Stakeholder Terkait */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Stakeholder Terkait
            </Label>

            {/* Selected chips */}
            {selectedStakeholders.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedStakeholders.map((id) => {
                  const sh = getStakeholderById(id);
                  if (!sh) return null;
                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="flex items-center gap-1.5 pr-1 py-1"
                    >
                      <span className="text-xs">{sh.nama}</span>
                      <button
                        type="button"
                        onClick={() => removeStakeholder(id)}
                        className="rounded-sm hover:text-destructive transition-colors"
                        aria-label={`Hapus ${sh.nama}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Dropdown trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setStakeholderDropdownOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-secondary text-sm text-muted-foreground hover:bg-secondary/80 transition-colors"
              >
                <span>
                  {selectedStakeholders.length > 0
                    ? `${selectedStakeholders.length} stakeholder dipilih`
                    : "Pilih stakeholder..."}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </button>

              {stakeholderDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
                  {/* Search inside dropdown */}
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Cari nama atau jabatan..."
                        value={stakeholderSearch}
                        onChange={(e) => setStakeholderSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-md outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Options list */}
                  <ul className="max-h-44 overflow-y-auto py-1">
                    {filteredStakeholders.length === 0 ? (
                      <li className="px-3 py-3 text-sm text-muted-foreground text-center">
                        Tidak ada hasil
                      </li>
                    ) : (
                      filteredStakeholders.map((sh) => {
                        const isSelected = selectedStakeholders.includes(sh.id);
                        return (
                          <li key={sh.id}>
                            <button
                              type="button"
                              onClick={() => toggleStakeholder(sh.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-secondary transition-colors ${
                                isSelected ? "bg-primary/10" : ""
                              }`}
                            >
                              {/* Checkbox indicator */}
                              <span
                                className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-border"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="h-2.5 w-2.5 text-primary-foreground"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                  >
                                    <path
                                      d="M1.5 5.5l2.5 2.5 4.5-5"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </span>
                              <div className="min-w-0">
                                <p className="text-foreground font-medium truncate">
                                  {sh.nama}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {sh.jabatan}
                                </p>
                              </div>
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Pesan Milestone Pertama */}
          <div className="space-y-2">
            <Label
              htmlFor="milestone"
              className="text-foreground font-medium flex items-center gap-2"
            >
              <History className="h-4 w-4 text-muted-foreground" />
              Catatan Awal Timeline
            </Label>
            <Textarea
              id="milestone"
              placeholder="Tuliskan catatan atau tindakan pertama yang sudah dilakukan terkait laporan ini..."
              value={pesanMilestone}
              onChange={(e) => setPesanMilestone(e.target.value)}
              className="bg-secondary border-border min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              Opsional. Akan menjadi entri pertama pada Timeline Insiden.
            </p>
          </div>

          {/* Lampiran */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Lampiran</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={handleFileUpload}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleFileUpload()}
            >
              <Upload className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop atau{" "}
                <span className="text-primary font-medium">
                  klik untuk pilih file
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Format: JPG, PNG, PDF (Maks. 10MB)
              </p>
            </div>

            {lampiran.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {lampiran.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm"
                  >
                    <span className="text-foreground">{file}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Laporan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
