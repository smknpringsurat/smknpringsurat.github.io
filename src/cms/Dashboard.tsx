import { useState } from "react";
import { CMSData, Program, Facility } from "./data";
import { BlogUser, Article } from "../blog/types";
import logoSekolah from "../imports/logo_sekolah-1.png";

type DashSection =
  | "overview" | "articles"
  | "hero" | "school" | "stats" | "programs"
  | "facilities" | "extracurriculars" | "partners" | "spmb"
  | "users";

interface Props {
  data: CMSData;
  isAdmin: boolean;
  currentUser: BlogUser | null;
  users: BlogUser[];
  articles: Article[];
  onCmsLogin: (password: string) => boolean;
  onCmsLogout: () => void;
  onBlogLogin: (username: string, password: string) => boolean;
  onBlogLogout: () => void;
  onUpdate: <K extends keyof CMSData>(section: K, value: CMSData[K]) => void;
  onReset: () => void;
  onAddUser: (username: string, displayName: string, password: string, role: "admin" | "author") => void;
  onRemoveUser: (id: string) => void;
  onUpdatePassword: (id: string, password: string) => void;
  onDeleteArticle: (id: string) => void;
  onGoHome: () => void;
  onGoEditor: (article?: Article) => void;
}

function Field({
  label, value, onChange, textarea, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3} value={value} onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value} onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SectionWrap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6" style={{ fontFamily: "'Fraunces', serif" }}>{title}</h2>
      {children}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/* ── Login Screen ─────────────────────────────────────────────── */
