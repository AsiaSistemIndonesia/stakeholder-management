"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StakeholderTable } from "@/components/stakeholder/stakeholder-table";
import { StakeholderFilters } from "@/components/stakeholder/stakeholder-filters";
import { Card, CardContent } from "@/components/ui/card";

export default function StakeholderPage() {
  const [filters, setFilters] = useState({
    kategori: "all",
    organisasi: "all",
    zona: "all",
    search: "",
  });

  return (
    <DashboardLayout
      title="Manajemen Stakeholder"
      subtitle="Kelola data stakeholder dari seluruh zona operasi"
    >
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <StakeholderFilters filters={filters} onFiltersChange={setFilters} />
          <div className="mt-6">
            <StakeholderTable filters={filters} />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
