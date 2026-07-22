"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StakeholderTable } from "@/components/stakeholder/stakeholder-table";
import { StakeholderFormModal } from "@/components/stakeholder/stakeholder-form-modal";
import { OrgFormModal } from "@/components/organisasi/org-form-modal";
import { OrgCard } from "@/components/organisasi/org-card";
import { OrgChart } from "@/components/organisasi/org-chart";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar, FilterState } from "@/components/shared/filter-bar";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStakeholderContext } from "@/lib/stakeholder-context";
import { Organisasi } from "@/lib/data";
import { Users, Building2, Plus, LayoutGrid, Network } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/auth/access-denied";

export default function StakeholderPage() {
  const { hasMenuAccess, hasCrudPermission } = usePermissions();
  const { organisasiList, deleteOrganisasi } = useStakeholderContext();

  const canReadStakeholder = hasCrudPermission("stakeholder", "read");
  const canCreateStakeholder = hasCrudPermission("stakeholder", "create");

  const canReadOrganisasi = hasCrudPermission("organisasi", "read");
  const canCreateOrganisasi = hasCrudPermission("organisasi", "create");
  const canUpdateOrganisasi = hasCrudPermission("organisasi", "update");
  const canDeleteOrganisasi = hasCrudPermission("organisasi", "delete");

  // Top level active tab: stakeholder vs organisasi
  const [activeTab, setActiveTab] = useState<"stakeholder" | "organisasi">("stakeholder");

  // Stakeholder filters & modals
  const [stakeholderFilters, setStakeholderFilters] = useState<FilterState>({
    kategori: "all",
    organisasi: "all",
    zona: "all",
    status: "all",
  });
  const [stakeholderSearch, setStakeholderSearch] = useState("");
  const [stakeholderModalOpen, setStakeholderModalOpen] = useState(false);

  // Organisasi filters & modals
  const [orgSearch, setOrgSearch] = useState("");
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [orgModalMode, setOrgModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedOrg, setSelectedOrg] = useState<Organisasi | null>(null);

  const [orgDeleteOpen, setOrgDeleteOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<Organisasi | null>(null);

  // Filtered organizations
  const filteredOrgs = organisasiList.filter((org) =>
    org.nama.toLowerCase().includes(orgSearch.toLowerCase()) ||
    org.deskripsi.toLowerCase().includes(orgSearch.toLowerCase()) ||
    org.tipe.toLowerCase().includes(orgSearch.toLowerCase())
  );

  // Route security check
  if (!hasMenuAccess("stakeholder")) {
    return (
      <AccessDenied
        title="Akses Ditolak - Modul Stakeholder"
        message="Anda tidak memiliki hak akses untuk membuka modul Stakeholder & Manajemen Organisasi."
      />
    );
  }

  const handleAddStakeholder = () => {
    setStakeholderModalOpen(true);
  };

  const handleAddOrganisasi = () => {
    setSelectedOrg(null);
    setOrgModalMode("add");
    setOrgModalOpen(true);
  };

  const handleViewOrg = (org: Organisasi) => {
    setSelectedOrg(org);
    setOrgModalMode("view");
    setOrgModalOpen(true);
  };

  const handleEditOrg = (org: Organisasi) => {
    setSelectedOrg(org);
    setOrgModalMode("edit");
    setOrgModalOpen(true);
  };

  const handleDeleteOrgTrigger = (org: Organisasi) => {
    setOrgToDelete(org);
    setOrgDeleteOpen(true);
  };

  const handleConfirmDeleteOrg = () => {
    if (orgToDelete) {
      deleteOrganisasi(orgToDelete.id);
      setOrgToDelete(null);
      setOrgDeleteOpen(false);
    }
  };

  return (
    <DashboardLayout
      title="Stakeholder Management"
      subtitle="Kelola data stakeholder dan organisasi mitra dalam satu platform terpadu"
    >
      <Tabs
        value={activeTab}
        onValueChange={(val: any) => setActiveTab(val)}
        className="w-full space-y-6"
      >
        {/* Top Module Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <TabsList className="bg-secondary p-1 border border-border">
            <TabsTrigger
              value="stakeholder"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium text-sm px-4 py-2"
            >
              <Users className="h-4 w-4 mr-2" />
              Data Stakeholders
            </TabsTrigger>
            <TabsTrigger
              value="organisasi"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium text-sm px-4 py-2"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Manajemen Organisasi
            </TabsTrigger>
          </TabsList>

          {/* Dynamic Add Button depending on active tab */}
          {activeTab === "stakeholder" ? (
            canCreateStakeholder ? (
              <Button
                onClick={handleAddStakeholder}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stakeholder
              </Button>
            ) : null
          ) : (
            canCreateOrganisasi ? (
              <Button
                onClick={handleAddOrganisasi}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            ) : null
          )}
        </div>

        {/* Tab 1: Stakeholders */}
        <TabsContent value="stakeholder" className="mt-0 space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-6">
              {/* Search & Filters */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                <SearchBar
                  value={stakeholderSearch}
                  onChange={setStakeholderSearch}
                  placeholder="Cari nama stakeholder, jabatan, email, atau organisasi..."
                  className="max-w-md"
                />
                <FilterBar
                  filters={stakeholderFilters}
                  onFilterChange={setStakeholderFilters}
                  organisasiList={organisasiList}
                />
              </div>

              {/* Stakeholder Table */}
              <StakeholderTable
                filters={{
                  ...stakeholderFilters,
                  search: stakeholderSearch,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Organizations */}
        <TabsContent value="organisasi" className="mt-0 space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-6">
              {/* Header & Sub View Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <SearchBar
                  value={orgSearch}
                  onChange={setOrgSearch}
                  placeholder="Cari organisasi..."
                  className="max-w-md"
                />
              </div>

              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="bg-secondary border border-border mb-6">
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-background text-xs"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger
                    value="chart"
                    className="data-[state=active]:bg-background text-xs"
                  >
                    <Network className="h-4 w-4 mr-2" />
                    Org Chart
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="mt-0">
                  {filteredOrgs.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredOrgs.map((org) => (
                        <OrgCard
                          key={org.id}
                          organisasi={org}
                          onClick={() => handleViewOrg(org)}
                          onEdit={canUpdateOrganisasi ? () => handleEditOrg(org) : undefined}
                          onDelete={canDeleteOrganisasi ? () => handleDeleteOrgTrigger(org) : undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                      Tidak ada organisasi yang sesuai dengan pencarian.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="chart" className="mt-0">
                  <OrgChart />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Stakeholder Modal */}
      <StakeholderFormModal
        open={stakeholderModalOpen}
        onOpenChange={setStakeholderModalOpen}
        mode="add"
      />

      {/* Org Modal (Add/Edit/View) */}
      <OrgFormModal
        open={orgModalOpen}
        onOpenChange={setOrgModalOpen}
        mode={orgModalMode}
        organisasi={selectedOrg}
      />

      {/* Org Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={orgDeleteOpen}
        onOpenChange={setOrgDeleteOpen}
        onConfirm={handleConfirmDeleteOrg}
        itemTitle={orgToDelete?.nama}
      />
    </DashboardLayout>
  );
}
