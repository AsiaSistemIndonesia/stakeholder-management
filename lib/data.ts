// Stakeholder Management Platform - Hardcoded Data for POC

export interface Stakeholder {
  id: string;
  nama: string;
  jabatan: string;
  organisasiId: string;
  fungsiId?: string;
  kategori: "customer" | "pemerintah" | "komunitas" | "mitra" | "internal";
  email: string;
  telepon: string;
  alamat: string;
  foto: string;
  zonaOperasi: string;
  alumniPendidikan?: string;
  jurusanPendidikan?: string;
  catatan?: string;
  koordinat: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

export interface Organisasi {
  id: string;
  nama: string;
  tipe: "pemerintah" | "swasta" | "bumn" | "komunitas" | "internal";
  parentId?: string;
  alamat: string;
  deskripsi: string;
  logo?: string;
  zonaOperasi: string;
  koordinat: { lat: number; lng: number };
}

export interface ZonaOperasi {
  id: string;
  nama: string;
  deskripsi: string;
  koordinat: { lat: number; lng: number };
  batasWilayah: { lat: number; lng: number }[];
  warna: string;
}

export interface TimelineItem {
  id: string;
  pesan: string;
  tanggal: string;
  updaterId: string;
  updaterNama: string;
}

export interface Insiden {
  id: string;
  judul: string;
  deskripsi: string;
  urgensi: "tinggi" | "sedang" | "rendah";
  status: "baru" | "proses" | "selesai";
  lokasi: string;
  koordinat: { lat: number; lng: number };
  zonaOperasi: string;
  lampiran?: string[];
  pelapor: string;
  tanggal: string;
  stakeholderTerkait?: string[];
  timeline?: TimelineItem[];
}

export interface Fungsi {
  id: string;
  nama: string;
  deskripsi: string;
  warna: string;
  anggota: {
    stakeholderId: string;
    peran: string;
    level: number;
    atasanId?: string;
  }[];
}

export interface User {
  id: string;
  nama: string;
  email: string;
  role: "super_admin" | "direksi" | "vp" | "manager" | "staff";
  zonaOperasi: string[];
  foto: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  aksi: string;
  entitas: string;
  entitasId: string;
  field: string;
  nilaiLama: string;
  nilaiBaru: string;
  timestamp: string;
}

// Zona Operasi Data
export const zonaOperasiData: ZonaOperasi[] = [
  {
    id: "zona-1",
    nama: "Zona Sumatera",
    deskripsi: "Operasi pengeboran di wilayah Sumatera",
    koordinat: { lat: 0.5, lng: 101.45 },
    batasWilayah: [
      { lat: 5.5, lng: 95 },
      { lat: 5.5, lng: 108 },
      { lat: -5.5, lng: 108 },
      { lat: -5.5, lng: 95 },
    ],
    warna: "#3B82F6",
  },
  {
    id: "zona-2",
    nama: "Zona Jawa",
    deskripsi: "Operasi pengeboran di wilayah Jawa",
    koordinat: { lat: -7.0, lng: 110.0 },
    batasWilayah: [
      { lat: -5.5, lng: 105 },
      { lat: -5.5, lng: 114 },
      { lat: -8.5, lng: 114 },
      { lat: -8.5, lng: 105 },
    ],
    warna: "#10B981",
  },
  {
    id: "zona-3",
    nama: "Zona Kalimantan",
    deskripsi: "Operasi pengeboran di wilayah Kalimantan",
    koordinat: { lat: 0.0, lng: 114.0 }, // Center disesuaikan ke tengah daratan
    batasWilayah: [
      { lat: 1.0, lng: 108.0 }, // Barat Daya (Kalbar)
      { lat: 2.0, lng: 109.5 }, // Mulai mengikuti batas Malaysia
      { lat: 4.2, lng: 114.5 }, // Puncak perbatasan utara
      { lat: 4.1, lng: 117.9 }, // Ujung utara Kaltara (Seatik)
      { lat: 3.5, lng: 119.5 }, // Mulai mengikuti garis hijau (Selat Makassar)
      { lat: -1.0, lng: 118.8 }, // Tengah garis hijau
      { lat: -5.5, lng: 117.5 }, // Ujung selatan garis hijau
      { lat: -5.5, lng: 108.0 }, // Kembali ke barat
    ],
    warna: "#F59E0B",
  },

  {
    id: "zona-4",
    nama: "Zona Sulawesi",
    deskripsi: "Operasi pengeboran di wilayah Sulawesi",
    koordinat: { lat: -1.5, lng: 121.5 }, // Center disesuaikan
    batasWilayah: [
      { lat: 5.5, lng: 121.0 }, // Utara (di atas Gorontalo/Manado)
      { lat: 5.5, lng: 127.0 }, // Timur Laut
      { lat: -7.0, lng: 127.0 }, // Tenggara
      { lat: -7.0, lng: 117.5 }, // Selatan
      { lat: -5.5, lng: 117.5 }, // Titik temu bawah garis hijau
      { lat: -1.0, lng: 118.8 }, // Titik temu tengah garis hijau
      { lat: 3.5, lng: 119.5 }, // Titik temu atas garis hijau
    ],
    warna: "#EF4444",
  },
  {
    id: "zona-5",
    nama: "Zona Papua",
    deskripsi: "Operasi pengeboran di wilayah Papua",
    koordinat: { lat: -4.0, lng: 138.0 },
    batasWilayah: [
      { lat: 0, lng: 130 },
      { lat: 0, lng: 141 },
      { lat: -9, lng: 141 },
      { lat: -9, lng: 130 },
    ],
    warna: "#8B5CF6",
  },
];

// Returns the zona id whose bounding box contains the given coordinate, or null
export function getZonaFromCoordinat(lat: number, lng: number): string | null {
  for (const zona of zonaOperasiData) {
    const lats = zona.batasWilayah.map((p) => p.lat);
    const lngs = zona.batasWilayah.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
      return zona.id;
    }
  }
  return null;
}

