import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
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
      if (!ctx) { reject(new Error("canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("load failed")); };
    img.src = objectUrl;
  });
}

export default function ImageUploader({ value, onChange, label = "Foto Cover" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value.startsWith("data:") ? "" : value);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("File harus berupa gambar."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Ukuran file maksimal 10 MB."); return; }
    setError("");
    setLoading(true);
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } catch {
      setError("Gagal memproses gambar. Coba lagi.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
  }

  function handleUrlApply() {
    if (urlInput.trim()) onChange(urlInput.trim());
  }

  const hasImage = Boolean(value);

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-3">
        {(["upload", "url"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === t ? "bg-blue-700 text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {t === "upload" ? "📁 Upload File" : "🔗 URL"}
          </button>
        ))}
        {hasImage && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 font-medium transition-colors"
          >
            Hapus
          </button>
        )}
      </div>

      {tab === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !loading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
            loading ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          {hasImage ? (
            <div className="relative h-44 rounded-xl overflow-hidden">
              <img src={value} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-semibold">Klik untuk ganti</span>
              </div>
            </div>
          ) : (
            <div className="h-36 flex flex-col items-center justify-center gap-2 text-slate-400">
              {loading ? (
                <>
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Memproses gambar...</span>
                </>
              ) : (
                <>
                  <div className="text-3xl">🖼️</div>
                  <div className="text-xs text-center leading-relaxed">
                    <span className="font-semibold text-blue-600">Klik untuk upload</span> atau drag &amp; drop
                    <br />PNG, JPG, WEBP · maks. 10 MB
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Pakai
            </button>
          </div>
          {hasImage && !value.startsWith("data:") && (
            <div className="h-32 rounded-xl overflow-hidden border border-slate-200">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {hasImage && (
        <p className="text-[11px] text-slate-400 mt-1.5">
          {value.startsWith("data:") ? `Gambar tersimpan lokal (~${Math.round(value.length / 1024)} KB)` : "Gambar dari URL eksternal"}
        </p>
      )}
    </div>
  );
}
