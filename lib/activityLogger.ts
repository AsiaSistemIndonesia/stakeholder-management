import initialActivityLogs from "@/data/activity-log.json";

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  username: string;
  userNama?: string;
  role: string;
  module: string;
  action: string;
  description: string;
}

const STORAGE_KEY = "rbac_activity_log";

export function getActivityLogs(): ActivityLogItem[] {
  if (typeof window === "undefined") return initialActivityLogs as ActivityLogItem[];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialActivityLogs));
    return initialActivityLogs as ActivityLogItem[];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialActivityLogs as ActivityLogItem[];
  }
}

export function addActivityLog(item: Omit<ActivityLogItem, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;
  const current = getActivityLogs();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
    2,
    "0"
  )}:${String(now.getSeconds()).padStart(2, "0")}`;

  const newLog: ActivityLogItem = {
    ...item,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: formattedTime,
  };

  const updated = [newLog, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
