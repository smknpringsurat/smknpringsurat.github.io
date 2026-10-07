import { useState, useCallback } from "react";
import { CMSData, defaultCMS } from "./data";

const STORAGE_KEY = "smkn_cms_data";
const ADMIN_PASSWORD = "smkn2025";

function loadData(): CMSData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCMS;
    const stored = JSON.parse(raw) as Partial<Record<string, unknown>>;
    // Merge each top-level section individually so missing/renamed keys
    // (e.g. old "ppdb" → new "spmb") always fall back to defaultCMS values.
    return {
      hero: { ...defaultCMS.hero, ...(stored.hero as object ?? {}) },
      school: { ...defaultCMS.school, ...(stored.school as object ?? {}) },
      stats: Array.isArray(stored.stats) ? stored.stats : defaultCMS.stats,
      programs: Array.isArray(stored.programs) ? stored.programs : defaultCMS.programs,
      facilities: Array.isArray(stored.facilities) ? stored.facilities : defaultCMS.facilities,
      extracurriculars: Array.isArray(stored.extracurriculars) ? stored.extracurriculars : defaultCMS.extracurriculars,
      partners: Array.isArray(stored.partners) ? stored.partners : defaultCMS.partners,
      spmb: { ...defaultCMS.spmb, ...(stored.spmb as object ?? {}) },
    };
  } catch {
    return defaultCMS;
  }
}

function saveData(data: CMSData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useCMS() {
  const [data, setData] = useState<CMSData>(loadData);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const update = useCallback(<K extends keyof CMSData>(section: K, value: CMSData[K]) => {
    setData((prev) => {
      const next = { ...prev, [section]: value };
      saveData(next);
      return next;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultCMS);
  }, []);

  return { data, isAdmin, login, logout, update, resetToDefault };
}
