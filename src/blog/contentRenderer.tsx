import { ReactNode } from "react";

type SegType = "text" | "image" | "youtube" | "instagram" | "pdf";

interface Segment {
  type: SegType;
  value: string;
}

const MARKER_RE = /\[(gambar|youtube|instagram|pdf):([\s\S]*?)\]/g;

function parseContent(content: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  MARKER_RE.lastIndex = 0;

  while ((match = MARKER_RE.exec(content)) !== null) {
    if (match.index > last) {
      segments.push({ type: "text", value: content.slice(last, match.index) });
    }
    segments.push({ type: match[1] as SegType, value: match[2].trim() });
    last = match.index + match[0].length;
  }

  if (last < content.length) {
    segments.push({ type: "text", value: content.slice(last) });
  }

  return segments;
}

function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    const v = u.searchParams.get("v");
    if (v) return v;
    // /shorts/ID
    const shorts = u.pathname.match(/\/shorts\/([^/]+)/);
    if (shorts) return shorts[1];
  } catch {
    /* ignore */
  }
  return null;
}

function getInstagramPostId(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/(p|reel|tv)\/([^/]+)/);
    return m ? m[2] : null;
  } catch {
    return null;
  }
}

function YoutubeEmbed({ url }: { url: string }) {
  const id = getYoutubeId(url);
  if (!id) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
        {url}
      </a>
    );
  }
  return (
    <figure className="my-8">
      <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </figure>
  );
}

function InstagramEmbed({ url }: { url: string }) {
  const postId = getInstagramPostId(url);
  return (
    <figure className="my-8 flex justify-center">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            IG
          </div>
          <span className="text-sm font-semibold text-slate-800">Instagram</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-blue-600 font-semibold hover:underline">
            Lihat →
          </a>
        </div>
        {/* Preview area */}
        <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl">
            📸
          </div>
          <p className="text-sm font-medium text-slate-600 text-center px-4">
            {postId ? `Post Instagram` : "Postingan Instagram"}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Buka di Instagram
          </a>
        </div>
        <div className="px-4 py-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 truncate">{url}</p>
        </div>
      </div>
    </figure>
  );
}

function PdfEmbed({ url }: { url: string }) {
  const isDataUrl = url.startsWith("data:");
  const fileName = isDataUrl ? "dokumen.pdf" : url.split("/").pop()?.split("?")[0] ?? "dokumen.pdf";
  return (
    <figure className="my-8">
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
          <span className="text-2xl">📄</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{fileName}</div>
            <div className="text-xs text-slate-400">Dokumen PDF</div>
          </div>
          <a
            href={url}
            download={fileName}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shrink-0"
          >
            ⬇ Unduh
          </a>
        </div>
        {/* Inline viewer — only works for external URLs, not data: URIs > 2 MB */}
        {!isDataUrl ? (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
            title="PDF preview"
            className="w-full"
            style={{ height: "500px", border: "none" }}
          />
        ) : (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
            <span className="text-4xl">📄</span>
            <p className="text-sm">PDF berhasil diunggah.</p>
            <a href={url} download={fileName} className="text-blue-600 text-xs font-semibold hover:underline">
              Klik di sini untuk mengunduh
            </a>
          </div>
        )}
      </div>
    </figure>
  );
}

export function renderContent(content: string): ReactNode[] {
  const segments = parseContent(content);
  const nodes: ReactNode[] = [];

  segments.forEach((seg, i) => {
    if (seg.type === "image") {
      nodes.push(
        <figure key={i} className="my-8">
          <img src={seg.value} alt="Gambar artikel" className="w-full rounded-2xl object-cover max-h-[500px]" />
        </figure>
      );
    } else if (seg.type === "youtube") {
      nodes.push(<YoutubeEmbed key={i} url={seg.value} />);
    } else if (seg.type === "instagram") {
      nodes.push(<InstagramEmbed key={i} url={seg.value} />);
    } else if (seg.type === "pdf") {
      nodes.push(<PdfEmbed key={i} url={seg.value} />);
    } else {
      seg.value
        .split("\n\n")
        .filter((p) => p.trim())
        .forEach((para, j) => {
          nodes.push(
            <p key={`${i}-${j}`} className="mb-5 text-slate-700 leading-relaxed text-lg">
              {para.split("\n").map((line, k) => (
                <span key={k}>
                  {line}
                  {k < para.split("\n").length - 1 && <br />}
                </span>
              ))}
            </p>
          );
        });
    }
  });

  return nodes;
}
