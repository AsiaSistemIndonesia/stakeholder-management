"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth/auth-provider";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/auth/access-denied";
import { getActivityLogs, ActivityLogItem } from "@/lib/activityLogger";
import { SearchBar } from "@/components/shared/search-bar";
import { Card, CardContent } from "@/components/ui/card";
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
import { History, User, ShieldCheck, Filter, RotateCcw } from "lucide-react";

export default function ActivityLogPage() {
  const { user } = useAuth();
  const { hasMenuAccess } = usePermissions();

  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    setLogs(getActivityLogs());
  }, []);

  // Route security check
  if (!user || user.role !== "super_admin" || !hasMenuAccess("activity-log")) {
    return (
      <AccessDenied
        title="Akses Ditolak - Modul Activity Logging"
        message="Fitur pencatatan log aktivitas sistem hanya dapat diakses oleh Super Admin."
      />
    );
  }

  const filteredLogs = logs.filter((log) => {
    if (userFilter !== "all" && log.username !== userFilter) return false;
    if (roleFilter !== "all" && log.role !== roleFilter) return false;
    if (moduleFilter !== "all" && log.module.toLowerCase() !== moduleFilter.toLowerCase()) return false;
    if (actionFilter !== "all" && log.action.toLowerCase() !== actionFilter.toLowerCase()) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchUser = log.username.toLowerCase().includes(q) || (log.userNama || "").toLowerCase().includes(q);
      const matchModule = log.module.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchDesc = log.description.toLowerCase().includes(q);
      return matchUser || matchModule || matchAction || matchDesc;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSearch("");
    setUserFilter("all");
    setRoleFilter("all");
    setModuleFilter("all");
    setActionFilter("all");
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("login")) return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Login</Badge>;
    if (act.includes("logout")) return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Logout</Badge>;
    if (act.includes("create")) return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Create</Badge>;
    if (act.includes("update") || act.includes("rbac")) return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Update</Badge>;
    if (act.includes("delete")) return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">Delete</Badge>;
    return <Badge variant="outline" className="border-border">{action}</Badge>;
  };

  return (
    <DashboardLayout
      title="Activity Logging"
      subtitle="Jejak pencatatan lengkap seluruh aktivitas pengguna dan peristiwa aplikasi (Khusus Super Admin)"
    >
      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-6">
          {/* Header Controls: Search & Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Cari pengguna, modul, aksi, atau deskripsi..."
                className="max-w-md"
              />

              <div className="flex flex-wrap items-center gap-3">
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

                {/* Module Filter */}
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-[150px] bg-secondary border-border text-xs">
                    <SelectValue placeholder="Semua Modul" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-xs">
                    <SelectItem value="all">Semua Modul</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Stakeholder">Stakeholder</SelectItem>
                    <SelectItem value="Organization">Organization</SelectItem>
                    <SelectItem value="Role Management">Role Management</SelectItem>
                  </SelectContent>
                </Select>

                {(search || userFilter !== "all" || roleFilter !== "all" || moduleFilter !== "all" || actionFilter !== "all") && (
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
          </div>

          {/* Activity Table */}
          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="text-muted-foreground font-medium w-[160px]">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Pengguna</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Role</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Modul</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Aksi</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Deskripsi Peristiwa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-secondary/30">
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-medium text-foreground text-sm">
                            {log.userNama || log.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border text-xs capitalize">
                          {log.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground font-medium">
                        {log.module}
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md">
                        {log.description}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Tidak ada log aktivitas yang sesuai dengan kriteria pencarian.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
