import { useState } from "react";
import { useCMS } from "./cms/useCMS";
import Dashboard from "./cms/Dashboard";
import { useAuth } from "./blog/useAuth";
import { useArticles } from "./blog/useArticles";
import { Article } from "./blog/types";
import BlogPage from "./blog/BlogPage";
import ArticlePage from "./blog/ArticlePage";
import BlogEditor from "./blog/BlogEditor";
import logoSekolah from "./imports/logo_sekolah-1.png";

type Page = "home" | "blog" | "article" | "editor" | "dashboard" | "profil";

const navLinks = [
  { label: "Berita", href: "#berita" },
  { label: "Profil", href: "#profil" },
  { label: "Program", href: "#program" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "SiPKL", href: "https://sipkl.smknpringsurat.sch.id/" },
  { label: "SPMB", href: "#spmb" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function App() {
  /* ── CMS (site settings) ── */
  const { data, isAdmin, login: cmsLogin, logout: cmsLogout, update, resetToDefault } = useCMS();

  /* ── Blog auth (multi-user) ── */
  const { users, currentUser, login: blogLogin, logout: blogLogout, addUser, removeUser, updatePassword } = useAuth();

  /* ── Articles ── */
  const { articles, publishedArticles, createArticle, updateArticle, deleteArticle } = useArticles();

  /* ── UI state ── */
  const [page, setPage] = useState<Page>("home");
  const [articleId, setArticleId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── Helpers ── */
  function goHome() { setPage("home"); setArticleId(null); window.scrollTo(0, 0); }
  function goProfil() { setPage("profil"); window.scrollTo(0, 0); }
  function goBlog() { setPage("blog"); window.scrollTo(0, 0); }
  function goArticle(id: string) { setArticleId(id); setPage("article"); window.scrollTo(0, 0); }
  function goDashboard() { setPage("dashboard"); window.scrollTo(0, 0); }
  function goEditor(article?: Article) {
    setEditingArticle(article ?? null);
    setPage("editor");
    window.scrollTo(0, 0);
  }

  function handleSaveArticle(draft: Omit<Article, "id" | "createdAt">) {
    if (editingArticle) {
      updateArticle(editingArticle.id, draft);
      goArticle(editingArticle.id);
    } else {
      const a = createArticle(draft);
      goArticle(a.id);
    }
  }

  function handleDeleteArticle(id: string) {
    deleteArticle(id);
    goBlog();
  }

  const currentArticle = articles.find((a) => a.id === articleId);
  const relatedArticles = currentArticle
    ? publishedArticles.filter((a) => a.id !== currentArticle.id).slice(0, 3)
    : [];

  /* ── Non-home pages ── */

  if (page === "dashboard") {
    return (
      <Dashboard
        data={data}
        isAdmin={isAdmin}
        currentUser={currentUser}
        users={users}
        articles={articles}
        onCmsLogin={(password) => cmsLogin(password)}
        onCmsLogout={() => { cmsLogout(); }}
        onBlogLogin={(username, password) => blogLogin(username, password)}
        onBlogLogout={blogLogout}
        onUpdate={update}
        onReset={resetToDefault}
        onAddUser={addUser}
        onRemoveUser={removeUser}
        onUpdatePassword={updatePassword}
        onDeleteArticle={(id) => deleteArticle(id)}
        onGoHome={goHome}
        onGoEditor={(article) => goEditor(article)}
      />
    );
  }

  if (page === "profil") {
    return (
      <>
        <Navbar
          schoolName={data.school.name}
          tagline={data.school.tagline}
          currentUser={currentUser}
          onLogout={blogLogout}
          onWrite={() => goEditor()}
          onHome={goHome}
          onDashboard={goDashboard}
          onProfilClick={goProfil}
          navLinks={navLinks}
          onBlogClick={goBlog}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <ProfilPage data={data} onHome={goHome} />
      </>
    );
  }

  if (page === "blog") {
    return (
      <>
        <Navbar
          schoolName={data.school.name}
          tagline={data.school.tagline}
          currentUser={currentUser}
          onLogout={blogLogout}
          onWrite={() => goEditor()}
          onHome={goHome}
          onDashboard={goDashboard}
          isBlogPage
        />
        <BlogPage articles={publishedArticles} onRead={goArticle} onHome={goHome} />
      </>
    );
  }

  if (page === "article" && currentArticle) {
    return (
      <>
        <Navbar
          schoolName={data.school.name}
          tagline={data.school.tagline}
          currentUser={currentUser}
          onLogout={blogLogout}
          onWrite={() => goEditor()}
          onHome={goHome}
          onDashboard={goDashboard}
          isBlogPage
        />
        <ArticlePage
          article={currentArticle}
          related={relatedArticles}
          onBack={goBlog}
          onRead={goArticle}
          currentUserId={currentUser?.id}
          currentUserRole={currentUser?.role}
          onEdit={goEditor}
          onDelete={handleDeleteArticle}
        />
      </>
    );
  }

  if (page === "editor" && currentUser) {
    return (
      <BlogEditor
        initial={editingArticle}
        currentUser={currentUser}
        onSave={handleSaveArticle}
        onCancel={() => (editingArticle ? goArticle(editingArticle.id) : goBlog())}
      />
    );
  }

  /* ── HOME PAGE ── */
  const latestNews = publishedArticles.slice(0, 6);

  return (
    <div className="min-h-full bg-[#f8faff] text-slate-900 font-sans overflow-x-hidden">

      {/* NAVBAR */}
      <Navbar
        schoolName={data.school.name}
        tagline={data.school.tagline}
        currentUser={currentUser}
        onLogout={blogLogout}
        onWrite={() => goEditor()}
        onHome={goHome}
        onDashboard={goDashboard}
        onProfilClick={goProfil}
        navLinks={navLinks}
        onBlogClick={goBlog}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* HERO */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${data.hero.backgroundImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#1e3a8a]/75 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {data.hero.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
              <span className="italic text-blue-300">Religius,</span>
              <br />Cerdas,<br />Berkarakter.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-md">{data.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#spmb" className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-900/40">{data.hero.cta1}</a>
              <a href="#program" className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20 backdrop-blur-sm">{data.hero.cta2} →</a>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {data.stats.map((s) => (
              <div key={s.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 hover:bg-white/15 transition-colors">
                <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{s.value}</div>
                <div className="text-slate-300 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs">
          <span>Gulir ke bawah</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* BERITA */}
      <section id="berita" className="py-24 bg-[#f8faff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Blog Sekolah</div>
              <h2 className="text-4xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Berita Terbaru</h2>
            </div>
            <button
              onClick={goBlog}
              className="px-5 py-2.5 rounded-xl border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Lihat Semua →
            </button>
          </div>

          {latestNews.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-3">📭</div>
              <p>Belum ada artikel yang diterbitkan.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((a) => (
                <article
                  key={a.id}
                  onClick={() => goArticle(a.id)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg hover:shadow-slate-200/70 transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-44 bg-slate-200 overflow-hidden">
                    <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-blue-700 text-white text-xs font-semibold">{a.tag}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-slate-400 mb-2">{formatDate(a.createdAt)}</div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">{a.title}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-4">{a.excerpt}</p>
                    <div className="text-xs text-slate-400 border-t border-slate-100 pt-3">oleh <span className="font-medium text-slate-600">{a.authorName}</span></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-14 max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Program Keahlian</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Empat Jurusan Unggulan</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Pilih jalur kariermu bersama program keahlian kami yang dirancang sesuai kebutuhan industri.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.programs.map((p) => (
              <div key={p.code} className="group relative rounded-2xl overflow-hidden cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                <div className="relative border border-slate-200 group-hover:border-transparent rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-900/20 group-hover:translate-y-[-2px]">
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-600 group-hover:text-blue-200 mb-2 transition-colors">{p.code}</div>
                  <h3 className="font-bold text-slate-900 group-hover:text-white text-base mb-3 leading-snug transition-colors">{p.name}</h3>
                  <p className="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed transition-colors">{p.desc}</p>
                  <div className="mt-5 text-sm font-semibold text-blue-600 group-hover:text-white flex items-center gap-1 transition-colors">Selengkapnya <span>→</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FASILITAS */}
      <section id="fasilitas" className="py-24 bg-gradient-to-br from-slate-900 to-blue-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-14 max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Fasilitas Kami</div>
            <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Lingkungan Belajar Terbaik</h2>
            <p className="text-slate-400 text-lg leading-relaxed">Didukung fasilitas lengkap untuk menunjang kegiatan akademik, olahraga, dan pengembangan diri.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.facilities.map((f) => (
              <div key={f.id} className="group flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-3xl shrink-0">{f.icon}</div>
                <h3 className="font-semibold text-white leading-snug">{f.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EKSKUL */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Pengembangan Diri</div>
            <h2 className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Ekstrakurikuler</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {data.extracurriculars.map((e, i) => (
              <div key={i} className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors cursor-pointer">{e}</div>
            ))}
          </div>
        </div>
      </section>

      {/* SPMB */}
      <section id="spmb" className="py-24 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">{data.spmb.badge}</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Bergabunglah Bersama<br /><span className="text-amber-300">SMK NEGERI PRINGSURAT</span>
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">SPMB 2027/2028 COMING SOON!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm transition-colors shadow-lg shadow-amber-900/30">{data.spmb.cta1}</a>
          </div>
        </div>
      </section>

      {/* MITRA */}
      <section className="py-14 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Mitra & Dunia Industri</div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {data.partners.map((m, i) => (
              <div key={i} className="text-slate-400 font-semibold text-sm hover:text-slate-600 transition-colors cursor-pointer">{m}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400">
        {/* Maps + info row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10 grid lg:grid-cols-2 gap-10 items-start">
          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 w-full" style={{ height: "300px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18898.47036826402!2d110.31063814591452!3d-7.317112175387151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8013d49c7e45%3A0x84f7b13e92ac042a!2sSMK%20Negeri%20Pringsurat!5e1!3m2!1sid!2sid!4v1789353335037!5m2!1sid!2sid"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Lokasi SMKN Pringsurat"
            />
          </div>

          {/* Info + links */}
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Kontak */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoSekolah} alt="Logo SMKN Pringsurat" className="w-9 h-9 object-contain" />
                <span className="text-white font-bold text-sm">{data.school.name}</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">{data.school.address}.</p>
              <div className="text-sm space-y-1.5">
                <div>📞 {data.school.phone}</div>
                <div>🌐 {data.school.website}</div>
              </div>

              {/* Social media */}
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/smknpringsurat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20 text-pink-400 hover:border-pink-400/40 hover:text-pink-300 transition-all text-xs font-semibold"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@SMKNPRINGSURAT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/20 border border-red-600/20 text-red-400 hover:border-red-400/40 hover:text-red-300 transition-all text-xs font-semibold"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </div>
            </div>

            {/* Program + Tautan */}
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Program</h4>
                <ul className="space-y-1.5 text-sm">
                  {data.programs.map((p) => (
                    <li key={p.code}><a href="#program" className="hover:text-white transition-colors">{p.code} — {p.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Tautan</h4>
                <ul className="space-y-1.5 text-sm">
                  {["Profil Sekolah", "Prestasi", "Ekstrakulikuler", "Download", "eRapor", "Presensi"].map((l) => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <span>© 2025 {data.school.name}. Kepala Sekolah: {data.school.principal}</span>
          <div className="flex items-center gap-4">
            <span>{data.school.tagline}</span>
            <button onClick={goDashboard} className="text-slate-700 hover:text-slate-400 transition-colors">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════ */

interface NavbarProps {
  schoolName: string;
  tagline: string;
  currentUser: ReturnType<typeof useAuth>["currentUser"];
  onLogout: () => void;
  onWrite: () => void;
  onHome: () => void;
  onDashboard: () => void;
  onProfilClick?: () => void;
  isBlogPage?: boolean;
  navLinks?: { label: string; href: string }[];
  onBlogClick?: () => void;
  menuOpen?: boolean;
  setMenuOpen?: (v: boolean) => void;
}

function Navbar({ schoolName, tagline, currentUser, onLogout, onWrite, onHome, onDashboard, onProfilClick, isBlogPage, navLinks, onBlogClick, menuOpen, setMenuOpen }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <button onClick={onHome} className="flex items-center gap-3">
          <img src={logoSekolah} alt="Logo SMKN Pringsurat" className="w-10 h-10 object-contain" />
          <div className="leading-tight text-left">
            <div className="font-bold text-slate-900 text-sm">{schoolName}</div>
            <div className="text-[11px] text-slate-500">{tagline}</div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {isBlogPage ? (
            <button onClick={onHome} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">← Beranda</button>
          ) : (
            navLinks?.map((l) =>
              l.label === "Berita" ? (
                <button key={l.label} onClick={onBlogClick} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">Berita</button>
              ) : l.label === "Profil" ? (
                <button key={l.label} onClick={onProfilClick} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">Profil</button>
              ) : (
                <a key={l.label} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">{l.label}</a>
              )
            )
          )}

          {currentUser ? (
            <div className="ml-2 flex items-center gap-2">
              <button onClick={onWrite} className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors">
                ✏️ Tulis Artikel
              </button>
              <button onClick={onDashboard} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors" title="Dashboard">
                ⚙️
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className={`w-8 h-8 rounded-full ${currentUser.role === "admin" ? "bg-blue-600" : "bg-violet-600"} flex items-center justify-center text-white text-xs font-bold`}>
                  {currentUser.displayName.charAt(0)}
                </div>
                <button onClick={onLogout} className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors">Keluar</button>
              </div>
            </div>
          ) : null}

        </nav>

        {setMenuOpen && (
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-px bg-slate-700 mb-1.5" />
            <div className="w-5 h-px bg-slate-700 mb-1.5" />
            <div className="w-5 h-px bg-slate-700" />
          </button>
        )}
      </div>

      {menuOpen && setMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-2">
          {navLinks?.map((l) =>
            l.label === "Berita" ? (
              <button key={l.label} onClick={() => { onBlogClick?.(); setMenuOpen(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left">Berita</button>
            ) : l.label === "Profil" ? (
              <button key={l.label} onClick={() => { onProfilClick?.(); setMenuOpen(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left">Profil</button>
            ) : (
              <a key={l.label} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">{l.label}</a>
            )
          )}
          {currentUser && (
            <>
              <button onClick={() => { onWrite(); setMenuOpen(false); }} className="px-4 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-semibold text-center">✏️ Tulis Artikel</button>
              <button onClick={() => { onDashboard(); setMenuOpen(false); }} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm text-center">⚙️ Dashboard</button>
              <button onClick={() => { onLogout(); setMenuOpen(false); }} className="px-4 py-2.5 rounded-lg border border-red-100 text-red-500 text-sm text-center">Keluar ({currentUser.displayName})</button>
            </>
          )}
          <a href="#spmb" onClick={() => setMenuOpen(false)} className="mt-1 px-4 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-semibold text-center">Daftar SPMB</a>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════
   PROFIL PAGE
═══════════════════════════════════════ */
function ProfilPage({ data, onHome }: { data: ReturnType<typeof import("./cms/useCMS").useCMS>["data"]; onHome: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="pt-16 bg-gradient-to-br from-blue-700 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <button onClick={onHome} className="text-blue-300 hover:text-white text-sm font-medium mb-6 flex items-center gap-1 transition-colors">
            ← Kembali ke Beranda
          </button>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">Profil Sekolah</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Mengenal SMKN Pringsurat
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Sekolah vokasi unggulan di Kabupaten Temanggung yang mencetak lulusan kompeten, berkarakter, dan siap bersaing di dunia kerja.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left — foto + identitas */}
          <div>
            <div className="relative rounded-3xl overflow-hidden bg-slate-200 aspect-[4/3] mb-6">
              <img
                src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=900&h=675&fit=crop&auto=format"
                alt="Gedung SMK Negeri Pringsurat"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Terakreditasi A
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Identitas Sekolah</h3>
              {[
                { label: "Nama Sekolah", value: data.school.name },
                { label: "NPSN", value: "20321234" },
                { label: "Status", value: "Negeri" },
                { label: "Akreditasi", value: "A (Unggul)" },
                { label: "Kepala Sekolah", value: data.school.principal },
                { label: "Alamat", value: data.school.address },
                { label: "Telepon", value: data.school.phone },
                { label: "Website", value: data.school.website },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-slate-400 min-w-[130px] shrink-0">{item.label}</span>
                  <span className="text-slate-700 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visi, misi, sejarah */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white">🎯</div>
                <h2 className="font-black text-slate-900 text-2xl" style={{ fontFamily: "'Fraunces', serif" }}>Visi</h2>
              </div>
              <blockquote className="text-slate-700 text-lg leading-relaxed border-l-4 border-blue-600 pl-5 italic">
                "Terwujudnya SMK Negeri Pringsurat sebagai lembaga pendidikan vokasi yang menghasilkan lulusan religius, cerdas, dan berkarakter serta mampu bersaing di tingkat nasional dan internasional."
              </blockquote>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-700 flex items-center justify-center text-white">📋</div>
                <h2 className="font-black text-slate-900 text-2xl" style={{ fontFamily: "'Fraunces', serif" }}>Misi</h2>
              </div>
              <ol className="space-y-3">
                {[
                  "Menyelenggarakan pendidikan dan pelatihan berbasis kompetensi yang relevan dengan kebutuhan industri.",
                  "Membentuk karakter peserta didik yang religius, disiplin, dan berintegritas tinggi.",
                  "Mengembangkan kemitraan strategis dengan dunia usaha dan dunia industri (DUDI).",
                  "Mendorong inovasi dan kreativitas melalui pembelajaran berbasis proyek nyata.",
                  "Mewujudkan lingkungan belajar yang kondusif, inklusif, dan berbudaya mutu.",
                ].map((m, i) => (
                  <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white">📖</div>
                <h2 className="font-black text-slate-900 text-2xl" style={{ fontFamily: "'Fraunces', serif" }}>Sejarah Singkat</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                SMK Negeri Pringsurat berdiri dan mulai beroperasi sebagai sekolah kejuruan negeri di Kecamatan Pringsurat, Kabupaten Temanggung. Selama lebih dari 18 tahun, sekolah ini terus berkembang membuka program keahlian baru sesuai tuntutan industri — dari konstruksi bangunan hingga desain komunikasi visual dan jaringan komputer. Hingga kini, ribuan lulusan telah berhasil berkarier di berbagai perusahaan lokal maupun nasional.
              </p>
            </div>
          </div>
        </div>

        {/* Kepala Sekolah card */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-4xl shrink-0">
            👩‍💼
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Sambutan Kepala Sekolah</div>
            <h3 className="font-black text-2xl mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{data.school.principal}</h3>
            <div className="text-blue-200 text-sm mb-4">Kepala SMK Negeri Pringsurat</div>
            <p className="text-blue-100 leading-relaxed max-w-2xl">
              "Selamat datang di SMK Negeri Pringsurat. Kami berkomitmen untuk terus meningkatkan kualitas pendidikan vokasi agar setiap lulusan mampu menjawab tantangan dunia kerja yang terus berkembang. Dengan semangat Religius, Cerdas, dan Berkarakter, kami yakin siswa-siswi SMKN Pringsurat akan menjadi generasi penerus bangsa yang unggul dan berdaya saing."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

