"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { currentUser, auditLogData, getStakeholderById } from "@/lib/data";
import {
  User,
  Shield,
  Bell,
  History,
  Key,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Pengaturan"
      subtitle="Kelola pengaturan akun dan preferensi sistem"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profil Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {currentUser.nama
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {currentUser.nama}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.email}
                  </p>
                  <Badge className="mt-2 bg-primary">
                    {currentUser.role.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    defaultValue={currentUser.nama}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={currentUser.email}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <Button variant="outline" className="border-border">
                <Key className="h-4 w-4 mr-2" />
                Ubah Password
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Notifikasi Insiden Baru
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Terima notifikasi saat ada laporan insiden baru
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Notifikasi Stakeholder Baru
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Terima notifikasi saat ada stakeholder baru ditambahkan
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Email Ringkasan Mingguan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Terima email ringkasan aktivitas setiap minggu
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Sidebar */}
        <div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Jejak Audit Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogData.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-secondary/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          log.aksi === "CREATE"
                            ? "border-green-500 text-green-500"
                            : log.aksi === "UPDATE"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-red-500 text-red-500"
                        }
                      >
                        {log.aksi}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {log.entitas}: {log.field}
                    </p>
                    {log.nilaiLama !== "-" && (
                      <p className="text-xs text-muted-foreground">
                        <span className="line-through">{log.nilaiLama}</span>
                        {" → "}
                        <span className="text-foreground">{log.nilaiBaru}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