// Organisasi Data
export const organisasiData: Organisasi[] = [
  {
    id: "org-1",
    nama: "Pertamina Drilling Services Indonesia",
    tipe: "bumn",
    alamat: "Jakarta Pusat",
    deskripsi: "Perusahaan jasa pengeboran migas nasional",
    zonaOperasi: "zona-2",
    koordinat: { lat: -6.2088, lng: 106.8456 },
  },
  {
    id: "org-2",
    nama: "Dinas ESDM Provinsi Riau",
    tipe: "pemerintah",
    alamat: "Pekanbaru, Riau",
    deskripsi: "Dinas Energi dan Sumber Daya Mineral Provinsi Riau",
    zonaOperasi: "zona-1",
    koordinat: { lat: 0.5071, lng: 101.4478 },
  },
  {
    id: "org-3",
    nama: "PT Medco Energi",
    tipe: "swasta",
    parentId: undefined,
    alamat: "Jakarta Selatan",
    deskripsi: "Perusahaan energi swasta nasional",
    zonaOperasi: "zona-1",
    koordinat: { lat: -6.2614, lng: 106.8106 },
  },
  {
    id: "org-4",
    nama: "Komunitas Masyarakat Duri",
    tipe: "komunitas",
    alamat: "Duri, Riau",
    deskripsi: "Komunitas masyarakat lokal di sekitar area operasi Duri",
    zonaOperasi: "zona-1",
    koordinat: { lat: 1.3, lng: 101.35 },
  },
  {
    id: "org-5",
    nama: "SKK Migas",
    tipe: "pemerintah",
    alamat: "Jakarta Pusat",
    deskripsi:
      "Satuan Kerja Khusus Pelaksana Kegiatan Usaha Hulu Minyak dan Gas Bumi",
    zonaOperasi: "zona-2",
    koordinat: { lat: -6.1944, lng: 106.8229 },
  },
  {
    id: "org-6",
    nama: "PT Chevron Pacific Indonesia",
    tipe: "swasta",
    alamat: "Rumbai, Pekanbaru",
    deskripsi: "Perusahaan minyak dan gas multinasional",
    zonaOperasi: "zona-1",
    koordinat: { lat: 0.5582, lng: 101.4534 },
  },
  {
    id: "org-7",
    nama: "Dinas ESDM Kalimantan Timur",
    tipe: "pemerintah",
    alamat: "Samarinda, Kalimantan Timur",
    deskripsi: "Dinas Energi dan Sumber Daya Mineral Kalimantan Timur",
    zonaOperasi: "zona-3",
    koordinat: { lat: -0.4948, lng: 117.1436 },
  },
  {
    id: "org-8",
    nama: "Corporate Secretary Division",
    tipe: "internal",
    parentId: "org-1",
    alamat: "Jakarta Pusat",
    deskripsi: "Divisi Corporate Secretary Pertamina Drilling",
    zonaOperasi: "zona-2",
    koordinat: { lat: -6.2088, lng: 106.8456 },
  },
  {
    id: "org-9",
    nama: "Human Capital Division",
    tipe: "internal",
    parentId: "org-1",
    alamat: "Jakarta Pusat",
    deskripsi: "Divisi Human Capital Pertamina Drilling",
    zonaOperasi: "zona-2",
    koordinat: { lat: -6.2088, lng: 106.8456 },
  },
  {
    id: "org-10",
    nama: "Operations Division",
    tipe: "internal",
    parentId: "org-1",
    alamat: "Jakarta Pusat",
    deskripsi: "Divisi Operasi Pertamina Drilling",
    zonaOperasi: "zona-2",
    koordinat: { lat: -6.2088, lng: 106.8456 },
  },
];

