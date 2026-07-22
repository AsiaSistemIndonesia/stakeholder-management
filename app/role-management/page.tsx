"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth/auth-provider";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/auth/access-denied";
import { RoleConfig, ModulePermissions } from "@/lib/rbac-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  Map,
  AlertTriangle,
  Heart,
  Network,
  Settings,
  RotateCcw,
  CheckCircle2,
  Lock,
  Eye,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const ALL_MENUS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Akses halaman utama dan ringkasan indikator" },
  { id: "stakeholder", label: "Stakeholder", icon: Users, desc: "Manajemen data stakeholder dan kontak" },
  { id: "organisasi", label: "Organisasi", icon: Building2, desc: "Manajemen organisasi dan sub-organisasi" },
  { id: "peta", label: "Peta Interaktif", icon: Map, desc: "Peta pemetaan posisi geografis stakeholder & insiden" },
  { id: "laporan", label: "Laporan", icon: AlertTriangle, desc: "Laporan insiden dan eskalasi lapangan" },
  { id: "csr", label: "CSR", icon: Heart, desc: "Program Corporate Social Responsibility" },
  { id: "fungsi", label: "Struktur Fungsi", icon: Network, desc: "Struktur hierarki fungsi organisasi" },
  { id: "role-management", label: "Role Management", icon: ShieldCheck, desc: "Pengaturan hak akses dan izin pengguna (Khusus Super Admin)" },
];

const ALL_WIDGETS = [
  { id: "stats", label: "Monitoring Stats KPI", desc: "Ringkasan jumlah stakeholder, organisasi, dan insiden aktif" },
  { id: "orgBreakdown", label: "Organization Breakdown", desc: "Grafik distribusi stakeholder per organisasi" },
  { id: "zoneBreakdown", label: "Stakeholder by Zone", desc: "Grafik distribusional wilayah zona operasi" },
  { id: "monthlyTrend", label: "Monthly Trend", desc: "Grafik tren perkembangan insiden dan aktivitas bulanan" },
];

const ALL_MODULES = [
  { id: "stakeholder", label: "Modul Stakeholders", desc: "Pengelolaan data stakeholder" },
  { id: "organisasi", label: "Modul Organisasi", desc: "Pengelolaan data organisasi mitra" },
  { id: "peta", label: "Modul Peta Interaktif", desc: "Pemetaan GIS dan koordinat" },
  { id: "laporan", label: "Modul Laporan / Insiden", desc: "Pelaporan insiden dan timeline" },
  { id: "csr", label: "Modul CSR", desc: "Pengelolaan program CSR" },
  { id: "fungsi", label: "Modul Struktur Fungsi", desc: "Struktur posisi dan hierarki" },
  { id: "role_management", label: "Modul Role Management", desc: "Pengaturan RBAC" },
];

