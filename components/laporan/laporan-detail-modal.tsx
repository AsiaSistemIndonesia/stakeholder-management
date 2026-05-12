"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Insiden,
  getStakeholderById,
  getZonaById,
  urgensiColors,
  statusColors,
  kategoriColors,
} from "@/lib/data";
import {
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  FileText,
  Image,
  ExternalLink,
  History,
} from "lucide-react";

interface LaporanDetailModalProps {
  insiden: Insiden | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusIcons = {
  baru: Clock,
  proses: AlertTriangle,
  selesai: CheckCircle2,
};

export function LaporanDetailModal({
  insiden,
  open,
  onOpenChange,
}: LaporanDetailModalProps) {
  if (!insiden) return null;

  const pelapor = getStakeholderById(insiden.pelapor);
  const zona = getZonaById(insiden.zonaOperasi);
  const StatusIcon = statusIcons[insiden.status];
  const relatedStakeholders = insiden.stakeholderTerkait?.map((id) =>
    getStakeholderById(id),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Detail Insiden</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-start gap-4 pb-4">
          <div
            className="p-4 rounded-xl shrink-0"
            style={{ backgroundColor: `${urgensiColors[insiden.urgensi]}20` }}
          >
            <StatusIcon
              className="h-8 w-8"
              style={{ color: urgensiColors[insiden.urgensi] }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              {insiden.judul}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                style={{
                  backgroundColor: urgensiColors[insiden.urgensi],
                  color: "white",
                }}
              >
                Urgensi: {insiden.urgensi}
              </Badge>
              <Badge
                variant="outline"
                style={{
                  borderColor: statusColors[insiden.status],
                  color: statusColors[insiden.status],
                }}
              >
                Status: {insiden.status}
              </Badge>
              {zona && (
                <Badge variant="outline" className="border-border">
                  {zona.nama}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Description */}
        <div className="py-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Deskripsi
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insiden.deskripsi}
          </p>
        </div>

        <Separator className="bg-border" />

        {/* Info Grid */}
        <div className="py-4 grid grid-cols-2 gap-4">
          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="text-sm font-medium text-foreground">
                    {insiden.lokasi}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal</p>
                  <p className="text-sm font-medium text-foreground">
                    {insiden.tanggal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {pelapor && (
            <Card className="bg-secondary/30 border-border col-span-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      style={{
                        backgroundColor: kategoriColors[pelapor.kategori],
                        color: "white",
                      }}
                    >
                      {pelapor.nama
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">Pelapor</p>
                    <p className="text-sm font-medium text-foreground">
                      {pelapor.nama}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pelapor.jabatan}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline Insiden */}
        {insiden.timeline && insiden.timeline.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div className="py-4">
              <Accordion type="single" collapsible defaultValue="timeline">
                <AccordionItem value="timeline" className="border-none">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <History className="h-4 w-4 text-primary" />
                      Timeline Laporan ({insiden.timeline.length})
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-0">
                    <div className="relative pl-6">
                      {/* Timeline line */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

                      <div className="space-y-4">
                        {insiden.timeline
                          .slice()
                          .reverse()
                          .map((item, index) => (
                            <div key={item.id} className="relative">
                              {/* Timeline dot */}
                              <div
                                className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 ${
                                  index === 0
                                    ? "bg-primary border-primary"
                                    : "bg-card border-muted-foreground"
                                }`}
                              />

                              <div className="bg-secondary/30 rounded-lg p-3">
                                <p className="text-sm text-foreground">
                                  {item.pesan}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {item.tanggal}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {item.updaterNama}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}

        {/* Related Stakeholders */}
        {relatedStakeholders && relatedStakeholders.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div className="py-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Stakeholder Terkait
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedStakeholders.map(
                  (sh) =>
                    sh && (
                      <div
                        key={sh.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            className="text-xs"
                            style={{
                              backgroundColor: kategoriColors[sh.kategori],
                              color: "white",
                            }}
                          >
                            {sh.nama
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">
                          {sh.nama}
                        </span>
                      </div>
                    ),
                )}
              </div>
            </div>
          </>
        )}

        {/* Attachments */}
        {insiden.lampiran && insiden.lampiran.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div className="py-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                Lampiran ({insiden.lampiran.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {insiden.lampiran.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 px-3 rounded-lg bg-secondary/30 text-sm"
                  >
                    <Image className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {file.split("/").pop()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <Separator className="bg-border" />
        <div className="py-4 flex items-center justify-between">
          <Button variant="outline" className="border-border">
            <MapPin className="h-4 w-4 mr-2" />
            Lihat di Peta
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-border">
              Edit
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
