"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth/auth-provider";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/auth/access-denied";
import { getAuditTrail, AuditTrailItem } from "@/lib/auditLogger";
import { AuditDetailModal } from "@/components/audit/audit-detail-modal";
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
import { ClipboardList, User, Eye, RotateCcw, ShieldCheck } from "lucide-react";

export default function AuditTrailPage() {
  const { user } = useAuth();
  const { hasMenuAccess } = usePermissions();

  const [records, setRecords] = useState<AuditTrailItem[]>([]);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const [selectedAudit, setSelectedAudit] = useState<AuditTrailItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setRecords(getAuditTrail());
  }, []);

  // Route security check
  if (!user || user.role !== "super_admin" || !hasMenuAccess("audit-trail")) {
    return (
      <AccessDenied
        title="Akses Ditolak - Modul Audit Trail"
        message="Fitur jejak audit perubahan data hanya dapat diakses oleh Super Admin."
      />
    );
  }

  const filteredRecords = records.filter((rec) => {
    if (userFilter !== "all" && rec.username !== userFilter) return false;
    if (moduleFilter !== "all" && rec.module.toLowerCase() !== moduleFilter.toLowerCase()) return false;
    if (actionFilter !== "all" && rec.action.toLowerCase() !== actionFilter.toLowerCase()) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchEntity = rec.entityName.toLowerCase().includes(q);
      const matchUser = rec.username.toLowerCase().includes(q) || (rec.userNama || "").toLowerCase().includes(q);
      const matchSummary = rec.summary.toLowerCase().includes(q);
      const matchRecordId = rec.recordId.toLowerCase().includes(q);
      return matchEntity || matchUser || matchSummary || matchRecordId;
    }
    return true;
  });

  const handleOpenDetail = (record: AuditTrailItem) => {
    setSelectedAudit(record);
    setModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch("");
    setUserFilter("all");
    setModuleFilter("all");
    setActionFilter("all");
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("create")) return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Create</Badge>;
    if (act.includes("update") || act.includes("rbac")) return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Update</Badge>;
    if (act.includes("delete")) return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">Delete</Badge>;
    return <Badge variant="outline" className="border-border">{action}</Badge>;
  };

  return (
    <DashboardLayout
      title="Audit Trail & Modification History"
      subtitle="Melacak setiap perubahan data pada Stakeholder, Organisasi, dan RBAC hingga ke tingkat field"
    >
      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-6">
          {/* Search & Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Cari entitas, pengguna, ID rekam, atau ringkasan perubahan..."
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

              {/* Module Filter */}
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[150px] bg-secondary border-border text-xs">
                  <SelectValue placeholder="Semua Modul" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-xs">
                  <SelectItem value="all">Semua Modul</SelectItem>
                  <SelectItem value="Stakeholder">Stakeholder</SelectItem>
                  <SelectItem value="Organization">Organization</SelectItem>
                  <SelectItem value="Role Management">Role Management</SelectItem>
                </SelectContent>
              </Select>

              {/* Action Filter */}
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[140px] bg-secondary border-border text-xs">
                  <SelectValue placeholder="Semua Aksi" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-xs">
                  <SelectItem value="all">Semua Aksi</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>

              {(search || userFilter !== "all" || moduleFilter !== "all" || actionFilter !== "all") && (
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
                  <TableHead className="text-muted-foreground font-medium w-[160px]">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Modul & Entitas</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Pengguna</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Aksi</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Ringkasan Perubahan</TableHead>
                  <TableHead className="text-muted-foreground font-medium w-[100px] text-right">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => handleOpenDetail(rec)}>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {rec.timestamp}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{rec.entityName}</p>
                          <span className="text-[11px] text-muted-foreground">
                            {rec.module} (ID: {rec.recordId})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <User className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-medium text-foreground">{rec.userNama || rec.username}</span>
                          <span className="text-muted-foreground">({rec.role})</span>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(rec.action)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {rec.summary}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-primary hover:text-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(rec);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Tidak ada rekam audit yang sesuai dengan filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Detail & Field-Level Tracking Modal */}
      <AuditDetailModal
        auditRecord={selectedAudit}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </DashboardLayout>
  );
}
