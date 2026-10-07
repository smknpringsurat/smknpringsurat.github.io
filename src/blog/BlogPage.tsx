import { useState } from "react";
import { Article, ARTICLE_TAGS } from "./types";

interface Props {
  articles: Article[];
  onRead: (id: string) => void;
  onHome: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage({ articles, onRead, onHome }: Props) {
  const [activeTag, setActiveTag] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) => {
    const matchTag = activeTag === "Semua" || a.tag === activeTag;
    const matchSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={onHome}
            className="text-blue-300 hover:text-white text-sm font-medium flex items-center gap-1.5 mb-8 transition-colors"
          >
            ← Kembali ke Beranda
          </button>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
            Blog & Artikel
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Berita Sekolah
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Informasi terkini, artikel, dan dokumentasi kegiatan SMK Negeri Pringsurat.
          </p>

          {/* Search */}
          <div className="mt-8 relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Tag filter */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {["Semua", ...ARTICLE_TAGS].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTag === tag
                  ? "bg-blue-700 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-4xl mb-4">📭</div>
            <p className="font-medium">Tidak ada artikel ditemukan.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <article
                onClick={() => onRead(featured.id)}
                className="group mb-10 bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all cursor-pointer"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 relative h-64 md:h-auto bg-slate-200 overflow-hidden">
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full bg-blue-700 text-white text-xs font-bold">
                        {featured.tag}
                      </span>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                      Artikel Terbaru
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-blue-700 mb-4 leading-snug transition-colors"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {featured.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${featured.authorId === "admin" ? "bg-blue-600" : featured.authorId === "guru1" ? "bg-violet-600" : "bg-emerald-600"} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {featured.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{featured.authorName}</div>
                        <div className="text-xs text-slate-400">{formatDate(featured.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((a) => (
                  <article
                    key={a.id}
                    onClick={() => onRead(a.id)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg hover:shadow-slate-200/60 transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative h-44 bg-slate-200 overflow-hidden">
                      <img
                        src={a.coverImage}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-700 text-white text-xs font-bold">
                          {a.tag}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3
                        className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-700 mb-2 transition-colors line-clamp-2"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        {a.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">{a.excerpt}</p>
                      <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                        <div
                          className={`w-6 h-6 rounded-full ${a.authorId === "admin" ? "bg-blue-600" : a.authorId === "guru1" ? "bg-violet-600" : "bg-emerald-600"} flex items-center justify-center text-white text-[10px] font-bold`}
                        >
                          {a.authorName.charAt(0)}
                        </div>
                        <div className="text-xs text-slate-400">
                          <span className="font-medium text-slate-600">{a.authorName}</span> · {formatDate(a.createdAt)}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
