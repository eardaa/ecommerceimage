"use client";

import { AdStyle, StyleOption } from "@/lib/types";

const STYLES: StyleOption[] = [
  {
    id: "ugc",
    title: "UGC Review",
    description: "Kullanıcı yorumu tarzında doğal ve samimi reklam",
    icon: "ugc",
  },
  {
    id: "dtc",
    title: "Premium DTC",
    description: "Doğrudan tüketiciye lüks ve profesyonel reklam",
    icon: "dtc",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Pazaryeri için optimize edilmiş ürün görseli",
    icon: "marketplace",
  },
];

function UgcIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function DtcIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" y1="22" x2="12" y2="15.5" />
      <polyline points="22 8.5 12 15.5 2 8.5" />
    </svg>
  );
}

function MarketplaceIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

const iconMap = {
  ugc: UgcIcon,
  dtc: DtcIcon,
  marketplace: MarketplaceIcon,
};

interface StyleSelectorProps {
  selectedStyles: AdStyle[];
  onToggle: (style: AdStyle) => void;
}

export default function StyleSelector({ selectedStyles, onToggle }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {STYLES.map((style) => {
        const isSelected = selectedStyles.includes(style.id);
        const IconComponent = iconMap[style.icon];

        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onToggle(style.id)}
            className={`
              group relative rounded-2xl p-4 text-left
              transition-all duration-300 hover:scale-[1.02]
              flex flex-col gap-3
            `}
            style={{
              backgroundColor: isSelected
                ? "var(--color-accent-muted)"
                : "var(--color-surface)",
              border: `2px solid ${
                isSelected ? "var(--color-accent)" : "var(--color-border)"
              }`,
            }}
          >
            <div
              className="transition-colors duration-300"
              style={{
                color: isSelected
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
              }}
            >
              <IconComponent />
            </div>

            <div className="space-y-0.5">
              <p
                className="text-sm font-semibold transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: isSelected
                    ? "var(--color-accent)"
                    : "var(--color-text)",
                }}
              >
                {style.title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {style.description}
              </p>
            </div>

            {/* Check indicator */}
            {isSelected && (
              <div
                className="absolute top-3 right-3 w-5 h-5 rounded-full
                           flex items-center justify-center"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}