export default function RoleManagementPage() {
  const { user } = useAuth();
  const { roles, updateRole, resetToDefault, hasMenuAccess } = usePermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<string>("admin");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Route Security Check: Only Super Admin or authorized users
  if (!user || user.role !== "super_admin" || !hasMenuAccess("role-management")) {
    return (
      <AccessDenied
        title="Akses Ditolak - Khusus Super Admin"
        message="Menu Manajemen Peran & Izin Akses (RBAC) hanya dapat diakses oleh akun berkewenangan Super Admin."
      />
    );
  }

  const activeRoleConfig: RoleConfig = roles[selectedRoleId] || {
    id: selectedRoleId,
    name: selectedRoleId,
    description: "",
    visibleMenus: [],
    dashboardWidgets: [],
    permissions: {},
  };

  const handleToggleMenu = (menuId: string) => {
    const currentMenus = activeRoleConfig.visibleMenus || [];
    const isPresent = currentMenus.includes(menuId);
    const updatedMenus = isPresent
      ? currentMenus.filter((m) => m !== menuId)
      : [...currentMenus, menuId];

    updateRole(selectedRoleId, {
      ...activeRoleConfig,
      visibleMenus: updatedMenus,
    });

    showFeedback("Izin menu diperbarui");
  };

  const handleToggleWidget = (widgetId: string) => {
    const currentWidgets = activeRoleConfig.dashboardWidgets || [];
    const isPresent = currentWidgets.includes(widgetId);
    const updatedWidgets = isPresent
      ? currentWidgets.filter((w) => w !== widgetId)
      : [...currentWidgets, widgetId];

    updateRole(selectedRoleId, {
      ...activeRoleConfig,
      dashboardWidgets: updatedWidgets,
    });

    showFeedback("Izin widget dashboard diperbarui");
  };

  const handleToggleCrud = (
    moduleKey: string,
    action: keyof ModulePermissions
  ) => {
    const currentPerms = activeRoleConfig.permissions || {};
    const modulePerms = currentPerms[moduleKey] || {
      read: true,
      create: true,
      update: true,
      delete: true,
    };

    const updatedModulePerms = {
      ...modulePerms,
      [action]: !modulePerms[action],
    };

    updateRole(selectedRoleId, {
      ...activeRoleConfig,
      permissions: {
        ...currentPerms,
        [moduleKey]: updatedModulePerms,
      },
    });

    showFeedback(`Izin CRUD ${moduleKey} diperbarui`);
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin mengembalikan seluruh konfigurasi RBAC ke pengaturan awal (JSON Default)?"
      )
    ) {
      resetToDefault();
      showFeedback("Konfigurasi RBAC berhasil di-reset ke default");
    }
  };

  const showFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 2500);
  };

  return (
    <DashboardLayout
      title="Role & Permission Management (RBAC)"
      subtitle="Atur ketersediaan menu, widget dashboard, dan hak akses CRUD untuk setiap peran pengguna"
    >
      <div className="space-y-6">
        {/* Banner Alert */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Role Selector Card */}
          <Card className="lg:col-span-4 bg-card border-border h-fit">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Pilih Peran (Role)
              </CardTitle>
              <CardDescription className="text-xs">
                Pilih peran pengguna untuk mengatur hak akses visual & operasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.values(roles).map((role) => {
                const isSelected = role.id === selectedRoleId;
                const isSuperAdminRole = role.id === "super_admin";
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-secondary/30 border-border hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {role.name}
                        </span>
                        {isSuperAdminRole && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
                            Full Access
                          </Badge>
                        )}
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                      {role.description}
                    </p>
                  </div>
                );
              })}

              <Separator className="my-4 bg-border" />

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-border text-muted-foreground hover:text-foreground"
                onClick={handleResetDefaults}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                Reset Konfigurasi ke Default
              </Button>
            </CardContent>
          </Card>

          {/* Right Main Panel: Permissions Config */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  Konfigurasi Izin: {activeRoleConfig.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Perubahan akan langsung berpengaruh di antarmuka aplikasi
                </p>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary uppercase text-xs">
                {activeRoleConfig.id}
              </Badge>
            </div>

            {/* Section 1: Menu Permissions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  1. Visibilitas Menu Navigasi Sidebar
                </CardTitle>
                <CardDescription className="text-xs">
                  Menu yang tidak dicentang/diaktifkan akan sepenuhnya tersembunyi dari navigasi role ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {ALL_MENUS.map((menu) => {
                  const isVisible = activeRoleConfig.visibleMenus?.includes(menu.id) ?? false;
                  const isRoleMgmtForNonSuper = menu.id === "role-management" && selectedRoleId !== "super_admin";

                  return (
                    <div
                      key={menu.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary shrink-0">
                          <menu.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{menu.label}</p>
                          <p className="text-xs text-muted-foreground">{menu.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isRoleMgmtForNonSuper ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md border border-border">
                            <Lock className="h-3 w-3 text-destructive" />
                            <span>Terkunci (Khusus Super Admin)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground cursor-pointer">
                              {isVisible ? "Tampil" : "Sembunyi"}
                            </Label>
                            <Switch
                              checked={isVisible}
                              onCheckedChange={() => handleToggleMenu(menu.id)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Section 2: Dashboard Widget Permissions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                  2. Visibilitas Widget Dashboard
                </CardTitle>
                <CardDescription className="text-xs">
                  Mengatur grafik atau KPI card yang tampil di halaman Dashboard utama. Layout akan otomatis menyesuaikan diri.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ALL_WIDGETS.map((widget) => {
                  const isVisible = activeRoleConfig.dashboardWidgets?.includes(widget.id) ?? false;
                  return (
                    <div
                      key={widget.id}
                      className="p-3.5 rounded-lg border border-border bg-secondary/20 flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{widget.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{widget.desc}</p>
                      </div>
                      <Switch
                        checked={isVisible}
                        onCheckedChange={() => handleToggleWidget(widget.id)}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Section 3: CRUD Permissions per Module */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-400" />
                  3. Izin Operasi CRUD Per Modul
                </CardTitle>
                <CardDescription className="text-xs">
                  Mengontrol visibilitas tombol Tambah, Edit, Hapus, serta akses detail di setiap modul aplikasi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ALL_MODULES.map((mod) => {
                  const modPerms = activeRoleConfig.permissions?.[mod.id] || {
                    read: true,
                    create: true,
                    update: true,
                    delete: true,
                  };

                  const isProtectedRoleMgmt = mod.id === "role_management" && selectedRoleId !== "super_admin";

                  return (
                    <div
                      key={mod.id}
                      className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{mod.label}</h4>
                          <p className="text-xs text-muted-foreground">{mod.desc}</p>
                        </div>
                        {isProtectedRoleMgmt && (
                          <Badge variant="outline" className="border-destructive/30 text-destructive text-[11px]">
                            Non-Configurable
                          </Badge>
                        )}
                      </div>

                      {isProtectedRoleMgmt ? (
                        <p className="text-xs text-muted-foreground italic">
                          Hanya Super Admin yang memiliki hak akses penuh untuk modul ini.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                          {/* Read */}
                          <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50 border border-border">
                            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                              <Eye className="h-3.5 w-3.5 text-blue-400" />
                              Read
                            </span>
                            <Switch
                              checked={modPerms.read}
                              onCheckedChange={() => handleToggleCrud(mod.id, "read")}
                            />
                          </div>

                          {/* Create */}
                          <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50 border border-border">
                            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                              <Plus className="h-3.5 w-3.5 text-emerald-400" />
                              Create
                            </span>
                            <Switch
                              checked={modPerms.create}
                              onCheckedChange={() => handleToggleCrud(mod.id, "create")}
                            />
                          </div>

                          {/* Update */}
                          <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50 border border-border">
                            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                              <Pencil className="h-3.5 w-3.5 text-amber-400" />
                              Update
                            </span>
                            <Switch
                              checked={modPerms.update}
                              onCheckedChange={() => handleToggleCrud(mod.id, "update")}
                            />
                          </div>

                          {/* Delete */}
                          <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50 border border-border">
                            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                              Delete
                            </span>
                            <Switch
                              checked={modPerms.delete}
                              onCheckedChange={() => handleToggleCrud(mod.id, "delete")}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
