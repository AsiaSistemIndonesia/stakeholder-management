"use client";

import React, { useRef } from "react";
import { StakeholderDocument } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Upload,
  Eye,
  Download,
  Trash2,
  File,
} from "lucide-react";

interface UploadDocumentsProps {
  documents: StakeholderDocument[];
  onChange: (docs: StakeholderDocument[]) => void;
  readOnly?: boolean;
}

export function UploadDocuments({
  documents = [],
  onChange,
  readOnly = false,
}: UploadDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (tipe: string) => {
    const t = tipe.toLowerCase();
    if (t.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-400 shrink-0" />;
    }
    if (t.includes("xls") || t.includes("csv") || t.includes("sheet")) {
      return <FileSpreadsheet className="h-5 w-5 text-emerald-400 shrink-0" />;
    }
    if (t.includes("doc") || t.includes("word")) {
      return <FileCode className="h-5 w-5 text-blue-400 shrink-0" />;
    }
    return <File className="h-5 w-5 text-muted-foreground shrink-0" />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: StakeholderDocument[] = Array.from(files).map((file, index) => {
      const ext = file.name.split(".").pop() || "doc";
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: `doc-${Date.now()}-${index}`,
        nama: file.name,
        tipe: ext.toLowerCase(),
        ukuran: `${sizeMb === "0.0" ? "0.4" : sizeMb} MB`,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString().split("T")[0],
      };
    });

    onChange([...documents, ...newDocs]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
  };

  const handleView = (doc: StakeholderDocument) => {
    if (doc.url && doc.url !== "#") {
      window.open(doc.url, "_blank");
    } else {
      alert(`Pratinjau dokumen: ${doc.nama}`);
    }
  };

  const handleDownload = (doc: StakeholderDocument) => {
    if (doc.url && doc.url !== "#") {
      const a = document.createElement("a");
      a.href = doc.url;
      a.download = doc.nama;
      a.click();
    } else {
      alert(`Mengunduh file: ${doc.nama}`);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg"
        className="hidden"
        disabled={readOnly}
      />

      {!readOnly && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-4 text-center cursor-pointer transition-colors bg-secondary/20 hover:bg-secondary/40"
        >
          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-sm font-medium text-foreground">
            Klik untuk mengunggah dokumen
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dukungan format: PDF, DOCX, XLSX (Maks. 10MB)
          </p>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/30 text-sm gap-2"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getFileIcon(doc.tipe)}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{doc.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.ukuran} {doc.createdAt ? `• ${doc.createdAt}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleView(doc)}
                  title="Lihat Pratinjau"
                >
                  <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(doc)}
                  title="Unduh Dokumen"
                >
                  <Download className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>

                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(doc.id)}
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : readOnly ? (
        <p className="text-xs text-muted-foreground italic">
          Tidak ada dokumen terlampir.
        </p>
      ) : null}
    </div>
  );
}
