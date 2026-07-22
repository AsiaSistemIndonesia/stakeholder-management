"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Fungsi,
  getStakeholderById,
  getOrganisasiById,
  kategoriColors,
} from "@/lib/data";
import { Network, ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FunctionTreeProps {
  fungsi: Fungsi;
}

export function FunctionTree({ fungsi }: FunctionTreeProps) {
  const [expanded, setExpanded] = useState(true);

  // Build hierarchy
  const topLevel = fungsi.anggota.filter((a) => a.level === 1);
  const getSubordinates = (stakeholderId: string) => {
    return fungsi.anggota.filter((a) => a.atasanId === stakeholderId);
  };

  const renderMember = (
    member: (typeof fungsi.anggota)[0],
    isLast: boolean,
    depth: number
  ) => {
    const stakeholder = getStakeholderById(member.stakeholderId);
    const orgId = stakeholder?.organisasiIds?.[0] || stakeholder?.organisasiId;
    const org = orgId ? getOrganisasiById(orgId) : null;
    const subordinates = getSubordinates(member.stakeholderId);

    if (!stakeholder) return null;

    return (
      <div key={member.stakeholderId} className="relative">
        {/* Connector */}
        {depth > 0 && (
          <>
            <div
              className="absolute left-[-32px] top-0 w-8 border-l-2 border-b-2 border-border rounded-bl-lg"
              style={{ height: "32px" }}
            />
            {!isLast && (
              <div
                className="absolute left-[-32px] top-0 border-l-2 border-border"
                style={{ height: "100%" }}
              />
            )}
          </>
        )}

        {/* Member Card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-transparent hover:border-border">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback
              style={{
                backgroundColor: kategoriColors[stakeholder.kategori],
                color: "white",
              }}
            >
              {stakeholder.nama
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {stakeholder.nama}
            </p>
            <p
              className="text-xs font-medium truncate"
              style={{ color: fungsi.warna }}
            >
              {member.peran}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {org?.nama}
            </p>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 text-xs"
            style={{
              borderColor: fungsi.warna,
              color: fungsi.warna,
            }}
          >
            Level {member.level}
          </Badge>
        </div>

        {/* Subordinates */}
        {subordinates.length > 0 && (
          <div className="ml-10 mt-2 space-y-2 relative">
            {subordinates.map((sub, index) =>
              renderMember(sub, index === subordinates.length - 1, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${fungsi.warna}20` }}
            >
              <Network className="h-5 w-5" style={{ color: fungsi.warna }} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {fungsi.nama}
              </h3>
              <p className="text-sm text-muted-foreground font-normal">
                {fungsi.deskripsi}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-border">
              <User className="h-3 w-3 mr-1" />
              {fungsi.anggota.length} anggota
            </Badge>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                expanded && "rotate-180"
              )}
            />
          </div>
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-2">
            {topLevel.map((member, index) =>
              renderMember(member, index === topLevel.length - 1, 0)
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
