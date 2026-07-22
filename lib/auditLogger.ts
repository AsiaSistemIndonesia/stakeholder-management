import initialAuditTrail from "@/data/audit-trail.json";
import { FieldDiff } from "./fieldComparator";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  description: string;
}

export interface AuditTrailItem {
  id: string;
  timestamp: string;
  module: string;
  entityName: string;
  recordId: string;
  username: string;
  userNama?: string;
  role: string;
  action: string;
  summary: string;
  changes: FieldDiff[];
  history?: TimelineEvent[];
}

const STORAGE_KEY = "rbac_audit_trail";

export function getAuditTrail(): AuditTrailItem[] {
  if (typeof window === "undefined") return initialAuditTrail as AuditTrailItem[];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAuditTrail));
    return initialAuditTrail as AuditTrailItem[];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialAuditTrail as AuditTrailItem[];
  }
}

export function addAuditRecord(item: Omit<AuditTrailItem, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;
  const current = getAuditTrail();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
    2,
    "0"
  )}:${String(now.getSeconds()).padStart(2, "0")}`;

  // Check if entity has previous timeline history
  const previousRecord = current.find((r) => r.recordId === item.recordId);
  const existingHistory = previousRecord?.history || [
    {
      id: `h-init-${item.recordId}`,
      timestamp: formattedTime,
      username: item.username,
      action: "Created",
      description: `Rekam data ${item.entityName} dibuat di sistem`,
    },
  ];

  const newHistoryEvent: TimelineEvent = {
    id: `h-${Date.now()}`,
    timestamp: formattedTime,
    username: item.username,
    action: item.action,
    description: item.summary,
  };

  const newAudit: AuditTrailItem = {
    ...item,
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: formattedTime,
    history: [newHistoryEvent, ...existingHistory],
  };

  const updated = [newAudit, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
