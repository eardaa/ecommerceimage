"use client";

export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{ backgroundColor: "var(--color-surface-hover)" }}
        className="w-full aspect-[4/5]"
      />

      {/* Text placeholders */}
      <div className="p-4 space-y-3">
        <div
          className="h-4 rounded-full w-2/3"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-3 rounded-full w-1/2"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-10 rounded-xl w-full mt-3"
          style={{ backgroundColor: "var(--color-border)" }}
        />
      </div>
    </div>
  );
}