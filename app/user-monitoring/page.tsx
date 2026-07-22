"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth/auth-provider";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/auth/access-denied";
import { getUserActivities, UserActivityItem } from "@/lib/userActivity";
import { SearchBar } from "@/components/shared/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Activity,
  UserCheck,
  Zap,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function UserMonitoringPage() {
  const { user: currentUser } = useAuth();
  const { hasMenuAccess } = usePermissions();

  const [activities, setActivities] = useState<UserActivityItem[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Dynamic status check: currentUser is online
    const list = getUserActivities().map((u) => {
      if (currentUser && u.username === currentUser.username) {
        return { ...u, isOnline: true };
      }
      return u;
    });
    setActivities(list);
  }, [currentUser]);

  // Route security check
  if (!currentUser || currentUser.role !== "super_admin" || !hasMenuAccess("user-monitoring")) {
    return (
      <AccessDenied
        title="Akses Ditolak - Modul User Activity Monitoring"
        message="Fitur monitoring aktivitas pengguna hanya dapat diakses oleh Super Admin."
      />
    );
  }

  const filtered = activities.filter((act) => {
    if (roleFilter !== "all" && act.role !== roleFilter) return false;
    if (userFilter !== "all" && act.username !== userFilter) return false;
    if (statusFilter !== "all") {
      const isOnline = statusFilter === "online";
      if (act.isOnline !== isOnline) return false;
    }

    if (search) {
      const q = search.toLowerCase();
      const matchName = act.nama.toLowerCase().includes(q);
      const matchUsername = act.username.toLowerCase().includes(q);
      const matchRole = act.roleLabel.toLowerCase().includes(q);
      const matchActivity = act.lastActivity.toLowerCase().includes(q);
      return matchName || matchUsername || matchRole || matchActivity;
    }
    return true;
  });

  const totalUsers = activities.length;
  const onlineCount = activities.filter((u) => u.isOnline).length;
  const totalActionsSum = activities.reduce((acc, u) => acc + (u.totalActions || 0), 0);
  const mostActive = [...activities].sort((a, b) => b.totalActions - a.totalActions)[0];

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setUserFilter("all");
    setStatusFilter("all");
  };

  return (
    <DashboardLayout
      title="User Activity Monitoring"
      subtitle="Monitoring perilaku pengguna, riwayat login, statistik aksi, dan status aktivitas real-time"
    >
      <div className="space-y-6">
        {/* KPI Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Pengguna</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{totalUsers}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Tersimpan di JSON</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pengguna Online</p>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{onlineCount}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Sesi aktif berjalan</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                <UserCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Aksi Tercatat</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{totalActionsSum}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Seluruh aktivitas user</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                <Zap className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">User Teraktif</p>
                <h3 className="text-lg font-bold text-foreground mt-1 truncate max-w-[140px]">
                  {mostActive?.nama || "-"}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {mostActive?.totalActions || 0} aksi dieksekusi
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                <Activity className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Activity Table Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Cari pengguna, nama, atau aktivitas..."
                className="max-w-md"
              />

              <div className="flex flex-wrap items-center gap-3">
                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border text-xs">
                    <SelectValue placeholder="Semua Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-xs">
                    <SelectItem value="all">Semua Role</SelectItem>
                    <SelectItem value="phase1">Phase 1</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>

                {/* User Filter */}
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border text-xs">
                    <SelectValue placeholder="Semua User" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-xs">
                    <SelectItem value="all">Semua User</SelectItem>
                    <SelectItem value="phase1">phase1</SelectItem>
                    <SelectItem value="admin">admin</SelectItem>
                    <SelectItem value="superadmin">superadmin</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border text-xs">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-xs">
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>

                {(search || roleFilter !== "all" || userFilter !== "all" || statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-xs text-muted-foreground hover:text-foreground px-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="text-muted-foreground font-medium">Pengguna</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Role</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Status Sesi</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Terakhir Login</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Aktivitas Terakhir</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Total Login</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Total Aksi</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Rekam Terakhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <TableRow key={item.username} className="hover:bg-secondary/30">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{item.nama}</p>
                            <p className="text-xs text-muted-foreground font-mono">@{item.username}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-border text-xs">
                            {item.roleLabel || item.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.isOnline ? (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1.5 w-fit">
                              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                              Online
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-secondary text-muted-foreground border-border flex items-center gap-1.5 w-fit">
                              <span className="h-2 w-2 rounded-full bg-slate-500" />
                              Offline
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {item.lastLogin}
                        </TableCell>
                        <TableCell className="text-xs text-foreground font-medium max-w-xs truncate">
                          {item.lastActivity}
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground text-sm">
                          {item.totalLoginCount}
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary text-sm">
                          {item.totalActions}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                          {item.lastUpdatedRecord}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                        Tidak ada pengguna yang sesuai dengan filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