// Stakeholder Data
export const stakeholderData: Stakeholder[] = [
  {
    id: "sh-1",
    nama: "Budi Santoso",
    jabatan: "Kepala Dinas",
    organisasiId: "org-2",
    kategori: "pemerintah",
    email: "budi.santoso@esdm.riau.go.id",
    telepon: "+62811234567",
    alamat: "Jl. Jenderal Sudirman No. 45, Pekanbaru",
    foto: "/avatars/avatar-1.jpg",
    zonaOperasi: "zona-1",
    alumniPendidikan: "Institut Teknologi Bandung",
    jurusanPendidikan: "Teknik Perminyakan",
    catatan: "Stakeholder kunci untuk perizinan wilayah Riau",
    koordinat: { lat: 0.5071, lng: 101.4478 },
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
  },
  {
    id: "sh-2",
    nama: "Siti Rahayu",
    jabatan: "Direktur Operasi",
    organisasiId: "org-3",
    kategori: "customer",
    email: "siti.rahayu@medco.com",
    telepon: "+62812345678",
    alamat: "Jl. Ampera Raya No. 20, Jakarta Selatan",
    foto: "/avatars/avatar-2.jpg",
    zonaOperasi: "zona-1",
    alumniPendidikan: "Universitas Indonesia",
    jurusanPendidikan: "Teknik Kimia",
    catatan: "PIC utama untuk kontrak drilling services",
    koordinat: { lat: -6.2614, lng: 106.8106 },
    createdAt: "2024-02-01",
    updatedAt: "2024-03-15",
  },
  {
    id: "sh-3",
    nama: "Ahmad Hidayat",
    jabatan: "Ketua Komunitas",
    organisasiId: "org-4",
    kategori: "komunitas",
    email: "ahmad.hidayat@gmail.com",
    telepon: "+62813456789",
    alamat: "Desa Balai Makam, Duri, Riau",
    foto: "/avatars/avatar-3.jpg",
    zonaOperasi: "zona-1",
    catatan: "Perwakilan masyarakat lokal area Duri",
    koordinat: { lat: 1.3, lng: 101.35 },
    createdAt: "2024-01-20",
    updatedAt: "2024-02-28",
  },
  {
    id: "sh-4",
    nama: "Dr. Wahyu Prakoso",
    jabatan: "Deputi Operasi",
    organisasiId: "org-5",
    fungsiId: "fungsi-3",
    kategori: "pemerintah",
    email: "wahyu.prakoso@skkmigas.go.id",
    telepon: "+62814567890",
    alamat: "Gedung Wisma Mulia Lt. 35, Jakarta",
    foto: "/avatars/avatar-4.jpg",
    zonaOperasi: "zona-2",
    alumniPendidikan: "Universitas Gadjah Mada",
    jurusanPendidikan: "Teknik Geologi",
    catatan: "Pengambil keputusan untuk approval operasi nasional",
    koordinat: { lat: -6.1944, lng: 106.8229 },
    createdAt: "2024-01-10",
    updatedAt: "2024-03-25",
  },
  {
    id: "sh-5",
    nama: "Michael Chen",
    jabatan: "Country Manager",
    organisasiId: "org-6",
    kategori: "mitra",
    email: "michael.chen@chevron.com",
    telepon: "+62815678901",
    alamat: "Rumbai Complex, Pekanbaru",
    foto: "/avatars/avatar-5.jpg",
    zonaOperasi: "zona-1",
    alumniPendidikan: "Stanford University",
    jurusanPendidikan: "Petroleum Engineering",
    catatan: "Partner strategis untuk joint operation",
    koordinat: { lat: 0.5582, lng: 101.4534 },
    createdAt: "2024-02-15",
    updatedAt: "2024-03-18",
  },
  {
    id: "sh-6",
    nama: "Dewi Lestari",
    jabatan: "Corporate Secretary",
    organisasiId: "org-8",
    fungsiId: "fungsi-1",
    kategori: "internal",
    email: "dewi.lestari@pertamina-drilling.com",
    telepon: "+62816789012",
    alamat: "Gedung Pertamina, Jakarta",
    foto: "/avatars/avatar-6.jpg",
    zonaOperasi: "zona-2",
    alumniPendidikan: "Universitas Indonesia",
    jurusanPendidikan: "Ilmu Komunikasi",
    koordinat: { lat: -6.2088, lng: 106.8456 },
    createdAt: "2024-01-05",
    updatedAt: "2024-03-10",
  },
  {
    id: "sh-7",
    nama: "Eko Prasetyo",
    jabatan: "VP Human Capital",
    organisasiId: "org-9",
    fungsiId: "fungsi-2",
    kategori: "internal",
    email: "eko.prasetyo@pertamina-drilling.com",
    telepon: "+62817890123",
    alamat: "Gedung Pertamina, Jakarta",
    foto: "/avatars/avatar-7.jpg",
    zonaOperasi: "zona-2",
    alumniPendidikan: "Institut Teknologi Bandung",
    jurusanPendidikan: "Manajemen SDM",
    koordinat: { lat: -6.2088, lng: 106.8456 },
    createdAt: "2024-01-08",
    updatedAt: "2024-03-22",
  },
  {
    id: "sh-8",
    nama: "Ir. Hendra Wijaya",
    jabatan: "VP Operations",
    organisasiId: "org-10",
    fungsiId: "fungsi-3",
    kategori: "internal",
    email: "hendra.wijaya@pertamina-drilling.com",
    telepon: "+62818901234",
    alamat: "Gedung Pertamina, Jakarta",
    foto: "/avatars/avatar-8.jpg",
    zonaOperasi: "zona-2",
    alumniPendidikan: "Institut Teknologi Bandung",
    jurusanPendidikan: "Teknik Perminyakan",
    koordinat: { lat: -6.2088, lng: 106.8456 },
    createdAt: "2024-01-12",
    updatedAt: "2024-03-28",
  },
  {
    id: "sh-9",
    nama: "Rina Kusuma",
    jabatan: "Kepala Seksi Perizinan",
    organisasiId: "org-7",
    kategori: "pemerintah",
    email: "rina.kusuma@esdm.kaltim.go.id",
    telepon: "+62819012345",
    alamat: "Jl. A. Yani No. 1, Samarinda",
    foto: "/avatars/avatar-9.jpg",
    zonaOperasi: "zona-3",
    alumniPendidikan: "Universitas Mulawarman",
    jurusanPendidikan: "Teknik Pertambangan",
    koordinat: { lat: -0.4948, lng: 117.1436 },
    createdAt: "2024-02-20",
    updatedAt: "2024-03-15",
  },
  {
    id: "sh-10",
    nama: "Bambang Sutrisno",
    jabatan: "Field Manager",
    organisasiId: "org-10",
    fungsiId: "fungsi-3",
    kategori: "internal",
    email: "bambang.sutrisno@pertamina-drilling.com",
    telepon: "+62820123456",
    alamat: "Base Camp Duri, Riau",
    foto: "/avatars/avatar-10.jpg",
    zonaOperasi: "zona-1",
    alumniPendidikan: "Institut Teknologi Sepuluh Nopember",
    jurusanPendidikan: "Teknik Mesin",
    koordinat: { lat: 1.28, lng: 101.38 },
    createdAt: "2024-01-25",
    updatedAt: "2024-03-20",
  },
  {
    id: "sh-11",
    nama: "Ratna Sari",
    jabatan: "Community Relations Officer",
    organisasiId: "org-8",
    fungsiId: "fungsi-1",
    kategori: "internal",
    email: "ratna.sari@pertamina-drilling.com",
    telepon: "+62821234567",
    alamat: "Gedung Pertamina, Jakarta",
    foto: "/avatars/avatar-11.jpg",
    zonaOperasi: "zona-2",
    alumniPendidikan: "Universitas Padjadjaran",
    jurusanPendidikan: "Hubungan Masyarakat",
    koordinat: { lat: -6.2088, lng: 106.8456 },
    createdAt: "2024-02-05",
    updatedAt: "2024-03-12",
  },
  {
    id: "sh-12",
    nama: "Agus Firmansyah",
    jabatan: "HR Manager",
    organisasiId: "org-9",
    fungsiId: "fungsi-2",
    kategori: "internal",
    email: "agus.firmansyah@pertamina-drilling.com",
    telepon: "+62822345678",
    alamat: "Gedung Pertamina, Jakarta",
    foto: "/avatars/avatar-12.jpg",
    zonaOperasi: "zona-2",
    alumniPendidikan: "Universitas Airlangga",
    jurusanPendidikan: "Psikologi",
    koordinat: { lat: -6.2088, lng: 106.8456 },
    createdAt: "2024-02-10",
    updatedAt: "2024-03-18",
  },
];

