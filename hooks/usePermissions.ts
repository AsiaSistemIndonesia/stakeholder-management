"use client";

import { useRbac } from "@/lib/rbac-context";

export function usePermissions() {
  const {
    roles,
    updateRole,
    resetToDefault,
    hasMenuAccess,
    hasWidgetAccess,
    hasCrudPermission,
  } = useRbac();

  return {
    roles,
    updateRole,
    resetToDefault,
    hasMenuAccess,
    hasWidgetAccess,
    hasCrudPermission,
  };
}
