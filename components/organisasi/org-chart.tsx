"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Organisasi,
  organisasiData,
  getChildOrganisasi,
  getStakeholdersByOrganisasi,
} from "@/lib/data";
import { Building2, Users, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tipeColors: Record<Organisasi["tipe"], string> = {
  pemerintah: "#EF4444",
  swasta: "#3B82F6",
  bumn: "#F59E0B",
  komunitas: "#10B981",
  internal: "#8B5CF6",
};

interface OrgNodeProps {
  org: Organisasi;
  level: number;
  isLast: boolean;
}

function OrgNode({ org, level, isLast }: OrgNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const children = getChildOrganisasi(org.id);
  const stakeholders = getStakeholdersByOrganisasi(org.id);
  const hasChildren = children.length > 0;

  return (
    <div className="relative">
      {/* Connector line from parent */}
      {level > 0 && (
        <>
          <div
            className="absolute left-[-24px] top-0 w-6 border-l-2 border-b-2 border-border rounded-bl-lg"
            style={{ height: "28px" }}
          />
          {!isLast && (
            <div
              className="absolute left-[-24px] top-0 border-l-2 border-border"
              style={{ height: "100%" }}
            />
          )}
        </>
      )}

      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer border border-transparent hover:border-border",
          hasChildren && "pr-2"
        )}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div
          className="p-2 rounded-lg shrink-0"
          style={{ backgroundColor: `${tipeColors[org.tipe]}20` }}
        >
          <Building2
            className="h-4 w-4"
            style={{ color: tipeColors[org.tipe] }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {org.nama}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0"
              style={{
                borderColor: tipeColors[org.tipe],
                color: tipeColors[org.tipe],
              }}
            >
              {org.tipe}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {stakeholders.length}
            </span>
          </div>
        </div>

        {hasChildren && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform shrink-0",
              expanded && "rotate-180"
            )}
          />
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="ml-6 mt-2 space-y-2 relative">
          {children.map((child, index) => (
            <OrgNode
              key={child.id}
              org={child}
              level={level + 1}
              isLast={index === children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrgChart() {
  // Get root organizations (no parent)
  const rootOrgs = organisasiData.filter((org) => !org.parentId);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Struktur Hierarki Organisasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rootOrgs.map((org, index) => (
            <OrgNode
              key={org.id}
              org={org}
              level={0}
              isLast={index === rootOrgs.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
