"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrgCard } from "@/components/organisasi/org-card";
import { OrgChart } from "@/components/organisasi/org-chart";
import { OrgDetailModal } from "@/components/organisasi/org-detail-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { organisasiData, Organisasi } from "@/lib/data";
import { Search, Plus, LayoutGrid, Network } from "lucide-react";

export default function OrganisasiPage() {
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organisasi | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredOrgs = organisasiData.filter((org) =>
    org.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrgClick = (org: Organisasi) => {
    setSelectedOrg(org);
    setDetailOpen(true);
  };

  return (
    <DashboardLayout
      title="Manajemen Organisasi"
      subtitle="Kelola data organisasi dan struktur hierarki"
    >
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari organisasi..."
                className="pl-9 bg-secondary border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Organisasi
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="bg-secondary border border-border mb-6">
              <TabsTrigger value="grid" className="data-[state=active]:bg-background">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="chart" className="data-[state=active]:bg-background">
                <Network className="h-4 w-4 mr-2" />
                Org Chart
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrgs.map((org) => (
                  <OrgCard
                    key={org.id}
                    organisasi={org}
                    onClick={() => handleOrgClick(org)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chart" className="mt-0">
              <OrgChart />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <OrgDetailModal
        organisasi={selectedOrg}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </DashboardLayout>
  );
}