// Insiden Data
export const insidenData: Insiden[] = [
  {
    id: "ins-1",
    judul: "Demo Warga di Lokasi Rig A-15",
    deskripsi:
      "Warga melakukan demo damai menuntut kompensasi lahan yang lebih adil. Sekitar 50 orang hadir di depan pintu masuk lokasi.",
    urgensi: "tinggi",
    status: "proses",
    lokasi: "Rig A-15, Duri",
    koordinat: { lat: 1.32, lng: 101.36 },
    zonaOperasi: "zona-1",
    lampiran: ["/incidents/demo-1.jpg"],
    pelapor: "sh-10",
    tanggal: "2024-03-28",
    stakeholderTerkait: ["sh-3", "sh-10"],
    timeline: [
      {
        id: "tl-1",
        pesan: "Laporan insiden diterima dari petugas lapangan.",
        tanggal: "2024-03-28 08:30",
        updaterId: "sh-10",
        updaterNama: "Budi Santoso",
      },
      {
        id: "tl-2",
        pesan:
          "Tim Community Relations dikerahkan ke lokasi untuk melakukan mediasi awal.",
        tanggal: "2024-03-28 10:15",
        updaterId: "sh-11",
        updaterNama: "Dewi Kartini",
      },
      {
        id: "tl-3",
        pesan: "Meeting dengan tokoh masyarakat dijadwalkan untuk besok pagi.",
        tanggal: "2024-03-28 14:00",
        updaterId: "sh-6",
        updaterNama: "Rini Wulandari",
      },
      {
        id: "tl-4",
        pesan: "Proposal kompensasi tambahan sedang disiapkan oleh tim Legal.",
        tanggal: "2024-03-29 09:00",
        updaterId: "sh-6",
        updaterNama: "Rini Wulandari",
      },
    ],
  },

  {
    id: "ins-2",
    judul: "Keterlambatan Izin Operasi",
    deskripsi:
      "Proses perpanjangan izin operasi di Kaltim mengalami keterlambatan 2 minggu dari jadwal. Perlu eskalasi ke level lebih tinggi.",
    urgensi: "sedang",
    status: "proses",
    lokasi: "Kantor Dinas ESDM Kaltim",
    koordinat: { lat: -0.4948, lng: 117.1436 },
    zonaOperasi: "zona-3",
    pelapor: "sh-9",
    tanggal: "2024-03-25",
    stakeholderTerkait: ["sh-9"],
    timeline: [
      {
        id: "tl-5",
        pesan: "Kendala administrasi teridentifikasi pada dokumen AMDAL.",
        tanggal: "2024-03-25 11:00",
        updaterId: "sh-9",
        updaterNama: "Agus Prabowo",
      },
      {
        id: "tl-6",
        pesan: "Eskalasi ke VP Operations untuk koordinasi dengan Dinas ESDM.",
        tanggal: "2024-03-26 14:30",
        updaterId: "sh-9",
        updaterNama: "Agus Prabowo",
      },
    ],
  },
  {
    id: "ins-3",
    judul: "Kerusakan Jalan Akses Rig B-22",
    deskripsi:
      "Jalan akses menuju Rig B-22 rusak berat akibat hujan lebat. Perlu koordinasi dengan pemda untuk perbaikan bersama.",
    urgensi: "sedang",
    status: "baru",
    lokasi: "Jalan Akses Rig B-22, Riau",
    koordinat: { lat: 1.25, lng: 101.42 },
    zonaOperasi: "zona-1",
    lampiran: ["/incidents/jalan-1.jpg", "/incidents/jalan-2.jpg"],
    pelapor: "sh-10",
    tanggal: "2024-03-29",
    stakeholderTerkait: ["sh-1", "sh-10"],
    timeline: [
      {
        id: "tl-7",
        pesan: "Laporan diterima dari Community Relations Officer.",
        tanggal: "2024-03-30 07:45",
        updaterId: "sh-11",
        updaterNama: "Dewi Kartini",
      },
    ],
  },
  {
    id: "ins-4",
    judul: "Penandatanganan MoU dengan Medco",
    deskripsi:
      "MoU kerjasama drilling services berhasil ditandatangani. Nilai kontrak USD 15 juta untuk 2 tahun.",
    urgensi: "rendah",
    status: "selesai",
    lokasi: "Kantor Pusat Medco, Jakarta",
    koordinat: { lat: -6.2614, lng: 106.8106 },
    zonaOperasi: "zona-2",
    pelapor: "sh-6",
    tanggal: "2024-03-20",
    stakeholderTerkait: ["sh-2", "sh-6"],
  },
  {
    id: "ins-5",
    judul: "Keluhan Kebisingan dari Warga",
    deskripsi:
      "Warga sekitar melaporkan kebisingan berlebih dari aktivitas drilling malam hari. Perlu meeting dengan tokoh masyarakat.",
    urgensi: "tinggi",
    status: "baru",
    lokasi: "Desa Balai Raja, Riau",
    koordinat: { lat: 1.28, lng: 101.33 },
    zonaOperasi: "zona-1",
    pelapor: "sh-11",
    tanggal: "2024-03-30",
    stakeholderTerkait: ["sh-3", "sh-11"],
  },
];

