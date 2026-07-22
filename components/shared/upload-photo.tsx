"use client";

import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Trash2, Upload } from "lucide-react";

interface UploadPhotoProps {
  value?: string;
  onChange: (url: string) => void;
  readOnly?: boolean;
  nameFallback?: string;
}

export function UploadPhoto({
  value,
  onChange,
  readOnly = false,
  nameFallback = "ST",
}: UploadPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const initials = nameFallback
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 py-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={readOnly}
      />

      <div className="relative group">
        <Avatar className="h-20 w-20 border-2 border-border shadow-md">
          {value ? (
            <AvatarImage src={value} alt="Foto Profile" className="object-cover" />
          ) : null}
          <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {!readOnly && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Ganti Foto"
          >
            <Camera className="h-6 w-6" />
          </button>
        )}
      </div>

      {!readOnly && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              {value ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Ganti Foto
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Unggah Foto
                </>
              )}
            </Button>

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 text-xs"
                onClick={handleRemove}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Hapus
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Format: JPG, PNG, WEBP. Maksimal 5MB.
          </p>
        </div>
      )}
    </div>
  );
}
