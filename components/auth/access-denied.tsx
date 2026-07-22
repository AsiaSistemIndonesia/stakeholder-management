"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

export function AccessDenied({
  title = "Akses Ditolak (Access Denied)",
  message = "Anda tidak memiliki hak akses untuk membuka halaman atau fitur ini. Silakan hubungi Super Admin jika Anda memerlukan akses tambahan.",
}: AccessDeniedProps) {
  return (
    <DashboardLayout
      title="Akses Ditolak"
      subtitle="Halaman ini dilindungi oleh kontrol akses (RBAC)"
    >
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full bg-card border-border shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
