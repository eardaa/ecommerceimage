"use client";

import { useState, useCallback } from "react";
import { AdStyle, GenerationResult } from "@/lib/types";
import { generateImages } from "@/lib/api";
import UploadZone from "@/components/UploadZone";
import StyleSelector from "@/components/StyleSelector";
import SkeletonCard from "@/components/SkeletonCard";
import ResultCard from "@/components/ResultCard";

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<AdStyle[]>([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [results, setResults] = useState<GenerationResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStyle = useCallback((style: AdStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  }, []);

  const canSubmit = imageBase64 && selectedStyles.length > 0;

  const handleGenerate = useCallback(async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    setResults(null);

    const generated = await generateImages(
      selectedStyles,
      imageBase64,
      userPrompt.trim()
    );

    setResults(generated);
    setIsLoading(false);
  }, [canSubmit, selectedStyles, imageBase64, userPrompt]);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-[720px] mx-auto px-5 py-10 sm:py-16 space-y-10">
        {/* Header */}
        <header className="text-center space-y-3">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--color-accent-muted)",
              color: "var(--color-accent)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Yapay Zeka Destekli
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Reklam Görseli Üretici
          </h1>

          <p
            className="text-sm max-w-md mx-auto"
            style={{ color: "var(--color-text-muted)" }}
          >
            Ürün fotoğrafını yükle, reklam stilini seç, yapay zeka ile
            profesyonel reklam görsellerini saniyeler içinde oluştur.
          </p>
        </header>

        {/* Section: Upload */}
        <section className="space-y-3">
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-syne)",
              color: "var(--color-text-muted)",
            }}
          >
            1. Ürün Fotoğrafı
          </h2>
          <UploadZone
            imageBase64={imageBase64}
            onImageChange={setImageBase64}
          />
        </section>

        {/* Section: Style */}
        <section className="space-y-3">
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-syne)",
              color: "var(--color-text-muted)",
            }}
          >
            2. Reklam Stili
          </h2>
          <StyleSelector
            selectedStyles={selectedStyles}
            onToggle={handleToggleStyle}
          />
          {selectedStyles.length > 0 && (
            <p
              className="text-xs"
              style={{ color: "var(--color-accent)" }}
            >
              {selectedStyles.length} stil seçildi
            </p>
          )}
        </section>

        {/* Section: Prompt */}
        <section className="space-y-4">
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-syne)",
              color: "var(--color-text-muted)",
            }}
          >
            3. Açıklama (isteğe bağlı)
          </h2>

          {/* Prompt */}
          <div className="space-y-1.5">
            <label
              htmlFor="prompt"
              className="text-xs font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              Açıklama (isteğe bağlı)
            </label>
            <textarea
              id="prompt"
              rows={3}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Örn: Siyah spor ayakkabı, genç hedef kitle için enerjik bir reklam..."
              className="w-full rounded-xl px-4 py-3 text-sm resize-none
                         transition-all duration-200 focus:outline-none
                         placeholder:text-[var(--color-text-muted)]"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
          </div>
        </section>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canSubmit || isLoading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl
                       text-sm font-bold transition-all duration-300
                       disabled:opacity-40 disabled:cursor-not-allowed
                       enabled:hover:scale-105 enabled:active:scale-95"
            style={{
              backgroundColor: canSubmit
                ? "var(--color-accent)"
                : "var(--color-surface)",
              color: canSubmit ? "#000" : "var(--color-text-muted)",
              fontFamily: "var(--font-syne)",
            }}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity="0.25"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Oluşturuluyor...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Görselleri Oluştur
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {(isLoading || results) && (
          <section className="space-y-4">
            <h2
              className="text-sm font-semibold uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-syne)",
                color: "var(--color-text-muted)",
              }}
            >
              {isLoading ? "Oluşturuluyor..." : "Sonuçlar"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {isLoading
                ? Array.from({ length: selectedStyles.length || 3 }).map(
                    (_, i) => <SkeletonCard key={i} />
                  )
                : results?.map((result) => (
                    <ResultCard key={result.style} result={result} />
                  ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer
          className="text-center text-xs pt-8"
          style={{ color: "var(--color-text-muted)" }}
        >
          AdCreator &copy; {new Date().getFullYear()} &middot; Tüm hakları
          saklıdır
        </footer>
      </div>
    </main>
  );
}