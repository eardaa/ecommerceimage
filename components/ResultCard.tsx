"use client";

import { GenerationResult, AdStyle } from "@/lib/types";

const STYLE_LABELS: Record<AdStyle, string> = {
  ugc: "UGC Review",
  dtc: "Premium DTC",
  marketplace: "Marketplace",
};

interface ResultCardProps {
  result: GenerationResult;
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function ResultCard({ result }: ResultCardProps) {
  const styleLabel = STYLE_LABELS[result.style];

  // Error state
  if (result.status === "error" || !result.dataUrl) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "2px solid var(--color-error)",
        }}
      >
        <div
          className="w-full aspect-[4/5] flex flex-col items-center justify-center gap-3 p-6"
          style={{ backgroundColor: "rgba(239, 68, 68, 0.05)" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-error)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span
            className="text-xs text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            {result.error || "Beklenmeyen bir hata oluştu"}
          </span>
        </div>

        <div className="p-4">
          <p
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-syne)",
              color: "var(--color-error)",
            }}
          >
            {styleLabel}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            Oluşturulamadı
          </p>
        </div>
      </div>
    );
  }

  // Success state
  const fileName = `${styleLabel.replace(/\s+/g, "_").toLowerCase()}.png`;

  return (
    <div
      className="rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={result.dataUrl}
          alt={`${styleLabel} reklam görseli`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {styleLabel}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-success)" }}
          >
            Hazır
          </p>
        </div>

        <a
          href={result.dataUrl}
          download={fileName}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
                     transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "#000",
          }}
        >
          <DownloadIcon />
          İndir
        </a>
      </div>
    </div>
  );
}