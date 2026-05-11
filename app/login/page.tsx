"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { login, USERS } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(() => {
      const user = login(email, password);
      if (user) {
        refreshUser();
        router.push("/");
      } else {
        setError("Email atau kata sandi tidak valid. Silakan coba lagi.");
      }
    });
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
          aria-hidden="true"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.13 0.005 240 / 0.92) 0%, oklch(0.13 0.005 240 / 0.75) 50%, oklch(0.65 0.2 25 / 0.35) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-base">
                PD
              </span>
            </div>
            <div>
              <p className="text-foreground font-semibold text-base leading-tight">
                Pertamina Drilling
              </p>
              <p className="text-muted-foreground text-xs">
                Services Indonesia
              </p>
            </div>
          </div>

          {/* Center tagline */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-sm">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                style={{
                  background: "oklch(0.65 0.2 25 / 0.2)",
                  color: "oklch(0.85 0.12 25)",
                  border: "1px solid oklch(0.65 0.2 25 / 0.35)",
                }}
              >
                Stakeholder Management Platform
              </div>
              <h1 className="text-4xl font-bold text-foreground leading-tight mb-4 text-balance">
                Kelola Hubungan{" "}
                <span className="text-primary">Stakeholder</span> Secara Terpadu
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
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
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PT Pertamina Drilling Services
            Indonesia. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16">
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
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@pertamina-drilling.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary border-border focus:border-primary h-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
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
                  className="pl-10 pr-11 bg-secondary border-border focus:border-primary h-11"
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
                className="flex items-start gap-2 rounded-lg px-3 py-3 text-sm"
                style={{
                  background: "oklch(0.55 0.22 25 / 0.12)",
                  border: "1px solid oklch(0.55 0.22 25 / 0.4)",
                  color: "oklch(0.8 0.12 25)",
                }}
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 font-semibold text-base bg-primary hover:bg-primary/90 text-primary-foreground hover:cursor-pointer"
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
                  key={u.id}
                  type="button"
                  onClick={() => fillDemo(u.email, u.password)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors group text-left hover:cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {u.nama
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {u.nama}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {u.jabatan}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={
                      u.role === "super_admin"
                        ? {
                            background: "oklch(0.65 0.2 25 / 0.15)",
                            color: "oklch(0.85 0.12 25)",
                            border: "1px solid oklch(0.65 0.2 25 / 0.3)",
                          }
                        : u.role === "admin"
                          ? {
                              background: "oklch(0.6 0.15 250 / 0.15)",
                              color: "oklch(0.75 0.12 250)",
                              border: "1px solid oklch(0.6 0.15 250 / 0.3)",
                            }
                          : {
                              background: "oklch(0.6 0.15 175 / 0.15)",
                              color: "oklch(0.75 0.12 175)",
                              border: "1px solid oklch(0.6 0.15 175 / 0.3)",
                            }
                    }
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
