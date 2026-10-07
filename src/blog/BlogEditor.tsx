import { useRef, useState } from "react";
import { Article, ARTICLE_TAGS, BlogUser } from "./types";
import ImageUploader from "./ImageUploader";
import { renderContent } from "./contentRenderer";

interface Props {
  initial?: Article | null;
  currentUser: BlogUser;
  onSave: (data: Omit<Article, "id" | "createdAt">) => void;
  onCancel: () => void;
}

function compressImage(file: File, maxWidth = 1200, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("no ctx")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(); };
    img.src = objectUrl;
  });
}

export default function BlogEditor({ initial, currentUser, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(
    initial?.coverImage ??
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=630&fit=crop&auto=format"
  );
  const [tag, setTag] = useState(initial?.tag ?? ARTICLE_TAGS[0]);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [preview, setPreview] = useState(false);

  type InsertPanel = "image" | "pdf" | "youtube" | "instagram" | null;

  /* ── Inline insert panel state ── */
  const [insertPanel, setInsertPanel] = useState<InsertPanel>(null);
  const [inlineTab, setInlineTab] = useState<"upload" | "url">("upload");
  const [inlineUrl, setInlineUrl] = useState("");
  const [inlineLoading, setInlineLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // derive from old name for compatibility
  const showInlineImg = insertPanel === "image";

  function insertMarker(type: string, src: string) {
    const marker = `\n[${type}:${src}]\n`;
    const ta = textareaRef.current;
    if (!ta) { setContent((c) => c + marker); return; }
    const start = ta.selectionStart;
    const before = content.slice(0, start);
    const after = content.slice(ta.selectionEnd);
    const newContent = before + marker + after;
    setContent(newContent);
    setInsertPanel(null);
    setInlineUrl("");
    setInlineError("");
    setTimeout(() => {
      ta.focus();
      const pos = (before + marker).length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  }

  function insertImageTag(src: string) { insertMarker("gambar", src); }

  async function handleInlineFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setInlineError("File harus gambar."); return; }
    if (file.size > 10 * 1024 * 1024) { setInlineError("Maks. 10 MB."); return; }
    setInlineError("");
    setInlineLoading(true);
    try {
      const dataUrl = await compressImage(file);
      insertImageTag(dataUrl);
    } catch {
      setInlineError("Gagal memproses gambar.");
    } finally {
      setInlineLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handlePdfFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setInlineError("File harus PDF."); return; }
    if (file.size > 20 * 1024 * 1024) { setInlineError("Maks. 20 MB."); return; }
    setInlineError("");
    setInlineLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      insertMarker("pdf", dataUrl);
    } catch {
      setInlineError("Gagal membaca file PDF.");
    } finally {
      setInlineLoading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  }

  function handleInlineUrl() {
    if (!inlineUrl.trim()) return;
    if (insertPanel === "image") insertMarker("gambar", inlineUrl.trim());
    else if (insertPanel === "youtube") insertMarker("youtube", inlineUrl.trim());
    else if (insertPanel === "instagram") insertMarker("instagram", inlineUrl.trim());
    else if (insertPanel === "pdf") insertMarker("pdf", inlineUrl.trim());
  }

  function handleSubmit(pub: boolean) {
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || title.trim(),
      coverImage: coverImage.trim() ||
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=630&fit=crop&auto=format",
      tag,
      authorId: initial?.authorId ?? currentUser.id,
      authorName: initial?.authorName ?? currentUser.displayName,
      published: pub,
    });
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Top toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
              ← Batal
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <span className="text-sm font-semibold text-slate-700">
              {initial ? "Edit Artikel" : "Tulis Artikel Baru"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${preview ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {preview ? "✏️ Edit" : "👁️ Preview"}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Simpan Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-4 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors"
            >
              {initial?.published ? "Perbarui" : "Terbitkan"}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-14">
        {preview ? (
          /* ── PREVIEW ── */
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            {coverImage && (
              <img src={coverImage} alt={title} className="w-full h-64 object-cover rounded-2xl mb-8" />
            )}
            <span className="px-3 py-1.5 rounded-full bg-blue-700 text-white text-xs font-bold">{tag}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 mb-3 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {title || "Judul Artikel"}
            </h1>
            {excerpt && (
              <p className="text-xl text-slate-500 italic border-l-4 border-blue-600 pl-4 mb-8">{excerpt}</p>
            )}
            <div>
              {content
                ? renderContent(content)
                : <p className="text-slate-400 italic">Konten artikel akan ditampilkan di sini...</p>}
            </div>
          </div>
        ) : (
          /* ── EDITOR ── */
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-[1fr_280px] gap-8">
            <div>
              {/* Cover preview */}
              {coverImage && (
                <div className="h-48 rounded-2xl overflow-hidden bg-slate-200 mb-6">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}

              <input
                type="text"
                placeholder="Judul artikel..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl sm:text-4xl font-black text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none mb-4 leading-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              />

              <input
                type="text"
                placeholder="Ringkasan singkat (excerpt)..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full text-lg text-slate-400 placeholder-slate-300 bg-transparent border-none outline-none mb-6 italic"
              />

              <div className="w-full h-px bg-slate-200 mb-3" />

              {/* ── Content toolbar ── */}
              <div className="flex flex-wrap items-center gap-2 mb-3 relative">
                {([
                  { key: "image", icon: "🖼️", label: "Gambar" },
                  { key: "pdf",   icon: "📄", label: "PDF" },
                  { key: "youtube", icon: "▶️", label: "YouTube" },
                  { key: "instagram", icon: "📸", label: "Instagram" },
                ] as const).map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => { setInsertPanel(insertPanel === btn.key ? null : btn.key); setInlineError(""); setInlineUrl(""); setInlineTab("upload"); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      insertPanel === btn.key
                        ? "bg-blue-700 text-white border-blue-700"
                        : "text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
                <span className="text-xs text-slate-400 hidden sm:inline">· klik posisi di teks dulu</span>

                {/* Insert panel */}
                {insertPanel && (
                  <div className="absolute top-full left-0 mt-2 z-30 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-slate-800">
                        {insertPanel === "image" ? "🖼️ Sisipkan Gambar"
                          : insertPanel === "pdf" ? "📄 Sisipkan PDF"
                          : insertPanel === "youtube" ? "▶️ Sisipkan YouTube"
                          : "📸 Sisipkan Instagram"}
                      </span>
                      <button onClick={() => setInsertPanel(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
                    </div>

                    {/* Tabs — upload only for image & pdf */}
                    {(insertPanel === "image" || insertPanel === "pdf") && (
                      <div className="flex gap-1 mb-4">
                        {(["upload", "url"] as const).map((t) => (
                          <button key={t} type="button"
                            onClick={() => { setInlineTab(t); setInlineError(""); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${inlineTab === t ? "bg-blue-700 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                          >
                            {t === "upload" ? "📁 Upload File" : "🔗 URL"}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    {(insertPanel === "image" || insertPanel === "pdf") && inlineTab === "upload" ? (
                      <div
                        onClick={() => {
                          if (inlineLoading) return;
                          if (insertPanel === "pdf") pdfInputRef.current?.click();
                          else fileInputRef.current?.click();
                        }}
                        className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors hover:bg-blue-50/40"
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInlineFile} />
                        <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfFile} />
                        {inlineLoading ? (
                          <>
                            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-slate-400">Memproses...</span>
                          </>
                        ) : insertPanel === "pdf" ? (
                          <>
                            <div className="text-2xl">📄</div>
                            <div className="text-xs text-center text-slate-500">
                              <span className="font-semibold text-blue-600">Klik untuk upload PDF</span>
                              <br />Maks. 20 MB
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl">🖼️</div>
                            <div className="text-xs text-center text-slate-500">
                              <span className="font-semibold text-blue-600">Klik untuk upload</span>
                              <br />PNG, JPG, WEBP · maks. 10 MB
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      /* URL input — for all types when tab=url or for youtube/instagram */
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder={
                            insertPanel === "youtube" ? "https://youtube.com/watch?v=..."
                            : insertPanel === "instagram" ? "https://www.instagram.com/p/..."
                            : insertPanel === "pdf" ? "https://domain.com/file.pdf"
                            : "https://..."
                          }
                          value={inlineUrl}
                          onChange={(e) => setInlineUrl(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleInlineUrl()}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button type="button" onClick={handleInlineUrl}
                          className="w-full py-2 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
                        >
                          Sisipkan
                        </button>
                      </div>
                    )}

                    {inlineError && <p className="text-red-500 text-xs mt-2">{inlineError}</p>}
                  </div>
                )}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                placeholder={"Tulis konten artikel di sini...\n\nPisahkan paragraf dengan baris kosong.\n\nGunakan tombol toolbar di atas untuk menyisipkan gambar, PDF, YouTube, atau Instagram."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onClick={() => setInsertPanel(null)}
                className="w-full min-h-[500px] text-slate-700 placeholder-slate-300 bg-transparent border-none outline-none resize-none leading-relaxed text-lg font-mono text-sm"
              />

              {/* Embed counters */}
              {["gambar", "pdf", "youtube", "instagram"].some((t) => content.includes(`[${t}:`)) && (
                <div className="mt-2 text-xs text-slate-400 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-2">
                  {[
                    { key: "gambar", icon: "🖼️", label: "gambar" },
                    { key: "pdf", icon: "📄", label: "PDF" },
                    { key: "youtube", icon: "▶️", label: "video" },
                    { key: "instagram", icon: "📸", label: "Instagram" },
                  ].map(({ key, icon, label }) => {
                    const count = (content.match(new RegExp(`\\[${key}:`, "g")) ?? []).length;
                    return count > 0 ? (
                      <span key={key}>{icon} {count} {label}</span>
                    ) : null;
                  })}
                  <span className="text-slate-300">· lihat di Preview</span>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Pengaturan Artikel</h3>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ARTICLE_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <ImageUploader value={coverImage} onChange={setCoverImage} />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Status</span>
                  <button
                    onClick={() => setPublished(!published)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {published ? "Terbit" : "Draft"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Penulis</h3>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${currentUser.role === "admin" ? "bg-blue-600" : "bg-violet-600"} flex items-center justify-center text-white font-bold text-sm`}>
                    {currentUser.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{currentUser.displayName}</div>
                    <div className="text-xs text-slate-400 capitalize">{currentUser.role}</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700 space-y-1.5">
                <p className="font-semibold">Tips menulis:</p>
                <p>• Pisahkan paragraf dengan satu baris kosong</p>
                <p>• Klik posisi di teks, lalu pilih tombol di toolbar</p>
                <p>• 🖼️ Gambar — upload atau URL</p>
                <p>• 📄 PDF — upload file atau tempel link</p>
                <p>• ▶️ YouTube — tempel link video</p>
                <p>• 📸 Instagram — tempel link post/reel</p>
                <p>• Gunakan Preview untuk melihat hasil akhir</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
