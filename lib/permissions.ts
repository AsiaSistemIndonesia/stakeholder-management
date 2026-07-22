import rolesConfig from "@/config/roles.json";
import { getSessionUser } from "./auth";

export function getUserMenus(): string[] {
  const user = getSessionUser();
  if (!user) return [];
  const roleData = (rolesConfig as Record<string, any>)[user.role];
  if (!roleData || !roleData.menus) return [];
  return roleData.menus;
}

export function hasMenuAccess(menu: string): boolean {
  const menus = getUserMenus();
  return menus.includes(menu);
}
