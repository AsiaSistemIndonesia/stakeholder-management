"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  StakeholderByZonaChart,
  OrganizationBreakdownChart,
  MonthlyTrendChart,
} from "@/components/dashboard/charts";
import { 
  stakeholderData, 
  organisasiData, 
  zonaOperasiData, 
  insidenData 
} from "@/lib/data";
import { Users, Building2, AlertTriangle, MapPin } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export default function DashboardPage() {
  const { hasWidgetAccess } = usePermissions();
  const [filterOrg, setFilterOrg] = useState("all");
  const [filterZone, setFilterZone] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const { filteredStakeholders, filteredInsidens, stats, chartsData } = useMemo(() => {
    let stakeholders = stakeholderData;
    let insidens = insidenData;

    // Apply Filters
    if (filterOrg !== "all") {
      stakeholders = stakeholders.filter(s => s.organisasiId === filterOrg);
    }
    if (filterZone !== "all") {
      stakeholders = stakeholders.filter(s => s.zonaOperasi === filterZone);
      insidens = insidens.filter(i => i.zonaOperasi === filterZone);
    }
    if (filterCategory !== "all") {
      stakeholders = stakeholders.filter(s => s.kategori === filterCategory);
    }
    if (filterMonth !== "all") {
      stakeholders = stakeholders.filter(s => s.createdAt.startsWith(filterMonth));
      insidens = insidens.filter(i => i.tanggal.startsWith(filterMonth));
    }

    // Stats
    const totalStakeholder = stakeholders.length;
    
    // Unique organizations in filtered stakeholders
    const uniqueOrgs = new Set(stakeholders.map(s => s.organisasiId));
    const totalOrganisasi = uniqueOrgs.size;
    
    const insidenAktif = insidens.filter(i => i.status !== "selesai").length;
    const totalInsiden = insidens.length;
    
    const uniqueZones = new Set(stakeholders.map(s => s.zonaOperasi));
    const totalZones = uniqueZones.size;

    // Charts Data
    
    // 1. Organization Breakdown
    const orgMap: Record<string, number> = {};
    stakeholders.forEach(s => {
      const orgName = organisasiData.find(o => o.id === s.organisasiId)?.nama || "Unknown";
      orgMap[orgName] = (orgMap[orgName] || 0) + 1;
    });
    const orgChartData = Object.entries(orgMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);

    // 2. Zone Breakdown
    const zoneMap: Record<string, number> = {};
    stakeholders.forEach(s => {
      const zoneName = zonaOperasiData.find(z => z.id === s.zonaOperasi)?.nama || "Unknown";
      zoneMap[zoneName] = (zoneMap[zoneName] || 0) + 1;
    });
    const zoneChartData = Object.entries(zoneMap).map(([name, value]) => ({ name: name.replace("Zona ", ""), value }));

    // 3. Monthly Trend
    const monthMap: Record<string, { insiden: number, stakeholder: number }> = {};
    stakeholders.forEach(s => {
      const month = s.createdAt.substring(0, 7); // YYYY-MM
      if (!monthMap[month]) monthMap[month] = { insiden: 0, stakeholder: 0 };
      monthMap[month].stakeholder++;
    });
    insidens.forEach(i => {
      const month = i.tanggal.substring(0, 7);
      if (!monthMap[month]) monthMap[month] = { insiden: 0, stakeholder: 0 };
      monthMap[month].insiden++;
    });
    
    const trendChartData = Object.entries(monthMap).sort((a,b) => a[0].localeCompare(b[0])).map(([month, counts]) => ({
      bulan: month,
      ...counts
    }));

    return {
      filteredStakeholders: stakeholders,
      filteredInsidens: insidens,
      stats: { totalStakeholder, totalOrganisasi, insidenAktif, totalInsiden, totalZones },
      chartsData: { orgChartData, zoneChartData, trendChartData }
    };
  }, [filterOrg, filterZone, filterCategory, filterMonth]);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Selamat datang di Stakeholder Management Platform"
    >
      {/* Dashboard Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Organisasi</label>
          <select 
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground"
            value={filterOrg} 
            onChange={e => setFilterOrg(e.target.value)}
          >
            <option value="all">Semua Organisasi</option>
            {organisasiData.map(o => <option key={o.id} value={o.id}>{o.nama}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Zona Operasi</label>
          <select 
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground"
            value={filterZone} 
            onChange={e => setFilterZone(e.target.value)}
          >
            <option value="all">Semua Zona</option>
            {zonaOperasiData.map(z => <option key={z.id} value={z.id}>{z.nama}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Kategori</label>
          <select 
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground"
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            <option value="customer">Customer</option>
            <option value="pemerintah">Pemerintah</option>
            <option value="komunitas">Komunitas</option>
            <option value="mitra">Mitra</option>
            <option value="internal">Internal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Bulan</label>
          <select 
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground"
            value={filterMonth} 
            onChange={e => setFilterMonth(e.target.value)}
          >
            <option value="all">Semua Waktu</option>
            <option value="2024-01">Januari 2024</option>
            <option value="2024-02">Februari 2024</option>
            <option value="2024-03">Maret 2024</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      {hasWidgetAccess("stats") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Stakeholder"
            value={stats.totalStakeholder}
            subtitle="Sesuai filter"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Organisasi"
            value={stats.totalOrganisasi}
            subtitle="Terkait stakeholder"
            icon={Building2}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Insiden Aktif"
            value={stats.insidenAktif}
            subtitle={`dari ${stats.totalInsiden} total`}
            icon={AlertTriangle}
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Zona Operasi"
            value={stats.totalZones}
            subtitle="Terkait stakeholder"
            icon={MapPin}
          />
        </div>
      )}

      {/* Middle Charts Grid (Org & Zone) */}
      {(() => {
        const showOrg = hasWidgetAccess("orgBreakdown");
        const showZone = hasWidgetAccess("zoneBreakdown");

        if (!showOrg && !showZone) return null;

        const gridColsClass =
          showOrg && showZone ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1";

        return (
          <div className={`grid ${gridColsClass} gap-6 mb-6`}>
            {showOrg && <OrganizationBreakdownChart data={chartsData.orgChartData} />}
            {showZone && <StakeholderByZonaChart data={chartsData.zoneChartData} />}
          </div>
        );
      })()}

      {/* Monthly Trend Chart */}
      {hasWidgetAccess("monthlyTrend") && (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <MonthlyTrendChart data={chartsData.trendChartData} />
        </div>
      )}
    </DashboardLayout>
  );
}