function LoginScreen({ onCmsLogin, onBlogLogin }: {
  onCmsLogin: (p: string) => boolean;
  onBlogLogin: (u: string, p: string) => boolean;
}) {
  const [adminPwd, setAdminPwd] = useState("");
  const [adminErr, setAdminErr] = useState(false);
  const [blogUser, setBlogUser] = useState("");
  const [blogPwd, setBlogPwd] = useState("");
  const [blogErr, setBlogErr] = useState(false);

  function submitAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!onCmsLogin(adminPwd)) setAdminErr(true);
    else setAdminErr(false);
  }

  function submitBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!onBlogLogin(blogUser, blogPwd)) setBlogErr(true);
    else setBlogErr(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3 mb-10">
        <img src={logoSekolah} alt="Logo" className="w-12 h-12 object-contain" />
        <div>
          <div className="font-bold text-slate-900 text-lg leading-tight">SMKN Pringsurat</div>
          <div className="text-xs text-blue-600 font-semibold">Dashboard Admin</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Admin CMS */}
        <form onSubmit={submitAdmin} className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-2xl mx-auto mb-3">⚙️</div>
            <h2 className="font-bold text-slate-900 text-base">Admin CMS</h2>
            <p className="text-slate-400 text-xs mt-1">Kelola konten & pengaturan website</p>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password Admin</label>
            <input
              type="password"
              value={adminPwd}
              onChange={(e) => { setAdminPwd(e.target.value); setAdminErr(false); }}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${adminErr ? "border-red-400 bg-red-50" : "border-slate-200"}`}
              placeholder="Masukkan password admin"
            />
          </div>
          {adminErr && <p className="text-red-500 text-xs mb-3 text-center">Password salah.</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors">
            Masuk sebagai Admin
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-3">Password default: smkn2025</p>
        </form>

        {/* Blog Author */}
        <form onSubmit={submitBlog} className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl mx-auto mb-3">✏️</div>
            <h2 className="font-bold text-slate-900 text-base">Penulis Blog</h2>
            <p className="text-slate-400 text-xs mt-1">Masuk untuk menulis & kelola artikel</p>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              value={blogUser}
              onChange={(e) => { setBlogUser(e.target.value); setBlogErr(false); }}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${blogErr ? "border-red-400 bg-red-50" : "border-slate-200"}`}
              placeholder="Username penulis"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={blogPwd}
              onChange={(e) => { setBlogPwd(e.target.value); setBlogErr(false); }}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${blogErr ? "border-red-400 bg-red-50" : "border-slate-200"}`}
              placeholder="Password"
            />
          </div>
          {blogErr && <p className="text-red-500 text-xs mb-3 text-center">Username atau password salah.</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
            Masuk sebagai Penulis
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-3">Demo: budi / guru123 atau sari / guru123</p>
        </form>
      </div>

      <button onClick={() => window.history.back()} className="mt-8 text-xs text-slate-400 hover:text-slate-600 transition-colors">
        ← Kembali ke Website
      </button>
    </div>
  );
}

/* ── CMS Sections ─────────────────────────────────────────────── */
function HeroSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const h = data.hero;
  function set(key: keyof CMSData["hero"], val: string) {
    onUpdate("hero", { ...h, [key]: val });
  }
  return (
    <SectionWrap title="Hero Section">
      <Field label="Badge" value={h.badge} onChange={(v) => set("badge", v)} />
      <Field label="Teks Italic" value={h.titleItalic} onChange={(v) => set("titleItalic", v)} />
      <Field label="Baris 2" value={h.title2} onChange={(v) => set("title2", v)} />
      <Field label="Baris 3" value={h.title3} onChange={(v) => set("title3", v)} />
      <Field label="Subjudul" value={h.subtitle} onChange={(v) => set("subtitle", v)} textarea />
      <Field label="Tombol Utama" value={h.cta1} onChange={(v) => set("cta1", v)} />
      <Field label="Tombol Sekunder" value={h.cta2} onChange={(v) => set("cta2", v)} />
      <Field label="URL Foto Latar" value={h.backgroundImage} onChange={(v) => set("backgroundImage", v)} />
    </SectionWrap>
  );
}

function SchoolSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const s = data.school;
  function set(key: keyof CMSData["school"], val: string) {
    onUpdate("school", { ...s, [key]: val });
  }
  return (
    <SectionWrap title="Info Sekolah">
      <Field label="Nama Sekolah" value={s.name} onChange={(v) => set("name", v)} />
      <Field label="Tagline" value={s.tagline} onChange={(v) => set("tagline", v)} />
      <Field label="Kepala Sekolah" value={s.principal} onChange={(v) => set("principal", v)} />
      <Field label="Alamat" value={s.address} onChange={(v) => set("address", v)} textarea />
      <Field label="Telepon" value={s.phone} onChange={(v) => set("phone", v)} />
      <Field label="Website" value={s.website} onChange={(v) => set("website", v)} />
    </SectionWrap>
  );
}

function StatsSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const stats = data.stats;
  function setItem(idx: number, key: "value" | "label", val: string) {
    const next = stats.map((s, i) => i === idx ? { ...s, [key]: val } : s);
    onUpdate("stats", next);
  }
  return (
    <SectionWrap title="Statistik">
      {stats.map((s, i) => (
        <div key={s.id} className="flex gap-3 mb-3">
          <div className="flex-1">
            <Field label={`Nilai ${i + 1}`} value={s.value} onChange={(v) => setItem(i, "value", v)} />
          </div>
          <div className="flex-[2]">
            <Field label={`Label ${i + 1}`} value={s.label} onChange={(v) => setItem(i, "label", v)} />
          </div>
        </div>
      ))}
    </SectionWrap>
  );
}

function ProgramsSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const programs = data.programs;
  function setItem(idx: number, key: keyof Program, val: string) {
    const next = programs.map((p, i) => i === idx ? { ...p, [key]: val } : p);
    onUpdate("programs", next);
  }
  function addProgram() {
    onUpdate("programs", [...programs, { code: "BARU", name: "Program Baru", desc: "", icon: "📚", color: "from-blue-600 to-blue-800" }]);
  }
  function removeProgram(idx: number) {
    onUpdate("programs", programs.filter((_, i) => i !== idx));
  }
  return (
    <SectionWrap title="Program Keahlian">
      {programs.map((p, i) => (
        <div key={i} className="border border-slate-100 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-700">{p.code} — {p.icon}</span>
            <button onClick={() => removeProgram(i)} className="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kode" value={p.code} onChange={(v) => setItem(i, "code", v)} />
            <Field label="Ikon" value={p.icon} onChange={(v) => setItem(i, "icon", v)} />
          </div>
          <Field label="Nama Program" value={p.name} onChange={(v) => setItem(i, "name", v)} />
          <Field label="Deskripsi" value={p.desc} onChange={(v) => setItem(i, "desc", v)} textarea />
          <Field label="Warna (Tailwind gradient)" value={p.color} onChange={(v) => setItem(i, "color", v)} />
        </div>
      ))}
      <button onClick={addProgram} className="w-full py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors">
        + Tambah Program
      </button>
    </SectionWrap>
  );
}

function FacilitiesSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const facilities = data.facilities;
  function setItem(idx: number, key: keyof Facility, val: string) {
    const next = facilities.map((f, i) => i === idx ? { ...f, [key]: val } : f);
    onUpdate("facilities", next);
  }
  function addFacility() {
    onUpdate("facilities", [...facilities, { id: Date.now().toString(), name: "Fasilitas Baru", icon: "🏫", desc: "" }]);
  }
  function removeFacility(idx: number) {
    onUpdate("facilities", facilities.filter((_, i) => i !== idx));
  }
  return (
    <SectionWrap title="Fasilitas">
      {facilities.map((f, i) => (
        <div key={f.id} className="border border-slate-100 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-700">{f.icon} {f.name}</span>
            <button onClick={() => removeFacility(i)} className="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama" value={f.name} onChange={(v) => setItem(i, "name", v)} />
            <Field label="Ikon" value={f.icon} onChange={(v) => setItem(i, "icon", v)} />
          </div>
          <Field label="Deskripsi" value={f.desc} onChange={(v) => setItem(i, "desc", v)} textarea />
        </div>
      ))}
      <button onClick={addFacility} className="w-full py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors">
        + Tambah Fasilitas
      </button>
    </SectionWrap>
  );
}

function ExtracurricularsSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const list = data.extracurriculars;
  function setItem(idx: number, val: string) {
    onUpdate("extracurriculars", list.map((e, i) => i === idx ? val : e));
  }
  function removeItem(idx: number) { onUpdate("extracurriculars", list.filter((_, i) => i !== idx)); }
  function addItem() { onUpdate("extracurriculars", [...list, "🎯 Ekstrakurikuler Baru"]); }
  return (
    <SectionWrap title="Ekstrakurikuler">
      {list.map((e, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text" value={e}
            onChange={(ev) => setItem(i, ev.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={() => removeItem(i)} className="px-3 py-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 text-sm transition-colors">✕</button>
        </div>
      ))}
      <button onClick={addItem} className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors">
        + Tambah
      </button>
    </SectionWrap>
  );
}

function PartnersSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const list = data.partners;
  function setItem(idx: number, val: string) { onUpdate("partners", list.map((p, i) => i === idx ? val : p)); }
  function removeItem(idx: number) { onUpdate("partners", list.filter((_, i) => i !== idx)); }
  function addItem() { onUpdate("partners", [...list, "Mitra Baru"]); }
  return (
    <SectionWrap title="Mitra Kerja">
      {list.map((p, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text" value={p}
            onChange={(ev) => setItem(i, ev.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={() => removeItem(i)} className="px-3 py-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 text-sm transition-colors">✕</button>
        </div>
      ))}
      <button onClick={addItem} className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors">
        + Tambah Mitra
      </button>
    </SectionWrap>
  );
}

function SpmbSection({ data, onUpdate }: { data: CMSData; onUpdate: Props["onUpdate"] }) {
  const s = data.spmb;
  function set(key: keyof CMSData["spmb"], val: string) { onUpdate("spmb", { ...s, [key]: val }); }
  return (
    <SectionWrap title="SPMB">
      <Field label="Badge" value={s.badge} onChange={(v) => set("badge", v)} />
      <Field label="Jumlah Pendaftar" value={s.applicants} onChange={(v) => set("applicants", v)} />
      <Field label="Subjudul" value={s.subtitle} onChange={(v) => set("subtitle", v)} textarea />
      <Field label="Tombol Utama" value={s.cta1} onChange={(v) => set("cta1", v)} />
      <Field label="Tombol Sekunder" value={s.cta2} onChange={(v) => set("cta2", v)} />
    </SectionWrap>
  );
}

function UsersSection({ users, onAddUser, onRemoveUser, onUpdatePassword, articles }: {
  users: BlogUser[];
  articles: Article[];
  onAddUser: Props["onAddUser"];
  onRemoveUser: Props["onRemoveUser"];
  onUpdatePassword: Props["onUpdatePassword"];
}) {
  const [form, setForm] = useState({ username: "", displayName: "", password: "", role: "author" as "admin" | "author" });
  const [newPwd, setNewPwd] = useState<Record<string, string>>({});

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.displayName || !form.password) return;
    onAddUser(form.username, form.displayName, form.password, form.role);
    setForm({ username: "", displayName: "", password: "", role: "author" });
  }

  return (
    <div className="space-y-6">
      <SectionWrap title="Daftar Pengguna Blog">
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl">
              <div className={`w-9 h-9 rounded-full ${u.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                {u.displayName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 text-sm">{u.displayName}</div>
                <div className="text-xs text-slate-400">@{u.username} · {u.role} · {articles.filter((a) => a.authorId === u.id).length} artikel</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Password baru"
                  value={newPwd[u.id] ?? ""}
                  onChange={(e) => setNewPwd((prev) => ({ ...prev, [u.id]: e.target.value }))}
                  className="w-28 px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => { if (newPwd[u.id]) { onUpdatePassword(u.id, newPwd[u.id]); setNewPwd((prev) => ({ ...prev, [u.id]: "" })); } }}
                  className="px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  Simpan
                </button>
                <button
                  onClick={() => { if (confirm(`Hapus ${u.displayName}?`)) onRemoveUser(u.id); }}
                  className="px-2 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionWrap>

      <SectionWrap title="Tambah Pengguna Baru">
        <form onSubmit={submitAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username" value={form.username} onChange={(v) => setForm((f) => ({ ...f, username: v }))} />
            <Field label="Nama Tampil" value={form.displayName} onChange={(v) => setForm((f) => ({ ...f, displayName: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} type="password" />
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "author" }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="author">Penulis</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors">
            Tambah Pengguna
          </button>
        </form>
      </SectionWrap>
    </div>
  );
}

function ArticlesSection({ articles, users, currentUser, isAdmin, onDeleteArticle, onGoEditor }: {
  articles: Article[];
  users: BlogUser[];
  currentUser: BlogUser | null;
  isAdmin: boolean;
  onDeleteArticle: (id: string) => void;
  onGoEditor: (article?: Article) => void;
}) {
  const visible = isAdmin ? articles : articles.filter((a) => a.authorId === currentUser?.id);
  const sorted = [...visible].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <SectionWrap title="Kelola Artikel">
      <div className="flex justify-between items-center mb-5">
        <span className="text-sm text-slate-500">{sorted.length} artikel{isAdmin ? "" : " milik Anda"}</span>
        <button
          onClick={() => onGoEditor()}
          className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
        >
          ✏️ Tulis Baru
        </button>
      </div>
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">Belum ada artikel.</div>
      ) : (
        <div className="space-y-2">
          {sorted.map((a) => {
            const author = users.find((u) => u.id === a.authorId);
            const canEdit = isAdmin || a.authorId === currentUser?.id;
            return (
              <div key={a.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:border-blue-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {a.coverImage && <img src={a.coverImage} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{a.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {author?.displayName ?? a.authorName} · {formatDate(a.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${a.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {a.published ? "Terbit" : "Draft"}
                  </span>
                  {canEdit && (
                    <>
                      <button onClick={() => onGoEditor(a)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors">Edit</button>
                      <button onClick={() => { if (confirm("Hapus artikel ini?")) onDeleteArticle(a.id); }} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors">Hapus</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionWrap>
  );
}

function Overview({ data, users, articles, isAdmin, currentUser, onGoEditor, setSection }: {
  data: CMSData;
  users: BlogUser[];
  articles: Article[];
  isAdmin: boolean;
  currentUser: BlogUser | null;
  onGoEditor: (article?: Article) => void;
  setSection: (s: DashSection) => void;
}) {
  const published = articles.filter((a) => a.published);
  const drafts = articles.filter((a) => !a.published);
  const myArticles = articles.filter((a) => a.authorId === currentUser?.id);
  const recent = [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const name = currentUser?.displayName ?? "Admin";

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className={`grid gap-4 ${isAdmin ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2"}`}>
        {isAdmin ? (
          <>
            <div className="bg-blue-700 rounded-2xl p-5 text-white">
              <div className="text-3xl font-black mb-1">{articles.length}</div>
              <div className="text-sm font-semibold text-blue-100">Total Artikel</div>
              <div className="text-xs text-blue-200 mt-0.5">{published.length} terbit · {drafts.length} draft</div>
            </div>
            <div className="bg-violet-700 rounded-2xl p-5 text-white">
              <div className="text-3xl font-black mb-1">{users.length}</div>
              <div className="text-sm font-semibold text-violet-100">Penulis Blog</div>
            </div>
            <div className="bg-indigo-700 rounded-2xl p-5 text-white">
              <div className="text-3xl font-black mb-1">{data.programs.length}</div>
              <div className="text-sm font-semibold text-indigo-100">Program Keahlian</div>
            </div>
            <div className="bg-cyan-700 rounded-2xl p-5 text-white">
              <div className="text-3xl font-black mb-1">{data.facilities.length}</div>
              <div className="text-sm font-semibold text-cyan-100">Fasilitas</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-700 rounded-2xl p-5 text-white">
              <div className="text-3xl font-black mb-1">{myArticles.length}</div>
              <div className="text-sm font-semibold text-blue-100">Artikel Saya</div>
              <div className="text-xs text-blue-200 mt-0.5">{myArticles.filter((a) => a.published).length} terbit</div>
            </div>
            <div className="bg-violet-700 rounded-2xl p-5 text-white">
              <div className="text-3xl font-black mb-1">{myArticles.filter((a) => !a.published).length}</div>
              <div className="text-sm font-semibold text-violet-100">Draft</div>
            </div>
          </>
        )}
      </div>

      <div className={`grid gap-6 ${isAdmin ? "lg:grid-cols-3" : ""}`}>
        {/* Recent articles */}
        <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden ${isAdmin ? "lg:col-span-2" : ""}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Artikel Terbaru</h2>
            <button onClick={() => setSection("articles")} className="text-xs text-blue-600 font-semibold hover:text-blue-800">Kelola semua →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recent.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">Belum ada artikel.</div>
            ) : (
              recent.map((a) => (
                <div key={a.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    {a.coverImage && <img src={a.coverImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm truncate">{a.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{a.authorName} · {formatDate(a.createdAt)}</div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${a.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {a.published ? "Terbit" : "Draft"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: admin sees quick actions, author sees write prompt */}
        {isAdmin ? (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="font-bold text-slate-800 mb-4">Aksi Cepat</h2>
              <div className="space-y-2">
                {[
                  { icon: "✏️", label: "Tulis Artikel Baru", desc: "Tambah konten blog", action: () => onGoEditor() },
                  { icon: "🖼️", label: "Edit Hero", desc: "Judul & foto latar", action: () => setSection("hero") },
                  { icon: "🏫", label: "Info Sekolah", desc: "Nama, alamat, kontak", action: () => setSection("school") },
                  { icon: "👥", label: "Kelola Penulis", desc: "Akun blog", action: () => setSection("users") },
                  { icon: "🎓", label: "Edit SPMB", desc: "Penerimaan siswa", action: () => setSection("spmb") },
                ].map((item) => (
                  <button key={item.label} onClick={item.action} className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-lg transition-colors shrink-0">{item.icon}</div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="font-bold text-slate-800 mb-3">Info Sekolah Aktif</h2>
              <div className="space-y-2">
                {[
                  { label: "Kepala Sekolah", value: data.school.principal },
                  { label: "Telepon", value: data.school.phone },
                  { label: "Website", value: data.school.website },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl px-3 py-2.5">
                    <div className="text-[11px] text-slate-400">{item.label}</div>
                    <div className="text-sm font-medium text-slate-800 truncate">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">✏️</div>
            <div>
              <div className="font-bold text-slate-900 mb-1">Siap Menulis?</div>
              <div className="text-sm text-slate-400">Bagikan cerita, berita, atau kegiatan sekolah Anda</div>
            </div>
            <button onClick={() => onGoEditor()} className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors">
              Tulis Artikel Baru
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Penulis Blog</h2>
            <button onClick={() => setSection("users")} className="text-xs text-blue-600 font-semibold hover:text-blue-800">Kelola →</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className={`w-9 h-9 rounded-full ${u.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {u.displayName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{u.displayName}</div>
                  <div className="text-xs text-slate-400">@{u.username} · {articles.filter((a) => a.authorId === u.id).length} artikel</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Dashboard ───────────────────────────────────────────── */
export default function Dashboard({
  data, isAdmin, currentUser, users, articles,
  onCmsLogin, onCmsLogout, onBlogLogin, onBlogLogout,
  onUpdate, onReset, onAddUser, onRemoveUser, onUpdatePassword,
  onDeleteArticle, onGoHome, onGoEditor,
}: Props) {
  const [section, setSection] = useState<DashSection>("overview");

  const isAuthenticated = isAdmin || !!currentUser;

  if (!isAuthenticated) {
    return <LoginScreen onCmsLogin={onCmsLogin} onBlogLogin={onBlogLogin} />;
  }

  function logout() {
    if (isAdmin) onCmsLogout();
    else { onBlogLogout(); }
  }

  const adminNavItems: { icon: string; label: string; key: DashSection }[] = [
    { icon: "🏠", label: "Ringkasan", key: "overview" },
    { icon: "📝", label: "Kelola Artikel", key: "articles" },
    { icon: "🖼️", label: "Hero Section", key: "hero" },
    { icon: "🏫", label: "Info Sekolah", key: "school" },
    { icon: "📊", label: "Statistik", key: "stats" },
    { icon: "📚", label: "Program Keahlian", key: "programs" },
    { icon: "🏀", label: "Fasilitas", key: "facilities" },
    { icon: "🎖️", label: "Ekstrakulikuler", key: "extracurriculars" },
    { icon: "🤝", label: "Mitra", key: "partners" },
    { icon: "🎓", label: "SPMB", key: "spmb" },
    { icon: "👥", label: "Pengguna Blog", key: "users" },
  ];

  const authorNavItems: { icon: string; label: string; key: DashSection }[] = [
    { icon: "🏠", label: "Ringkasan", key: "overview" },
    { icon: "📝", label: "Artikel Saya", key: "articles" },
  ];

  const navItems = isAdmin ? adminNavItems : authorNavItems;
  const displayName = isAdmin
    ? (users.find((u) => u.role === "admin")?.displayName ?? "Admin")
    : (currentUser?.displayName ?? "");
  const roleLabel = isAdmin ? "Administrator" : "Penulis";
  const avatarColor = isAdmin ? "bg-blue-700" : (currentUser?.color ?? "bg-violet-600");

  function renderContent() {
    switch (section) {
      case "overview":
        return <Overview data={data} users={users} articles={articles} isAdmin={isAdmin} currentUser={currentUser} onGoEditor={onGoEditor} setSection={setSection} />;
      case "articles":
        return <ArticlesSection articles={articles} users={users} currentUser={currentUser} isAdmin={isAdmin} onDeleteArticle={onDeleteArticle} onGoEditor={onGoEditor} />;
      case "hero": return isAdmin ? <HeroSection data={data} onUpdate={onUpdate} /> : null;
      case "school": return isAdmin ? <SchoolSection data={data} onUpdate={onUpdate} /> : null;
      case "stats": return isAdmin ? <StatsSection data={data} onUpdate={onUpdate} /> : null;
      case "programs": return isAdmin ? <ProgramsSection data={data} onUpdate={onUpdate} /> : null;
      case "facilities": return isAdmin ? <FacilitiesSection data={data} onUpdate={onUpdate} /> : null;
      case "extracurriculars": return isAdmin ? <ExtracurricularsSection data={data} onUpdate={onUpdate} /> : null;
      case "partners": return isAdmin ? <PartnersSection data={data} onUpdate={onUpdate} /> : null;
      case "spmb": return isAdmin ? <SpmbSection data={data} onUpdate={onUpdate} /> : null;
      case "users": return isAdmin ? <UsersSection users={users} articles={articles} onAddUser={onAddUser} onRemoveUser={onRemoveUser} onUpdatePassword={onUpdatePassword} /> : null;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src={logoSekolah} alt="Logo" className="w-9 h-9 object-contain" />
            <div>
              <div className="font-bold text-slate-900 text-sm leading-tight">SMKN Pringsurat</div>
              <div className="text-[11px] text-blue-600 font-semibold">{roleLabel} Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${section === item.key ? "bg-blue-700 text-white" : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-800 truncate">{displayName}</div>
              <div className="text-[11px] text-slate-400">{roleLabel}</div>
            </div>
          </div>
          <button onClick={onGoHome} className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors">🌐 Lihat Website</button>
          {isAdmin && (
            <button onClick={() => { if (confirm("Reset semua konten ke default?")) onReset(); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">↺ Reset ke Default</button>
          )}
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors">← Keluar</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
              {navItems.find((n) => n.key === section)?.label ?? "Dashboard"}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Selamat datang, {displayName} · {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={() => onGoEditor()} className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm">
            ✏️ Tulis Artikel
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
