"use client";

import { Organisasi } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Check, X, Building2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface MultiSelectOrganizationsProps {
  organisasiList: Organisasi[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  readOnly?: boolean;
}

export function MultiSelectOrganizations({
  organisasiList,
  selectedIds = [],
  onChange,
  readOnly = false,
}: MultiSelectOrganizationsProps) {
  const toggleSelect = (id: string) => {
    if (readOnly) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeId = (id: string) => {
    if (readOnly) return;
    onChange(selectedIds.filter((item) => item !== id));
  };

  const selectedOrgs = organisasiList.filter((org) => selectedIds.includes(org.id));

  if (readOnly) {
    return (
      <div className="flex flex-wrap gap-1.5 py-1">
        {selectedOrgs.length > 0 ? (
          selectedOrgs.map((org) => (
            <Badge
              key={org.id}
              variant="secondary"
              className="bg-secondary text-secondary-foreground border-border text-xs px-2.5 py-0.5"
            >
              <Building2 className="h-3 w-3 mr-1 text-primary" />
              {org.nama}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Tidak ada organisasi terpilih
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Selected Chips */}
      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-lg border border-border bg-secondary/30 items-center">
        {selectedOrgs.map((org) => (
          <Badge
            key={org.id}
            variant="secondary"
            className="bg-primary/15 text-primary border-primary/30 text-xs px-2 py-0.5 flex items-center gap-1"
          >
            {org.nama}
            <button
              type="button"
              onClick={() => removeId(org.id)}
              className="hover:text-destructive focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border"
            >
              + Tambah Organisasi
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-2 bg-popover border-border max-h-60 overflow-y-auto">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                Pilih Organisasi (Bisa Lebih Dari Satu)
              </p>
              {organisasiList.map((org) => {
                const isSelected = selectedIds.includes(org.id);
                return (
                  <div
                    key={org.id}
                    onClick={() => toggleSelect(org.id)}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-secondary cursor-pointer text-xs"
                  >
                    <span className="text-foreground">{org.nama}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
