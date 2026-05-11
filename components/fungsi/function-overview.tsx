"use client";

import { Card, CardContent } from "@/components/ui/card";
import { fungsiData, getStakeholderById, getOrganisasiById } from "@/lib/data";
import { Network, Users, Building2 } from "lucide-react";

export function FunctionOverview() {
  const stats = fungsiData.map((fungsi) => {
    const uniqueOrgs = new Set(
      fungsi.anggota
        .map((a) => {
          const sh = getStakeholderById(a.stakeholderId);
          return sh?.organisasiId;
        })
        .filter(Boolean)
    );

    return {
      fungsi,
      memberCount: fungsi.anggota.length,
      orgCount: uniqueOrgs.size,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map(({ fungsi, memberCount, orgCount }) => (
        <Card key={fungsi.id} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${fungsi.warna}20` }}
              >
                <Network className="h-6 w-6" style={{ color: fungsi.warna }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{fungsi.nama}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {fungsi.deskripsi}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Users
                      className="h-4 w-4"
                      style={{ color: fungsi.warna }}
                    />
                    <span className="text-foreground font-medium">
                      {memberCount}
                    </span>
                    <span className="text-muted-foreground">anggota</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Building2
                      className="h-4 w-4"
                      style={{ color: fungsi.warna }}
                    />
                    <span className="text-foreground font-medium">
                      {orgCount}
                    </span>
                    <span className="text-muted-foreground">organisasi</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
