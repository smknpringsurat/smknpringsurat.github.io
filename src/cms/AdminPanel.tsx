import { useState } from "react";
import { CMSData, Facility } from "./data";
import { BlogUser } from "../blog/types";

type Section =
  | "hero"
  | "school"
  | "stats"
  | "programs"
  | "facilities"
  | "extracurriculars"
  | "partners"
  | "spmb"
  | "users";

interface Props {
  data: CMSData;
  onUpdate: <K extends keyof CMSData>(section: K, value: CMSData[K]) => void;
  onLogout: () => void;
  onReset: () => void;
  users: BlogUser[];
  onAddUser: (username: string, displayName: string, password: string, role: "admin" | "author") => void;
  onRemoveUser: (id: string) => void;
  onUpdatePassword: (id: string, password: string) => void;
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SectionBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

export default function AdminPanel({
  data,
  onUpdate,
  onLogout,
  onReset,
  users,
  onAddUser,
  onRemoveUser,
  onUpdatePassword,
}: Props) {
  const [active, setActive] = useState<Section>("hero");
  const [saved, setSaved] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", displayName: "", password: "", role: "author" as "admin" | "author" });
  const [editingPw, setEditingPw] = useState<{ id: string; pw: string } | null>(null);

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function patch<K extends keyof CMSData>(section: K, key: string, val: string) {
    onUpdate(section, { ...(data[section] as object), [key]: val } as CMSData[K]);
    flash();
  }

  /* ── Facilities ── */
  function updateFac(items: Facility[]) { onUpdate("facilities", items); flash(); }
  function addFac() {
    updateFac([...data.facilities, { id: Date.now().toString(), name: "Fasilitas Baru", icon: "🏫", desc: "Deskripsi fasilitas." }]);
  }
  function removeFac(id: string) { updateFac(data.facilities.filter((f) => f.id !== id)); }
  function patchFac(id: string, key: keyof Facility, val: string) {
    updateFac(data.facilities.map((f) => (f.id === id ? { ...f, [key]: val } : f)));
  }

  /* ── Ekskul ── */
  function patchEkskul(idx: number, val: string) {
    const next = [...data.extracurriculars]; next[idx] = val; onUpdate("extracurriculars", next); flash();
  }
  function addEkskul() { onUpdate("extracurriculars", [...data.extracurriculars, "🏆 Ekskul Baru"]); flash(); }
  function removeEkskul(idx: number) { onUpdate("extracurriculars", data.extracurriculars.filter((_, i) => i !== idx)); flash(); }

  /* ── Partners ── */
  function patchPartner(idx: number, val: string) {
    const next = [...data.partners]; next[idx] = val; onUpdate("partners", next); flash();
  }
  function addPartner() { onUpdate("partners", [...data.partners, "Mitra Baru"]); flash(); }
  function removePartner(idx: number) { onUpdate("partners", data.partners.filter((_, i) => i !== idx)); flash(); }

  const sections: { key: Section; label: string }[] = [
    { key: "hero", label: "🖼️ Hero" },
    { key: "school", label: "🏫 Info Sekolah" },
    { key: "stats", label: "📊 Statistik" },
    { key: "programs", label: "📚 Program" },
    { key: "facilities", label: "🏀 Fasilitas" },
    { key: "extracurriculars", label: "🎖️ Ekskul" },
    { key: "partners", label: "🤝 Mitra" },
    { key: "spmb", label: "🎓 SPMB" },
    { key: "users", label: "👥 Pengguna Blog" },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-[200] flex shadow-2xl" style={{ width: "420px" }}>
      {/* Nav */}
      <div className="w-48 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-widest">Admin CMS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">SMKN Pringsurat</div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {sections.map((s) => (
            <SectionBtn key={s.key} label={s.label} active={active === s.key} onClick={() => setActive(s.key)} />
          ))}
        </nav>
        <div className="px-2 py-3 border-t border-slate-100 space-y-1">
          {saved && <div className="text-center text-xs text-green-600 font-semibold py-1">✓ Tersimpan</div>}
          <button
            onClick={() => { if (confirm("Reset semua konten ke default?")) onReset(); }}
            className="w-full px-3 py-2 text-xs rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            Reset Default
          </button>
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 text-xs rounded-lg text-slate-500 hover:bg-slate-100 font-medium transition-colors"
          >
            Keluar Admin
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="p-5">

          {/* HERO */}
          {active === "hero" && (
            <div>
              <h2 className="font-bold text-slate-800 mb-5">Hero Section</h2>
              <Field label="Badge" value={data.hero.badge} onChange={(v) => patch("hero", "badge", v)} />
              <Field label="Judul italic" value={data.hero.titleItalic} onChange={(v) => patch("hero", "titleItalic", v)} />
              <Field label="Judul baris 2" value={data.hero.title2} onChange={(v) => patch("hero", "title2", v)} />
              <Field label="Judul baris 3" value={data.hero.title3} onChange={(v) => patch("hero", "title3", v)} />
              <Field label="Subjudul" value={data.hero.subtitle} onChange={(v) => patch("hero", "subtitle", v)} textarea />
              <Field label="Tombol utama" value={data.hero.cta1} onChange={(v) => patch("hero", "cta1", v)} />
              <Field label="Tombol sekunder" value={data.hero.cta2} onChange={(v) => patch("hero", "cta2", v)} />
              <Field label="URL foto latar" value={data.hero.backgroundImage} onChange={(v) => patch("hero", "backgroundImage", v)} />
            </div>
          )}

          {/* SCHOOL */}
          {active === "school" && (
            <div>
              <h2 className="font-bold text-slate-800 mb-5">Info Sekolah</h2>
              <Field label="Nama sekolah" value={data.school.name} onChange={(v) => patch("school", "name", v)} />
              <Field label="Tagline" value={data.school.tagline} onChange={(v) => patch("school", "tagline", v)} />
              <Field label="Kepala sekolah" value={data.school.principal} onChange={(v) => patch("school", "principal", v)} />
              <Field label="Alamat" value={data.school.address} onChange={(v) => patch("school", "address", v)} textarea />
              <Field label="Telepon" value={data.school.phone} onChange={(v) => patch("school", "phone", v)} />
              <Field label="Website" value={data.school.website} onChange={(v) => patch("school", "website", v)} />
            </div>
          )}

          {/* STATS */}
          {active === "stats" && (
            <div>
              <h2 className="font-bold text-slate-800 mb-5">Statistik Hero</h2>
              {data.stats.map((s) => (
                <div key={s.id} className="mb-5 p-4 bg-white rounded-xl border border-slate-200">
                  <Field label="Angka" value={s.value} onChange={(v) => { onUpdate("stats", data.stats.map((x) => x.id === s.id ? { ...x, value: v } : x)); flash(); }} />
                  <Field label="Keterangan" value={s.label} onChange={(v) => { onUpdate("stats", data.stats.map((x) => x.id === s.id ? { ...x, label: v } : x)); flash(); }} />
                </div>
              ))}
            </div>
          )}

          {/* PROGRAMS */}
          {active === "programs" && (
            <div>
              <h2 className="font-bold text-slate-800 mb-5">Program Keahlian</h2>
              {data.programs.map((p, i) => (
                <div key={p.code} className="mb-5 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-blue-700 uppercase mb-3">{p.code}</div>
                  <Field label="Nama program" value={p.name} onChange={(v) => { const n = [...data.programs]; n[i] = { ...n[i], name: v }; onUpdate("programs", n); flash(); }} />
                  <Field label="Deskripsi" value={p.desc} textarea onChange={(v) => { const n = [...data.programs]; n[i] = { ...n[i], desc: v }; onUpdate("programs", n); flash(); }} />
                  <Field label="Ikon (emoji)" value={p.icon} onChange={(v) => { const n = [...data.programs]; n[i] = { ...n[i], icon: v }; onUpdate("programs", n); flash(); }} />
                </div>
              ))}
            </div>
          )}

          {/* FACILITIES */}
          {active === "facilities" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-800">Fasilitas</h2>
                <button onClick={addFac} className="px-3 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors">+ Tambah</button>
              </div>
              {data.facilities.map((f) => (
                <div key={f.id} className="mb-5 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeFac(f.id)} className="text-xs text-red-500 hover:text-red-700">Hapus</button>
                  </div>
                  <Field label="Ikon" value={f.icon} onChange={(v) => patchFac(f.id, "icon", v)} />
                  <Field label="Nama" value={f.name} onChange={(v) => patchFac(f.id, "name", v)} />
                  <Field label="Deskripsi" value={f.desc} textarea onChange={(v) => patchFac(f.id, "desc", v)} />
                </div>
              ))}
            </div>
          )}

          {/* EKSKUL */}
          {active === "extracurriculars" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-800">Ekstrakulikuler</h2>
                <button onClick={addEkskul} className="px-3 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors">+ Tambah</button>
              </div>
              {data.extracurriculars.map((e, i) => (
                <div key={i} className="flex items-center gap-2 mb-3">
                  <input type="text" value={e} onChange={(ev) => patchEkskul(i, ev.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => removeEkskul(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>
                </div>
              ))}
            </div>
          )}

          {/* PARTNERS */}
          {active === "partners" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-800">Mitra Industri</h2>
                <button onClick={addPartner} className="px-3 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors">+ Tambah</button>
              </div>
              {data.partners.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-3">
                  <input type="text" value={p} onChange={(ev) => patchPartner(i, ev.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => removePartner(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>
                </div>
              ))}
            </div>
          )}

          {/* SPMB */}
          {active === "spmb" && (
            <div>
              <h2 className="font-bold text-slate-800 mb-5">SPMB Section</h2>
              <Field label="Badge" value={data.spmb.badge} onChange={(v) => patch("spmb", "badge", v)} />
              <Field label="Jumlah pendaftar" value={data.spmb.applicants} onChange={(v) => patch("spmb", "applicants", v)} />
              <Field label="Subjudul" value={data.spmb.subtitle} textarea onChange={(v) => patch("spmb", "subtitle", v)} />
              <Field label="Tombol utama" value={data.spmb.cta1} onChange={(v) => patch("spmb", "cta1", v)} />
              <Field label="Tombol sekunder" value={data.spmb.cta2} onChange={(v) => patch("spmb", "cta2", v)} />
            </div>
          )}

          {/* USERS */}
          {active === "users" && (
            <div>
              <h2 className="font-bold text-slate-800 mb-2">Pengguna Blog</h2>
              <p className="text-xs text-slate-400 mb-5">Kelola akun penulis yang dapat membuat artikel di blog sekolah.</p>

              {/* User list */}
              <div className="space-y-3 mb-6">
                {users.map((u) => (
                  <div key={u.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-full ${u.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {u.displayName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 text-sm truncate">{u.displayName}</div>
                        <div className="text-xs text-slate-400">@{u.username} · <span className="capitalize">{u.role}</span></div>
                      </div>
                      {u.id !== "admin" && (
                        <button
                          onClick={() => { if (confirm(`Hapus pengguna ${u.displayName}?`)) onRemoveUser(u.id); }}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    {editingPw?.id === u.id ? (
                      <div className="flex gap-2">
                        <input
                          type="password"
                          placeholder="Password baru..."
                          value={editingPw.pw}
                          onChange={(e) => setEditingPw({ ...editingPw, pw: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => { onUpdatePassword(u.id, editingPw.pw); setEditingPw(null); flash(); }}
                          className="px-3 py-1.5 bg-blue-700 text-white text-xs rounded-lg font-semibold hover:bg-blue-800"
                        >
                          Simpan
                        </button>
                        <button onClick={() => setEditingPw(null)} className="text-slate-400 text-xs">Batal</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingPw({ id: u.id, pw: "" })}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ubah password
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add user form */}
              <div className="bg-white rounded-xl border border-dashed border-blue-200 p-4">
                <h3 className="font-semibold text-slate-800 text-sm mb-4">Tambah Pengguna Baru</h3>
                <Field label="Username" value={newUser.username} onChange={(v) => setNewUser({ ...newUser, username: v })} />
                <Field label="Nama lengkap" value={newUser.displayName} onChange={(v) => setNewUser({ ...newUser, displayName: v })} />
                <Field label="Password" value={newUser.password} onChange={(v) => setNewUser({ ...newUser, password: v })} />
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "author" })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="author">Author (penulis)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (!newUser.username || !newUser.displayName || !newUser.password) return;
                    onAddUser(newUser.username, newUser.displayName, newUser.password, newUser.role);
                    setNewUser({ username: "", displayName: "", password: "", role: "author" });
                    flash();
                  }}
                  className="w-full py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
                >
                  Tambah Pengguna
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
