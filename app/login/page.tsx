"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { login, USERS } from "@/lib/auth";
import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ROLE_STYLES: Record<string, string> = {
  super_admin: "bg-primary/10 text-primary border border-primary/30",
  admin: "bg-accent/10 text-accent border border-accent/30",
  viewer: "bg-success/10 text-success-foreground border border-success/30",
};

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(() => {
      const user = login(username, password);
      if (user) {
        refreshUser();
        router.replace("/");
      } else {
        setError("Email atau kata sandi tidak valid. Silakan coba lagi.");
      }
    });
  }

  function fillDemo(demoUsername: string, demoPassword: string) {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError(null);
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
          aria-hidden="true"
        />
        {/* Dark overlay using brand black */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, rgba(22,27,34,0.93) 0%, rgba(22,27,34,0.78) 55%, rgba(237,26,47,0.28) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-base">
                PD
              </span>
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-tight">
                Pertamina Drilling
              </p>
              <p className="text-white/60 text-xs">Services Indonesia</p>
            </div> */}
            <Image
              src="/images/logo.png"
              alt="Logo Pertamina Drilling"
              width={50}
              height={50}
              className="mb-6"
            />
          </div>

          {/* Center tagline */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-sm">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-primary/20 text-primary border border-primary/40">
                Stakeholder Management Platform
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4 text-balance">
                Kelola Hubungan{" "}
                <span className="text-primary">Stakeholder</span> Secara Terpadu
              </h1>
              <p className="text-white/65 text-base leading-relaxed">
                Platform terintegrasi untuk memantau, mengelola, dan
                menganalisis hubungan dengan seluruh pemangku kepentingan
                operasi pengeboran.
              </p>
            </div>

            {/* Feature bullets */}
            <ul className="mt-8 space-y-3">
              {[
                "Peta interaktif zona operasi nasional",
                "Manajemen insiden real-time",
                "Laporan & analitik terpusat",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-white/65">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} PT Pertamina Drilling Services
            Indonesia. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 relative">
        {/* Theme toggle — top right */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-base">
              PD
            </span>
          </div>
          <div>
            <p className="text-foreground font-semibold text-base leading-tight">
              Pertamina Drilling
            </p>
            <p className="text-muted-foreground text-xs">Services Indonesia</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Masuk ke Akun Anda
            </h2>
            <p className="text-muted-foreground text-sm">
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="phase1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-secondary border-border h-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Kata Sandi
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-11 bg-secondary border-border h-11"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg px-3 py-3 text-sm bg-destructive/10 border border-destructive/40 text-destructive"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 font-semibold text-base"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">
                Akun Demo
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-2">
              {USERS.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => fillDemo(u.username, u.password)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/70 border border-border transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {u.username
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {u.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {u.role}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      ROLE_STYLES[u.role] ?? "bg-muted text-muted-foreground",
                    )}
                  >
                    {u.role.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
