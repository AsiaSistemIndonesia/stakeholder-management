export interface AuthUser {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "viewer";
  zonaOperasi: string[];
  jabatan: string;
}

export const USERS: AuthUser[] = [
  {
    id: "user-1",
    nama: "Budi Santoso",
    email: "admin@pertamina-drilling.com",
    password: "admin123",
    role: "super_admin",
    zonaOperasi: ["zona-1", "zona-2", "zona-3", "zona-4", "zona-5"],
    jabatan: "Super Administrator",
  },
  {
    id: "user-2",
    nama: "Sari Dewi",
    email: "manager@pertamina-drilling.com",
    password: "manager123",
    role: "admin",
    zonaOperasi: ["zona-1", "zona-2"],
    jabatan: "Stakeholder Relations Manager",
  },
  {
    id: "user-3",
    nama: "Ahmad Fauzi",
    email: "viewer@pertamina-drilling.com",
    password: "viewer123",
    role: "viewer",
    zonaOperasi: ["zona-3"],
    jabatan: "Field Officer",
  },
];

const SESSION_KEY = "pdsi_auth_user";

export function login(
  email: string,
  password: string
): AuthUser | null {
  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    const { password: _pw, ...safeUser } = user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return user;
  }
  return null;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSessionUser(): Omit<AuthUser, "password"> | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
