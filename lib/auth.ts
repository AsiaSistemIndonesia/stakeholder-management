import usersConfig from "@/config/users.json";

export interface AuthUser {
  username: string;
  role: string;
  nama?: string;
}

export const USERS = usersConfig;

const SESSION_KEY = "auth";

import { addActivityLog } from "./activityLogger";
import { recordUserLogin, recordUserAction } from "./userActivity";

export function login(username: string, password: string): AuthUser | null {
  const user = usersConfig.find(
    (u: any) => u.username === username && u.password === password
  );
  if (user) {
    const safeUser = { username: user.username, role: user.role, nama: user.nama || user.username };
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      addActivityLog({
        username: safeUser.username,
        userNama: safeUser.nama,
        role: safeUser.role,
        module: "Authentication",
        action: "Login",
        description: `Pengguna '${safeUser.username}' (${safeUser.role}) berhasil masuk ke sistem.`,
      });
      recordUserLogin(safeUser.username);
    }
    return safeUser as AuthUser;
  }
  return null;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    const currentUser = getSessionUser();
    if (currentUser) {
      addActivityLog({
        username: currentUser.username,
        userNama: currentUser.nama,
        role: currentUser.role,
        module: "Authentication",
        action: "Logout",
        description: `Pengguna '${currentUser.username}' telah keluar dari platform.`,
      });
      recordUserAction(currentUser.username, "Logout dari platform");
    }
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSessionUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