// Fungsi (Cross-Organization Functions)
export const fungsiData: Fungsi[] = [
  {
    id: "fungsi-1",
    nama: "Corporate Secretary",
    deskripsi: "Fungsi kesekretariatan dan hubungan stakeholder eksternal",
    warna: "#3B82F6",
    anggota: [
      { stakeholderId: "sh-6", peran: "VP Corporate Secretary", level: 1 },
      {
        stakeholderId: "sh-11",
        peran: "Community Relations Officer",
        level: 2,
        atasanId: "sh-6",
      },
    ],
  },
  {
    id: "fungsi-2",
    nama: "Human Capital",
    deskripsi: "Fungsi pengelolaan sumber daya manusia",
    warna: "#10B981",
    anggota: [
      { stakeholderId: "sh-7", peran: "VP Human Capital", level: 1 },
      {
        stakeholderId: "sh-12",
        peran: "HR Manager",
        level: 2,
        atasanId: "sh-7",
      },
    ],
  },
  {
    id: "fungsi-3",
    nama: "Operations",
    deskripsi: "Fungsi operasional pengeboran",
    warna: "#F59E0B",
    anggota: [
      { stakeholderId: "sh-8", peran: "VP Operations", level: 1 },
      {
        stakeholderId: "sh-10",
        peran: "Field Manager",
        level: 2,
        atasanId: "sh-8",
      },
    ],
  },
];

