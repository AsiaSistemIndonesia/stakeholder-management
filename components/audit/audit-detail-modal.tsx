"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { AuditTrailItem } from "@/lib/auditLogger";
import {
  History,
  FileText,
  User,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AuditDetailModalProps {
  auditRecord: AuditTrailItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditDetailModal({
  auditRecord,
  open,
  onOpenChange,
}: AuditDetailModalProps) {
  if (!auditRecord) return null;

  const historyEvents = auditRecord.history || [
    {
      id: "h-current",
      timestamp: auditRecord.timestamp,
      username: auditRecord.username,
      action: auditRecord.action,
      description: auditRecord.summary,
    },
  ];

  const getActionBadgeColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("create")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (act.includes("update") || act.includes("rbac")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (act.includes("delete")) return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto overflow-x-hidden w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Detail Audit Trail & Field Change Tracking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2 w-full overflow-x-hidden">
          {/* Header Record Summary */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  {auditRecord.module} • ID: {auditRecord.recordId}
                </span>
                <h3 className="text-xl font-bold text-foreground mt-0.5">
                  {auditRecord.entityName}
                </h3>
              </div>
              <Badge variant="outline" className={`capitalize px-3 py-1 text-xs ${getActionBadgeColor(auditRecord.action)}`}>
                {auditRecord.action}
              </Badge>
            </div>

            <Separator className="bg-border" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  Dilakukan Oleh: <strong className="text-foreground">{auditRecord.userNama || auditRecord.username}</strong> ({auditRecord.role})
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Waktu: <strong className="text-foreground">{auditRecord.timestamp}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Aksi: <strong className="text-foreground">{auditRecord.summary}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 1: Field Change Tracking (Old vs New) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Field-Level Change Tracking ({auditRecord.changes?.length || 0} Field Diubah)
            </h4>

            {auditRecord.changes && auditRecord.changes.length > 0 ? (
              <div className="space-y-3">
                {auditRecord.changes.map((diff, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-lg border border-border bg-secondary/20 space-y-2"
                  >
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {diff.fieldName}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Previous Value */}
                      <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-rose-400 block">
                          Nilai Lama (Previous Value)
                        </span>
                        <p className="font-mono break-all">{diff.oldValue || "(Kosong / Tidak Ada)"}</p>
                      </div>

                      {/* New Value */}
                      <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                          Nilai Baru (New Value)
                        </span>
                        <p className="font-mono break-all">{diff.newValue || "(Kosong / Dihapus)"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic p-4 rounded-lg border border-border bg-secondary/10">
                Tidak ada perubahan field spesifik yang terdeteksi (Operasi Pembuatan Data Baru atau Hapus Total).
              </p>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Section 2: Chronological Timeline View */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Visualisasi Histori & Timeline Perubahan ({historyEvents.length} Peristiwa)
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {historyEvents.map((evt, idx) => (
                <div key={evt.id || idx} className="relative flex items-start gap-4 group">
                  {/* Circle Marker */}
                  <div className="absolute left-[-24px] top-0.5 h-4 w-4 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>

                  <div className="flex-1 bg-secondary/20 p-3 rounded-lg border border-border space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{evt.action}</span>
                      <span className="text-muted-foreground">{evt.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{evt.description}</p>
                    <p className="text-[11px] text-primary/80">Oleh: {evt.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Tutup
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
