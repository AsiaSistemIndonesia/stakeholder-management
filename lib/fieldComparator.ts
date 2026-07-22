import { getOrganisasiById } from "./data";

export interface FieldDiff {
  fieldName: string;
  oldValue: string;
  newValue: string;
}

const FIELD_LABELS: Record<string, string> = {
  nama: "Nama / Judul",
  jabatan: "Jabatan",
  organisasiIds: "Organisasi Terkait",
  organisasiId: "Organisasi Utama",
  kategori: "Kategori",
  email: "Alamat Email",
  telepon: "Nomor Telepon",
  alamat: "Alamat Kantor",
  foto: "Foto Profil",
  dokumen: "Dokumen Terlampir",
  status: "Status",
  zonaOperasi: "Zona Operasi",
  alumniPendidikan: "Alumni Pendidikan",
  jurusanPendidikan: "Jurusan Pendidikan",
  catatan: "Catatan",
  tipe: "Tipe Organisasi",
  deskripsi: "Deskripsi",
  parentId: "Induk Organisasi",
  visibleMenus: "Visibilitas Menu",
  dashboardWidgets: "Widget Dashboard",
};

export function compareFields(oldObj: Record<string, any>, newObj: Record<string, any>): FieldDiff[] {
  const diffs: FieldDiff[] = [];
  if (!oldObj || !newObj) return diffs;

  const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));

  for (const key of allKeys) {
    if (["id", "createdAt", "updatedAt", "koordinat", "history"].includes(key)) continue;

    const oldVal = oldObj[key];
    const newVal = newObj[key];

    // Array comparison for organisasiIds
    if (key === "organisasiIds") {
      const oldArr: string[] = Array.isArray(oldVal) ? oldVal : [];
      const newArr: string[] = Array.isArray(newVal) ? newVal : [];

      if (JSON.stringify(oldArr.sort()) !== JSON.stringify(newArr.sort())) {
        const getNames = (ids: string[]) =>
          ids.map((id) => getOrganisasiById(id)?.nama || id).join(", ") || "(Kosong)";
        diffs.push({
          fieldName: FIELD_LABELS[key] || key,
          oldValue: getNames(oldArr),
          newValue: getNames(newArr),
        });
      }
      continue;
    }

    // Array comparison for dokumen
    if (key === "dokumen") {
      const oldDocs = Array.isArray(oldVal) ? oldVal.map((d) => d.nama).join(", ") : "(Kosong)";
      const newDocs = Array.isArray(newVal) ? newVal.map((d) => d.nama).join(", ") : "(Kosong)";
      if (oldDocs !== newDocs) {
        diffs.push({
          fieldName: FIELD_LABELS[key] || key,
          oldValue: oldDocs || "(Kosong)",
          newValue: newDocs || "(Kosong)",
        });
      }
      continue;
    }

    // Generic array comparison
    if (Array.isArray(oldVal) || Array.isArray(newVal)) {
      const oldStr = Array.isArray(oldVal) ? oldVal.join(", ") : String(oldVal || "");
      const newStr = Array.isArray(newVal) ? newVal.join(", ") : String(newVal || "");
      if (oldStr !== newStr) {
        diffs.push({
          fieldName: FIELD_LABELS[key] || key,
          oldValue: oldStr || "(Kosong)",
          newValue: newStr || "(Kosong)",
        });
      }
      continue;
    }

    // Photo comparison
    if (key === "foto") {
      const oldPhotoStr = oldVal ? "Ada Foto Profil" : "Tanpa Foto";
      const newPhotoStr = newVal ? "Ada Foto Profil (Diperbarui)" : "Tanpa Foto";
      if (oldVal !== newVal) {
        diffs.push({
          fieldName: FIELD_LABELS[key] || key,
          oldValue: oldPhotoStr,
          newValue: newPhotoStr,
        });
      }
      continue;
    }

    // Standard scalar comparison
    const strOld = oldVal !== undefined && oldVal !== null ? String(oldVal) : "";
    const strNew = newVal !== undefined && newVal !== null ? String(newVal) : "";

    if (strOld !== strNew) {
      diffs.push({
        fieldName: FIELD_LABELS[key] || key,
        oldValue: strOld || "(Kosong)",
        newValue: strNew || "(Kosong)",
      });
    }
  }

  return diffs;
}