// Current User (for demo)
export const currentUser: User = {
  id: "user-1",
  nama: "Admin Demo",
  email: "admin@pertamina-drilling.com",
  role: "super_admin",
  zonaOperasi: ["zona-1", "zona-2", "zona-3", "zona-4", "zona-5"],
  foto: "/avatars/admin.jpg",
};

// Audit Logs
export const auditLogData: AuditLog[] = [
  {
    id: "log-1",
    userId: "user-1",
    aksi: "UPDATE",
    entitas: "stakeholder",
    entitasId: "sh-1",
    field: "telepon",
    nilaiLama: "+62810000000",
    nilaiBaru: "+62811234567",
    timestamp: "2024-03-20T10:30:00Z",
  },
  {
    id: "log-2",
    userId: "user-1",
    aksi: "CREATE",
    entitas: "insiden",
    entitasId: "ins-5",
    field: "-",
    nilaiLama: "-",
    nilaiBaru: "Keluhan Kebisingan dari Warga",
    timestamp: "2024-03-30T09:15:00Z",
  },
  {
    id: "log-3",
    userId: "user-1",
    aksi: "UPDATE",
    entitas: "insiden",
    entitasId: "ins-1",
    field: "status",
    nilaiLama: "baru",
    nilaiBaru: "proses",
    timestamp: "2024-03-28T14:45:00Z",
  },
];

