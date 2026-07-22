import initialUserActivities from "@/data/user-activity.json";

export interface UserActivityItem {
  username: string;
  nama: string;
  role: string;
  roleLabel: string;
  lastLogin: string;
  lastActivity: string;
  totalLoginCount: number;
  totalActions: number;
  lastUpdatedRecord: string;
  isOnline: boolean;
}

const STORAGE_KEY = "rbac_user_activity";

export function getUserActivities(): UserActivityItem[] {
  if (typeof window === "undefined") return initialUserActivities as UserActivityItem[];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUserActivities));
    return initialUserActivities as UserActivityItem[];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialUserActivities as UserActivityItem[];
  }
}

export function recordUserLogin(username: string): void {
  if (typeof window === "undefined") return;
  const current = getUserActivities();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
    2,
    "0"
  )}:${String(now.getSeconds()).padStart(2, "0")}`;

  const updated = current.map((item) => {
    if (item.username === username) {
      return {
        ...item,
        lastLogin: formattedTime,
        lastActivity: "Berhasil Login ke Platform",
        totalLoginCount: (item.totalLoginCount || 0) + 1,
        isOnline: true,
      };
    }
    return item;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function recordUserAction(username: string, actionDesc: string, targetRecord: string = "-"): void {
  if (typeof window === "undefined") return;
  const current = getUserActivities();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
    2,
    "0"
  )}:${String(now.getSeconds()).padStart(2, "0")}`;

  const updated = current.map((item) => {
    if (item.username === username) {
      return {
        ...item,
        lastActivity: actionDesc,
        totalActions: (item.totalActions || 0) + 1,
        lastUpdatedRecord: targetRecord !== "-" ? targetRecord : item.lastUpdatedRecord,
        isOnline: true,
      };
    }
    return item;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
