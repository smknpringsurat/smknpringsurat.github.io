import { Article } from "./types";
import { renderContent } from "./contentRenderer";

interface Props {
  article: Article;
  related: Article[];
  onBack: () => void;
  onRead: (id: string) => void;
  currentUserId?: string;
  currentUserRole?: string;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


const AUTHOR_COLORS: Record<string, string> = {
  admin: "bg-blue-600",
  guru1: "bg-violet-600",
  guru2: "bg-emerald-600",
};

function authorColor(id: string) {
  return AUTHOR_COLORS[id] ?? "bg-slate-600";
}

export default function ArticlePage({
  article,
  related,
  onBack,
  onRead,
  currentUserId,
  currentUserRole,
  onEdit,
  onDelete,
}: Props) {
  const canEdit =
    currentUserRole === "admin" || currentUserId === article.authorId;

  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Hero image */}
      <div className="relative h-[50vh] min-h-[320px] bg-slate-800 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/25 transition-colors border border-white/20"
          >
            ← Kembali
          </button>
        </div>

        {canEdit && (
          <div className="absolute top-6 right-4 sm:right-8 flex gap-2">
            <button
              onClick={() => onEdit(article)}
              className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/25 transition-colors border border-white/20"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Hapus artikel ini?")) onDelete(article.id);
              }}
              className="px-4 py-2 rounded-xl bg-red-500/80 backdrop-blur-sm text-white text-sm font-medium hover:bg-red-500 transition-colors"
            >
              🗑️ Hapus
            </button>
          </div>
        )}

        {/* Tag */}
        <div className="absolute bottom-8 left-4 sm:left-8">
          <span className="px-3 py-1.5 rounded-full bg-blue-700 text-white text-xs font-bold">
            {article.tag}
          </span>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {article.title}
        </h1>

        {/* Author + date */}
        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-slate-200">
          <div
            className={`w-11 h-11 rounded-full ${authorColor(article.authorId)} flex items-center justify-center text-white font-bold text-lg`}
          >
            {article.authorName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{article.authorName}</div>
            <div className="text-sm text-slate-400">{formatDate(article.createdAt)}</div>
          </div>
          {!article.published && (
            <span className="ml-auto px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              Draft
            </span>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-xl text-slate-500 leading-relaxed mb-8 font-medium italic border-l-4 border-blue-600 pl-5">
          {article.excerpt}
        </p>

        {/* Content */}
        <div className="prose-content">
          {renderContent(article.content)}
        </div>

        {/* Tags / share */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex items-center gap-3">
          <span className="text-sm text-slate-500">Kategori:</span>
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            {article.tag}
          </span>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="border-t border-slate-200 bg-white py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2
              className="text-2xl font-black text-slate-900 mb-8"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Artikel Lainnya
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((a) => (
                <article
                  key={a.id}
                  onClick={() => onRead(a.id)}
                  className="group cursor-pointer"
                >
                  <div className="h-40 rounded-2xl overflow-hidden bg-slate-200 mb-4">
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    {a.tag}
                  </div>
                  <h3
                    className="font-bold text-slate-900 group-hover:text-blue-700 leading-snug text-sm transition-colors line-clamp-2"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {a.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-2">{formatDate(a.createdAt)}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