// Dashboard Statistics
export const dashboardStats = {
  totalStakeholder: stakeholderData.length,
  totalOrganisasi: organisasiData.length,
  totalInsiden: insidenData.length,
  insidenAktif: insidenData.filter((i) => i.status !== "selesai").length,
  stakeholderByKategori: {
    customer: stakeholderData.filter((s) => s.kategori === "customer").length,
    pemerintah: stakeholderData.filter((s) => s.kategori === "pemerintah")
      .length,
    komunitas: stakeholderData.filter((s) => s.kategori === "komunitas").length,
    mitra: stakeholderData.filter((s) => s.kategori === "mitra").length,
    internal: stakeholderData.filter((s) => s.kategori === "internal").length,
  },
  stakeholderByZona: {
    "Zona Sumatera": stakeholderData.filter((s) => s.zonaOperasi === "zona-1")
      .length,
    "Zona Jawa": stakeholderData.filter((s) => s.zonaOperasi === "zona-2")
      .length,
    "Zona Kalimantan": stakeholderData.filter((s) => s.zonaOperasi === "zona-3")
      .length,
    "Zona Sulawesi": stakeholderData.filter((s) => s.zonaOperasi === "zona-4")
      .length,
    "Zona Papua": stakeholderData.filter((s) => s.zonaOperasi === "zona-5")
      .length,
  },
  trenBulanan: [
    { bulan: "Jan", insiden: 1 },
    { bulan: "Feb", insiden: 2 },
    { bulan: "Mar", insiden: 5 },
    { bulan: "Apr", insiden: 3 },
    { bulan: "Mei", insiden: 4 },
    { bulan: "Jun", insiden: 2 },
  ],
};

// Helper functions
export function getStakeholderById(id: string): Stakeholder | undefined {
  return stakeholderData.find((s) => s.id === id);
}

export function getOrganisasiById(id: string): Organisasi | undefined {
  return organisasiData.find((o) => o.id === id);
}

export function getZonaById(id: string): ZonaOperasi | undefined {
  return zonaOperasiData.find((z) => z.id === id);
}

export function getFungsiById(id: string): Fungsi | undefined {
  return fungsiData.find((f) => f.id === id);
}

export function getStakeholdersByOrganisasi(orgId: string): Stakeholder[] {
  return stakeholderData.filter((s) => s.organisasiId === orgId);
}

export function getStakeholdersByZona(zonaId: string): Stakeholder[] {
  return stakeholderData.filter((s) => s.zonaOperasi === zonaId);
}

export function getInsidenByZona(zonaId: string): Insiden[] {
  return insidenData.filter((i) => i.zonaOperasi === zonaId);
}

export function getChildOrganisasi(parentId: string): Organisasi[] {
  return organisasiData.filter((o) => o.parentId === parentId);
}

export const kategoriColors: Record<Stakeholder["kategori"], string> = {
  customer: "#3B82F6",
  pemerintah: "#EF4444",
  komunitas: "#10B981",
  mitra: "#F59E0B",
  internal: "#8B5CF6",
};

export const urgensiColors: Record<Insiden["urgensi"], string> = {
  tinggi: "#EF4444",
  sedang: "#F59E0B",
  rendah: "#10B981",
};

export const statusColors: Record<Insiden["status"], string> = {
  baru: "#3B82F6",
  proses: "#F59E0B",
  selesai: "#10B981",
};
