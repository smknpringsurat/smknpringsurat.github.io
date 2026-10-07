import { useState, useCallback } from "react";
import { BlogUser, loadUsers, saveUsers, AVATAR_COLORS } from "./types";

const SESSION_KEY = "smkn_blog_session";

function loadSession(): BlogUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [users, setUsers] = useState<BlogUser[]>(loadUsers);
  const [currentUser, setCurrentUser] = useState<BlogUser | null>(loadSession);

  const login = useCallback(
    (username: string, password: string): boolean => {
      const found = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      if (found) {
        setCurrentUser(found);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(found));
        return true;
      }
      return false;
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const addUser = useCallback(
    (username: string, displayName: string, password: string, role: "admin" | "author") => {
      const newUser: BlogUser = {
        id: Date.now().toString(),
        username,
        password,
        displayName,
        role,
        color: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
      };
      const next = [...users, newUser];
      setUsers(next);
      saveUsers(next);
    },
    [users]
  );

  const removeUser = useCallback(
    (id: string) => {
      const next = users.filter((u) => u.id !== id);
      setUsers(next);
      saveUsers(next);
    },
    [users]
  );

  const updatePassword = useCallback(
    (id: string, password: string) => {
      const next = users.map((u) => (u.id === id ? { ...u, password } : u));
      setUsers(next);
      saveUsers(next);
    },
    [users]
  );

  return { users, currentUser, login, logout, addUser, removeUser, updatePassword };
}
