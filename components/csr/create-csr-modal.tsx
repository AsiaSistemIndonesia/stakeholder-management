"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Heart,
  Loader2,
  CheckCircle2,
  X,
  Search,
  ChevronDown,
  MapPin,
  Trash2,
  AlertCircle,
  Users,
  Building2,
  GraduationCap,
  Leaf,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import {
  stakeholderData,
  kategoriColors,
  csrKategoriColors,
  type CSR,
} from "@/lib/data";

const MapPicker = dynamic(() => import("@/components/laporan/map-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] rounded-lg bg-secondary/50 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

const kategoriOptions: {
  value: CSR["kategori"];
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "infrastruktur",
    label: "Infrastruktur",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    value: "pendidikan",
    label: "Pendidikan",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    value: "lingkungan",
    label: "Lingkungan",
    icon: <Leaf className="h-4 w-4" />,
  },
  {
    value: "ekonomi",
    label: "Ekonomi",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    value: "sosial",
    label: "Sosial",
    icon: <HeartHandshake className="h-4 w-4" />,
  },
];

const pulauOptions = ["Sumatera", "Jawa", "Kalimantan", "Sulawesi", "Papua"];

interface CreateCSRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCSRModal({ open, onOpenChange }: CreateCSRModalProps) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState<CSR["kategori"] | "">("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [budget, setBudget] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [pulau, setPulau] = useState("");
  const [koordinat, setKoordinat] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>(
    [],
  );
  const [stakeholderSearch, setStakeholderSearch] = useState("");
  const [stakeholderDropdownOpen, setStakeholderDropdownOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setStakeholderDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setNama("");
    setDeskripsi("");
    setKategori("");
    setStatus("active");
    setBudget("");
    setKabupaten("");
    setKecamatan("");
    setProvinsi("");
    setPulau("");
    setKoordinat(null);
    setSelectedStakeholders([]);
    setStakeholderSearch("");
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    if (!nama.trim()) {
      setError("Nama program CSR wajib diisi.");
      return;
    }
    if (!kategori) {
      setError("Kategori wajib dipilih.");
      return;
    }
    if (!budget || isNaN(Number(budget.replace(/\D/g, "")))) {
      setError("Budget wajib diisi dengan angka yang valid.");
      return;
    }
    if (!pulau) {
      setError("Pulau wajib dipilih.");
      return;
    }
    if (!provinsi.trim()) {
      setError("Provinsi wajib diisi.");
      return;
    }
    if (!kabupaten.trim()) {
      setError("Kabupaten/Kota wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      setIsSuccess(false);
      onOpenChange(false);
    }
  };

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

  const formatBudgetInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-card border-border">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Program CSR Berhasil Ditambahkan
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Program CSR baru telah berhasil disimpan ke dalam sistem.
            </p>
            <Button
              onClick={handleClose}
              className="bg-primary hover:bg-primary/90"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Tambahkan Program CSR Baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {error && (
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/30"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground font-medium">
                Nama Program <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Contoh: Universitas Pertamina"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">
                Kategori <span className="text-destructive">*</span>
              </Label>
              <Select
                value={kategori}
                onValueChange={(v) => setKategori(v as CSR["kategori"])}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {kategoriOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <span style={{ color: csrKategoriColors[opt.value] }}>
                          {opt.icon}
                        </span>
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as "active" | "inactive")}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      Aktif
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                      Nonaktif
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground font-medium">
                Budget (IDR) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  Rp
                </span>
                <Input
                  placeholder="0"
                  value={budget}
                  onChange={(e) => setBudget(formatBudgetInput(e.target.value))}
                  className="bg-secondary border-border pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground font-medium">Deskripsi</Label>
              <Textarea
                placeholder="Deskripsi singkat program CSR..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="bg-secondary border-border min-h-[80px]"
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Lokasi
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Pulau <span className="text-destructive">*</span>
                </Label>
                <Select value={pulau} onValueChange={setPulau}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Pilih pulau" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {pulauOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Provinsi <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Contoh: Riau"
                  value={provinsi}
                  onChange={(e) => setProvinsi(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Kabupaten/Kota <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Contoh: Bengkalis"
                  value={kabupaten}
                  onChange={(e) => setKabupaten(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Kecamatan
                </Label>
                <Input
                  placeholder="Contoh: Mandau"
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            {/* Map Picker */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">
                Koordinat (Klik peta untuk menandai lokasi)
              </Label>
              <div className="rounded-lg overflow-hidden border border-border h-56">
                <MapPicker
                  koordinat={koordinat}
                  onKoordinatChange={setKoordinat}
                />
              </div>
              {koordinat && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-sm text-muted-foreground">
                    Lat: {koordinat.lat.toFixed(6)}, Lng:{" "}
                    {koordinat.lng.toFixed(6)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setKoordinat(null)}
                    className="h-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Stakeholder Multi-select */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Stakeholder Terkait
            </Label>

            {/* Selected stakeholders chips */}
            {selectedStakeholders.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-secondary/30">
                {selectedStakeholders.map((id) => {
                  const sh = stakeholderData.find((s) => s.id === id);
                  if (!sh) return null;
                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="gap-1 pr-1"
                      style={{
                        backgroundColor: `${kategoriColors[sh.kategori]}20`,
                        color: kategoriColors[sh.kategori],
                        borderColor: kategoriColors[sh.kategori],
                      }}
                    >
                      {sh.nama}
                      <button
                        type="button"
                        onClick={() => removeStakeholder(id)}
                        className="ml-1 rounded-full hover:bg-background/50 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setStakeholderDropdownOpen(!stakeholderDropdownOpen)
                }
                className="w-full justify-between bg-secondary border-border"
              >
                <span className="text-muted-foreground">
                  {selectedStakeholders.length > 0
                    ? `${selectedStakeholders.length} stakeholder dipilih`
                    : "Pilih stakeholder"}
                </span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>

              {stakeholderDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari stakeholder..."
                        value={stakeholderSearch}
                        onChange={(e) => setStakeholderSearch(e.target.value)}
                        className="pl-8 h-9 bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto p-1">
                    {filteredStakeholders.length > 0 ? (
                      filteredStakeholders.map((sh) => (
                        <div
                          key={sh.id}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/50 cursor-pointer"
                          onClick={() => toggleStakeholder(sh.id)}
                        >
                          <Checkbox
                            checked={selectedStakeholders.includes(sh.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {sh.nama}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {sh.jabatan}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="shrink-0 text-[10px]"
                            style={{
                              borderColor: kategoriColors[sh.kategori],
                              color: kategoriColors[sh.kategori],
                            }}
                          >
                            {sh.kategori}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Stakeholder tidak ditemukan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tambahkan stakeholder baru di menu{" "}
                          <span className="text-primary font-medium">
                            Stakeholder
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Jika stakeholder yang diinginkan tidak tersedia, silakan tambahkan
              terlebih dahulu di menu{" "}
              <span className="text-primary font-medium">Stakeholder</span>.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-border"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Simpan Program CSR
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
