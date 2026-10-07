export interface BlogUser {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: "admin" | "author";
  color: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tag: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  published: boolean;
}

export const ARTICLE_TAGS = [
  "Berita",
  "Kegiatan",
  "Prestasi",
  "Upacara",
  "Akademik",
  "Ekstrakurikuler",
  "Pengumuman",
];

export const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
];

const DEFAULT_USERS: BlogUser[] = [
  {
    id: "admin",
    username: "admin",
    password: "smkn2025",
    displayName: "Administrator",
    role: "admin",
    color: "bg-blue-600",
  },
  {
    id: "guru1",
    username: "budi",
    password: "guru123",
    displayName: "Budi Santoso, S.Pd",
    role: "author",
    color: "bg-violet-600",
  },
  {
    id: "guru2",
    username: "sari",
    password: "guru123",
    displayName: "Sari Dewi, M.Pd",
    role: "author",
    color: "bg-emerald-600",
  },
];

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "1",
    title: "SMKN Pringsurat Raih Juara dalam Lomba Kompetensi Siswa Tingkat Provinsi",
    content:
      "SMK Negeri Pringsurat kembali mengharumkan nama sekolah dengan meraih juara dalam ajang Lomba Kompetensi Siswa (LKS) tingkat provinsi Jawa Tengah yang diselenggarakan bulan ini.\n\nTim siswa yang terdiri dari tiga peserta dari jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT) berhasil menyingkirkan puluhan sekolah lain se-provinsi. Mereka menampilkan kemampuan terbaik dalam bidang IT Network Systems Administration.\n\nKepala Sekolah Mila Yutiana, S.Pd., M.MPar. menyampaikan kebanggaannya atas prestasi yang diraih para siswa. \"Ini adalah bukti nyata bahwa program keahlian kami telah berjalan dengan baik dan menghasilkan lulusan yang kompeten dan berdaya saing tinggi,\" ujarnya.\n\nPara pemenang akan mewakili Jawa Tengah dalam LKS tingkat nasional yang akan diselenggarakan bulan depan. Semua civitas akademika SMKN Pringsurat mendoakan keberhasilan tim dalam ajang bergengsi tersebut.\n\nSelamat kepada seluruh peserta yang telah berjuang keras dan mengharumkan nama SMK Negeri Pringsurat!",
    excerpt:
      "Tim siswa SMKN Pringsurat berhasil meraih juara LKS tingkat provinsi Jawa Tengah dalam bidang IT Network Systems Administration.",
    coverImage:
      "https://images.unsplash.com/photo-1589104760192-ccab0ce0d90f?w=1200&h=630&fit=crop&auto=format",
    tag: "Prestasi",
    authorId: "guru1",
    authorName: "Budi Santoso, S.Pd",
    createdAt: "2025-10-30T08:00:00.000Z",
    published: true,
  },
  {
    id: "2",
    title: "Peringatan Hari Sumpah Pemuda Diwarnai Pentas Seni dan Upacara Khidmat",
    content:
      "SMKN Pringsurat memperingati Hari Sumpah Pemuda ke-97 dengan serangkaian kegiatan yang meriah namun tetap khidmat. Upacara bendera dilaksanakan pada pagi hari dengan seluruh siswa, guru, dan tenaga kependidikan hadir dengan mengenakan pakaian adat daerah masing-masing.\n\nBerbeda dari tahun-tahun sebelumnya, peringatan kali ini dirangkaikan dengan pentas seni yang menampilkan berbagai pertunjukan budaya dari siswa. Mulai dari tari tradisional, pertunjukan musik, hingga pembacaan puisi bertema kebangsaan.\n\nEkstrakurikuler Pleton Inti Jatayu turut memeriahkan acara dengan demonstrasi baris-berbaris yang memukau. Sementara itu, Rohis Darul Hikmah menampilkan qasidah dan pembacaan shalawat yang menyentuh hati.\n\nKegiatan berlangsung hingga sore hari dan ditutup dengan penampilan band sekolah yang membawakan lagu-lagu nasional dengan aransemen modern. Seluruh peserta tampak antusias dan bangga sebagai generasi muda penerus bangsa.",
    excerpt:
      "Peringatan Hari Sumpah Pemuda ke-97 di SMKN Pringsurat diwarnai dengan upacara khidmat dan pentas seni budaya yang meriah.",
    coverImage:
      "https://images.unsplash.com/photo-1566409031818-9508be68fc74?w=1200&h=630&fit=crop&auto=format",
    tag: "Kegiatan",
    authorId: "guru2",
    authorName: "Sari Dewi, M.Pd",
    createdAt: "2025-10-28T09:00:00.000Z",
    published: true,
  },
  {
    id: "3",
    title: "Upacara Hari Kesaktian Pancasila: Meneguhkan Semangat Kebangsaan",
    content:
      "Seluruh civitas akademika SMK Negeri Pringsurat mengikuti Upacara Peringatan Hari Kesaktian Pancasila yang dilaksanakan dengan penuh khidmat di lapangan utama sekolah.\n\nUpacara yang diadakan setiap tanggal 1 Oktober ini merupakan momen penting untuk mengenang perjuangan para pahlawan bangsa sekaligus mempertegas komitmen seluruh warga sekolah terhadap nilai-nilai Pancasila.\n\nDalam amanatnya, Kepala Sekolah Mila Yutiana menekankan pentingnya menjaga persatuan dan kesatuan bangsa di tengah tantangan era digital. Beliau mengajak seluruh siswa untuk menjadikan Pancasila sebagai pedoman hidup sehari-hari.\n\nSiswa-siswi tampak khidmat dan bersemangat mengikuti upacara dari awal hingga akhir. Acara ditutup dengan mengheningkan cipta dan menyanyikan lagu Bagimu Negeri bersama-sama.",
    excerpt:
      "SMKN Pringsurat melaksanakan Upacara Hari Kesaktian Pancasila dengan penuh khidmat, mempertegas komitmen terhadap nilai-nilai kebangsaan.",
    coverImage:
      "https://images.unsplash.com/photo-1648518295678-f78670c35924?w=1200&h=630&fit=crop&auto=format",
    tag: "Upacara",
    authorId: "admin",
    authorName: "Administrator",
    createdAt: "2025-10-01T07:00:00.000Z",
    published: true,
  },
];

const USERS_KEY = "smkn_blog_users";
const ARTICLES_KEY = "smkn_blog_articles";

export function loadUsers(): BlogUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return DEFAULT_USERS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: BlogUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadArticles(): Article[] {
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    if (!raw) return DEFAULT_ARTICLES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ARTICLES;
  }
}

export function saveArticles(articles: Article[]) {
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}
