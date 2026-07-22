"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Stakeholder,
  Organisasi,
  stakeholderData as initialStakeholderData,
  organisasiData as initialOrganisasiData,
} from "./data";
import { getSessionUser } from "./auth";
import { addActivityLog } from "./activityLogger";
import { addAuditRecord } from "./auditLogger";
import { recordUserAction } from "./userActivity";
import { compareFields } from "./fieldComparator";

interface StakeholderContextType {
  stakeholders: Stakeholder[];
  organisasiList: Organisasi[];
  addStakeholder: (sh: Omit<Stakeholder, "id" | "createdAt" | "updatedAt">) => void;
  updateStakeholder: (id: string, sh: Partial<Stakeholder>) => void;
  deleteStakeholder: (id: string) => void;
  addOrganisasi: (org: Omit<Organisasi, "id">) => void;
  updateOrganisasi: (id: string, org: Partial<Organisasi>) => void;
  deleteOrganisasi: (id: string) => void;
}

const StakeholderContext = createContext<StakeholderContextType | undefined>(
  undefined
);

export function StakeholderProvider({ children }: { children: React.ReactNode }) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialStakeholderData);
  const [organisasiList, setOrganisasiList] = useState<Organisasi[]>(initialOrganisasiData);

  const getCurrentUser = () => {
    return getSessionUser() || { username: "system", role: "system", nama: "System User" };
  };

  const addStakeholder = (sh: Omit<Stakeholder, "id" | "createdAt" | "updatedAt">) => {
    const today = new Date().toISOString().split("T")[0];
    const primaryOrgId = sh.organisasiIds && sh.organisasiIds.length > 0 ? sh.organisasiIds[0] : (sh.organisasiId || "");
    const newStakeholder: Stakeholder = {
      ...sh,
      organisasiId: primaryOrgId,
      id: `sh-${Date.now()}`,
      createdAt: today,
      updatedAt: today,
    };

    setStakeholders((prev) => [newStakeholder, ...prev]);

    // Logging & Audit
    const user = getCurrentUser();
    addActivityLog({
      username: user.username,
      userNama: user.nama,
      role: user.role,
      module: "Stakeholder",
      action: "Create",
      description: `Membuat stakeholder baru '${newStakeholder.nama}' (Kategori: ${newStakeholder.kategori}).`,
    });

    addAuditRecord({
      module: "Stakeholder",
      entityName: newStakeholder.nama,
      recordId: newStakeholder.id,
      username: user.username,
      userNama: user.nama,
      role: user.role,
      action: "Create",
      summary: `Membuat data stakeholder '${newStakeholder.nama}'`,
      changes: compareFields({}, newStakeholder),
    });

    recordUserAction(user.username, `Membuat Stakeholder ${newStakeholder.nama}`, `${newStakeholder.nama} (${newStakeholder.id})`);
  };

  const updateStakeholder = (id: string, sh: Partial<Stakeholder>) => {
    const today = new Date().toISOString().split("T")[0];
    let oldItem: Stakeholder | undefined;
    let newItem: Stakeholder | undefined;

    setStakeholders((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldItem = item;
          newItem = {
            ...item,
            ...sh,
            organisasiId: sh.organisasiIds && sh.organisasiIds.length > 0 ? sh.organisasiIds[0] : (sh.organisasiId || item.organisasiId),
            updatedAt: today,
          };
          return newItem;
        }
        return item;
      })
    );

    if (oldItem && newItem) {
      const user = getCurrentUser();
      const diffs = compareFields(oldItem, newItem);
      const changesDesc = diffs.map((d) => d.fieldName).join(", ") || "Informasi stakeholder";

      addActivityLog({
        username: user.username,
        userNama: user.nama,
        role: user.role,
        module: "Stakeholder",
        action: "Update",
        description: `Memperbarui stakeholder '${newItem.nama}' (${changesDesc}).`,
      });

      addAuditRecord({
        module: "Stakeholder",
        entityName: newItem.nama,
        recordId: newItem.id,
        username: user.username,
        userNama: user.nama,
        role: user.role,
        action: "Update",
        summary: `Memperbarui ${changesDesc} pada stakeholder '${newItem.nama}'`,
        changes: diffs,
      });

      recordUserAction(user.username, `Memperbarui Stakeholder ${newItem.nama}`, `${newItem.nama} (${newItem.id})`);
    }
  };

  const deleteStakeholder = (id: string) => {
    const target = stakeholders.find((item) => item.id === id);
    setStakeholders((prev) => prev.filter((item) => item.id !== id));

    if (target) {
      const user = getCurrentUser();
      addActivityLog({
        username: user.username,
        userNama: user.nama,
        role: user.role,
        module: "Stakeholder",
        action: "Delete",
        description: `Menghapus data stakeholder '${target.nama}'.`,
      });

      addAuditRecord({
        module: "Stakeholder",
        entityName: target.nama,
        recordId: target.id,
        username: user.username,
        userNama: user.nama,
        role: user.role,
        action: "Delete",
        summary: `Menghapus stakeholder '${target.nama}'`,
        changes: compareFields(target, {}),
      });

      recordUserAction(user.username, `Menghapus Stakeholder ${target.nama}`, `${target.nama} (${target.id})`);
    }
  };

  const addOrganisasi = (org: Omit<Organisasi, "id">) => {
    const newOrg: Organisasi = {
      ...org,
      id: `org-${Date.now()}`,
    };
    setOrganisasiList((prev) => [newOrg, ...prev]);

    const user = getCurrentUser();
    addActivityLog({
      username: user.username,
      userNama: user.nama,
      role: user.role,
      module: "Organization",
      action: "Create",
      description: `Membuat organisasi baru '${newOrg.nama}' (Tipe: ${newOrg.tipe}).`,
    });

    addAuditRecord({
      module: "Organization",
      entityName: newOrg.nama,
      recordId: newOrg.id,
      username: user.username,
      userNama: user.nama,
      role: user.role,
      action: "Create",
      summary: `Membuat organisasi '${newOrg.nama}'`,
      changes: compareFields({}, newOrg),
    });

    recordUserAction(user.username, `Membuat Organisasi ${newOrg.nama}`, `${newOrg.nama} (${newOrg.id})`);
  };

  const updateOrganisasi = (id: string, org: Partial<Organisasi>) => {
    let oldItem: Organisasi | undefined;
    let newItem: Organisasi | undefined;

    setOrganisasiList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldItem = item;
          newItem = { ...item, ...org };
          return newItem;
        }
        return item;
      })
    );

    if (oldItem && newItem) {
      const user = getCurrentUser();
      const diffs = compareFields(oldItem, newItem);
      const changesDesc = diffs.map((d) => d.fieldName).join(", ") || "Informasi organisasi";

      addActivityLog({
        username: user.username,
        userNama: user.nama,
        role: user.role,
        module: "Organization",
        action: "Update",
        description: `Memperbarui organisasi '${newItem.nama}' (${changesDesc}).`,
      });

      addAuditRecord({
        module: "Organization",
        entityName: newItem.nama,
        recordId: newItem.id,
        username: user.username,
        userNama: user.nama,
        role: user.role,
        action: "Update",
        summary: `Memperbarui ${changesDesc} pada organisasi '${newItem.nama}'`,
        changes: diffs,
      });

      recordUserAction(user.username, `Memperbarui Organisasi ${newItem.nama}`, `${newItem.nama} (${newItem.id})`);
    }
  };

  const deleteOrganisasi = (id: string) => {
    const target = organisasiList.find((item) => item.id === id);
    setOrganisasiList((prev) => prev.filter((item) => item.id !== id));

    if (target) {
      const user = getCurrentUser();
      addActivityLog({
        username: user.username,
        userNama: user.nama,
        role: user.role,
        module: "Organization",
        action: "Delete",
        description: `Menghapus organisasi '${target.nama}'.`,
      });

      addAuditRecord({
        module: "Organization",
        entityName: target.nama,
        recordId: target.id,
        username: user.username,
        userNama: user.nama,
        role: user.role,
        action: "Delete",
        summary: `Menghapus organisasi '${target.nama}'`,
        changes: compareFields(target, {}),
      });

      recordUserAction(user.username, `Menghapus Organisasi ${target.nama}`, `${target.nama} (${target.id})`);
    }
  };

  return (
    <StakeholderContext.Provider
      value={{
        stakeholders,
        organisasiList,
        addStakeholder,
        updateStakeholder,
        deleteStakeholder,
        addOrganisasi,
        updateOrganisasi,
        deleteOrganisasi,
      }}
    >
      {children}
    </StakeholderContext.Provider>
  );
}

export function useStakeholderContext() {
  const context = useContext(StakeholderContext);
  if (!context) {
    throw new Error(
      "useStakeholderContext must be used within a StakeholderProvider"
    );
  }
  return context;
}
