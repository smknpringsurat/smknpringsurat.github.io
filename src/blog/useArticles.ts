import { useState, useCallback } from "react";
import { Article, loadArticles, saveArticles } from "./types";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(loadArticles);

  const save = useCallback((next: Article[]) => {
    setArticles(next);
    saveArticles(next);
  }, []);

  const createArticle = useCallback(
    (draft: Omit<Article, "id" | "createdAt">): Article => {
      const article: Article = {
        ...draft,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      save([article, ...articles]);
      return article;
    },
    [articles, save]
  );

  const updateArticle = useCallback(
    (id: string, changes: Partial<Article>) => {
      save(articles.map((a) => (a.id === id ? { ...a, ...changes } : a)));
    },
    [articles, save]
  );

  const deleteArticle = useCallback(
    (id: string) => {
      save(articles.filter((a) => a.id !== id));
    },
    [articles, save]
  );

  const publishedArticles = articles.filter((a) => a.published);

  return { articles, publishedArticles, createArticle, updateArticle, deleteArticle };
}
