"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import defaultRolesConfig from "@/config/roles.json";
import { useAuth } from "@/components/auth/auth-provider";
import { addActivityLog } from "./activityLogger";
import { addAuditRecord } from "./auditLogger";
import { recordUserAction } from "./userActivity";
import { compareFields } from "./fieldComparator";

export interface ModulePermissions {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface RoleConfig {
  id: string;
  name: string;
  description: string;
  visibleMenus: string[];
  dashboardWidgets: string[];
  permissions: Record<string, ModulePermissions>;
}

export type RolesMap = Record<string, RoleConfig>;

interface RbacContextType {
  roles: RolesMap;
  updateRole: (roleId: string, updatedConfig: RoleConfig) => void;
  resetToDefault: () => void;
  hasMenuAccess: (menuId: string) => boolean;
  hasWidgetAccess: (widgetId: string) => boolean;
  hasCrudPermission: (moduleName: string, action: "read" | "create" | "update" | "delete") => boolean;
}

const STORAGE_KEY = "rbac_roles_config";

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export function RbacProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [roles, setRoles] = useState<RolesMap>(defaultRolesConfig as unknown as RolesMap);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRoles(parsed);
        } catch {
          setRoles(defaultRolesConfig as unknown as RolesMap);
        }
      }
    }
  }, []);

  const saveRoles = (newRoles: RolesMap) => {
    setRoles(newRoles);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRoles));
    }
  };

  const updateRole = useCallback(
    (roleId: string, updatedConfig: RoleConfig) => {
      setRoles((prev) => {
        const oldConfig = prev[roleId];
        const next = {
          ...prev,
          [roleId]: updatedConfig,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

          const activeUsername = user?.username || "system";
          const activeRole = user?.role || "system";

          addActivityLog({
            username: activeUsername,
            userNama: user?.nama,
            role: activeRole,
            module: "Role Management",
            action: "RBAC Update",
            description: `Mengubah konfigurasi izin menu, widget, dan CRUD untuk peran '${updatedConfig.name}'.`,
          });

          if (oldConfig) {
            const diffs = compareFields(oldConfig, updatedConfig);
            addAuditRecord({
              module: "Role Management",
              entityName: `Konfigurasi Peran: ${updatedConfig.name}`,
              recordId: `role-${roleId}`,
              username: activeUsername,
              userNama: user?.nama,
              role: activeRole,
              action: "RBAC Update",
              summary: `Memperbarui izin RBAC untuk peran ${updatedConfig.name}`,
              changes: diffs,
            });
          }

          recordUserAction(activeUsername, `Mengubah Konfigurasi RBAC (${updatedConfig.name})`, `Role: ${updatedConfig.name}`);
        }
        return next;
      });
    },
    [user]
  );

  const resetToDefault = useCallback(() => {
    saveRoles(defaultRolesConfig as unknown as RolesMap);
    if (user) {
      addActivityLog({
        username: user.username,
        userNama: user.nama,
        role: user.role,
        module: "Role Management",
        action: "Reset Defaults",
        description: `Mereset seluruh konfigurasi RBAC ke pengaturan default JSON.`,
      });
      recordUserAction(user.username, "Reset Konfigurasi RBAC ke Default", "Full System RBAC");
    }
  }, [user]);

  const currentRoleConfig = user ? roles[user.role] : null;

  const hasMenuAccess = useCallback(
    (menuId: string): boolean => {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      if (!currentRoleConfig) return false;
      return currentRoleConfig.visibleMenus?.includes(menuId) ?? false;
    },
    [user, currentRoleConfig]
  );

  const hasWidgetAccess = useCallback(
    (widgetId: string): boolean => {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      if (!currentRoleConfig) return false;
      return currentRoleConfig.dashboardWidgets?.includes(widgetId) ?? false;
    },
    [user, currentRoleConfig]
  );

  const hasCrudPermission = useCallback(
    (moduleName: string, action: "read" | "create" | "update" | "delete"): boolean => {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      if (!currentRoleConfig) return false;
      const modPerms = currentRoleConfig.permissions?.[moduleName];
      if (!modPerms) return false;
      return !!modPerms[action];
    },
    [user, currentRoleConfig]
  );

  return (
    <RbacContext.Provider
      value={{
        roles,
        updateRole,
        resetToDefault,
        hasMenuAccess,
        hasWidgetAccess,
        hasCrudPermission,
      }}
    >
      {children}
    </RbacContext.Provider>
  );
}

export function useRbac() {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error("useRbac must be used within an RbacProvider");
  }
  return context;
}
