"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import { getSessionUser, logout as authLogout } from "@/lib/auth";

interface AuthContextValue {
  user: Omit<AuthUser, "password"> | null;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: () => {},
  refreshUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<AuthUser, "password"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sessionUser = getSessionUser();
    setUser(sessionUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const isLoginPage = pathname === "/login";
    if (!user && !isLoginPage) {
      router.replace("/login");
    } else if (user && isLoginPage) {
      router.replace("/");
    }
  }, [user, isLoading, pathname, router]);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    router.replace("/login");
  }, [router]);

  const refreshUser = useCallback(() => {
    const sessionUser = getSessionUser();
    setUser(sessionUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
