"use client";

import { useState, useRef, useCallback } from "react";

interface UploadZoneProps {
  imageBase64: string | null;
  onImageChange: (base64: string | null) => void;
}

export default function UploadZone({ imageBase64, onImageChange }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleReset = useCallback(() => {
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onImageChange]);

  // State: preview mode
  if (imageBase64) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden group cursor-pointer"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <img
          src={imageBase64}
          alt="Ürün önizleme"
          className="w-full h-64 object-cover"
        />

        {/* Overlay with "Değiştir" button */}
        <div
          className="absolute inset-0 flex items-center justify-center
                     bg-black/50 opacity-0 group-hover:opacity-100
                     transition-opacity duration-300"
        >
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl text-sm font-medium
                       transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#000",
            }}
          >
            Değiştir
          </button>
        </div>
      </div>
    );
  }

  // State: upload zone
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative rounded-2xl border-2 border-dashed p-12
        flex flex-col items-center justify-center gap-3
        cursor-pointer transition-all duration-300
        ${isDragging ? "scale-[1.02]" : "hover:scale-[1.01]"}
      `}
      style={{
        backgroundColor: isDragging
          ? "var(--color-accent-muted)"
          : "var(--color-surface)",
        borderColor: isDragging
          ? "var(--color-accent)"
          : "var(--color-border)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* Upload icon */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--color-accent)" }}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>

      <div className="text-center space-y-1">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          Ürün fotoğrafını sürükle veya seç
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          PNG, JPG, WebP • Maks 10MB
        </p>
      </div>
    </div>
  );
}