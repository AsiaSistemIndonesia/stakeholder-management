"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  StakeholderByZonaChart,
  StakeholderByKategoriChart,
  TrenBulananChart,
  RadarKategoriChart,
} from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { dashboardStats } from "@/lib/data";
import { Users, Building2, AlertTriangle, MapPin } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Selamat datang di Stakeholder Management Platform"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Stakeholder"
          value={dashboardStats.totalStakeholder}
          subtitle="Semua zona operasi"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Organisasi"
          value={dashboardStats.totalOrganisasi}
          subtitle="Terdaftar dalam sistem"
          icon={Building2}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Insiden Aktif"
          value={dashboardStats.insidenAktif}
          subtitle={`dari ${dashboardStats.totalInsiden} total`}
          icon={AlertTriangle}
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Zona Operasi"
          value={5}
          subtitle="Tersebar di Indonesia"
          icon={MapPin}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StakeholderByZonaChart />
        <StakeholderByKategoriChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrenBulananChart />
        <RadarKategoriChart />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </DashboardLayout>
  );
}
