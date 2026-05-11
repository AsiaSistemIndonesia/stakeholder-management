"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FunctionTree } from "@/components/fungsi/function-tree";
import { FunctionOverview } from "@/components/fungsi/function-overview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fungsiData } from "@/lib/data";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

export default function FungsiPage() {
  const [search, setSearch] = useState("");

  const filteredFungsi = fungsiData.filter((fungsi) =>
    fungsi.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Struktur Fungsi"
      subtitle="Kelola struktur fungsi lintas organisasi"
    >
      {/* Overview Cards */}
      <div className="mb-6">
        <FunctionOverview />
      </div>

      {/* Main Content */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari fungsi..."
                className="pl-9 bg-secondary border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Fungsi
            </Button>
          </div>

          {/* Function Trees */}
          <div className="space-y-4">
            {filteredFungsi.length > 0 ? (
              filteredFungsi.map((fungsi) => (
                <FunctionTree key={fungsi.id} fungsi={fungsi} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Tidak ada fungsi yang ditemukan
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
