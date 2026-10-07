export interface Program {
  code: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export interface CMSData {
  hero: {
    badge: string;
    titleItalic: string;
    title2: string;
    title3: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    backgroundImage: string;
  };
  school: {
    name: string;
    tagline: string;
    principal: string;
    address: string;
    phone: string;
    website: string;
  };
  stats: Array<{ id: string; value: string; label: string }>;
  programs: Program[];
  facilities: Facility[];
  extracurriculars: string[];
  partners: string[];
  spmb: {
    badge: string;
    applicants: string;
    subtitle: string;
    cta1: string;
    cta2: string;
  };
}

export const defaultCMS: CMSData = {
  hero: {
    badge: "Terakreditasi · SPMB 2025/2026 Dibuka",
    titleItalic: "Siap Kerja,",
    title2: "Siap Berkarya,",
    title3: "Siap Bersaing.",
    subtitle:
      "SMK Negeri Pringsurat mencetak lulusan vokasi yang kompeten, berkarakter, dan siap menghadapi tantangan dunia kerja global.",
    cta1: "Daftar Sekarang",
    cta2: "Lihat Program",
    backgroundImage:
      "https://images.unsplash.com/photo-1615406020658-6c4b805f1f30?w=1600&h=900&fit=crop&auto=format",
  },
  school: {
    name: "SMK Negeri Pringsurat",
    tagline: "Religius · Cerdas · Berkarakter",
    principal: "Mila Yutiana, S.Pd., M.MPar.",
    address: "Pingit Lawang, Desa Pingit, Kecamatan Pringsurat, Kabupaten Temanggung, Jawa Tengah",
    phone: "(0298) 6052705",
    website: "smknpringsurat.sch.id",
  },
  stats: [
    { id: "1", value: "803", label: "Total Siswa/Siswi" },
    { id: "2", value: "4", label: "Program Keahlian" },
    { id: "3", value: "18+", label: "Tahun Berdiri" },
    { id: "4", value: "12+", label: "Ekstrakulikuler" },
  ],
  programs: [
    {
      code: "TKP",
      name: "Teknik Konstruksi & Perumahan",
      desc: "Mempelajari ilmu konstruksi bangunan, teknik sipil, dan pengelolaan proyek perumahan modern.",
      icon: "🏗️",
      color: "from-blue-600 to-blue-800",
    },
    {
      code: "DPIB",
      name: "Desain Pemodelan & Informasi Bangunan",
      desc: "Menguasai teknologi BIM, AutoCAD, dan perangkat lunak desain arsitektur terkini.",
      icon: "🏛️",
      color: "from-indigo-600 to-indigo-800",
    },
    {
      code: "TJKT",
      name: "Teknik Jaringan Komputer & Telekomunikasi",
      desc: "Membangun kompetensi jaringan komputer, keamanan siber, dan infrastruktur telekomunikasi.",
      icon: "🌐",
      color: "from-cyan-600 to-cyan-800",
    },
    {
      code: "DKV",
      name: "Desain Komunikasi Visual",
      desc: "Mengembangkan kreativitas di bidang desain grafis, branding, animasi, dan media digital.",
      icon: "🎨",
      color: "from-violet-600 to-violet-800",
    },
  ],
  facilities: [
    { id: "1", name: "Lapangan Basket", icon: "🏀", desc: "Lapangan standar kompetisi untuk turnamen antar sekolah." },
    { id: "2", name: "Lapangan Futsal", icon: "⚽", desc: "Fasilitas olahraga modern untuk kegiatan ekstrakurikuler." },
    { id: "3", name: "Masjid Baitul Hikmah", icon: "🕌", desc: "Pusat kegiatan keagamaan dan pengembangan karakter." },
    {
      id: "4",
      name: "Lab Komputer",
      icon: "💻",
      desc: "Laboratorium komputer berteknologi tinggi untuk praktik TJKT & DKV.",
    },
    {
      id: "5",
      name: "Perpustakaan Digital",
      icon: "📚",
      desc: "Akses ribuan referensi digital untuk mendukung pembelajaran.",
    },
    {
      id: "6",
      name: "Studio DKV",
      icon: "🖥️",
      desc: "Studio kreatif lengkap dengan perangkat desain profesional.",
    },
  ],
  extracurriculars: [
    "🥋 Pencak Silat",
    "🏥 PMR",
    "⛺ Pramuka",
    "🎖️ Pleton Inti Jatayu",
    "🕌 Rohis Darul Hikmah",
    "💼 Kewirausahaan",
  ],
  partners: ["Telkom Indonesia", "E&E", "Masdom", "JD", "PS-Cipta"],
  spmb: {
    badge: "Penerimaan Peserta Didik Baru",
    applicants: "5.484 Pendaftar",
    subtitle:
      "Jadilah bagian dari keluarga besar SMKN Pringsurat. SPMB Tahun Pelajaran 2025/2026 kini telah dibuka.",
    cta1: "Daftar Sekarang",
    cta2: "Lihat Hasil SPMB",
  },
};
