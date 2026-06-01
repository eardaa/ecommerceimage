import { AdStyle, GenerationResult } from "./types";

const WEBHOOK_URLS: Record<AdStyle, string> = {
  ugc: "https://ykrendvia.app.n8n.cloud/webhook-test/86ff4f49-54a5-40e6-9833-2a8065315fd7",
  dtc: "https://ykrendvia.app.n8n.cloud/webhook-test/22b4d944-c652-4bc2-a73d-cf02e3e9c7ed",
  marketplace: "https://ykrendvia.app.n8n.cloud/webhook-test/0d7a2a55-c58b-47ac-94ef-49efdd069eed",
};

function base64ToBlob(base64: string): Blob {
  const [prefix, data] = base64.split(",");
  const mimeMatch = prefix.match(/:(.*?);/);
  const mime = mimeMatch?.[1] || "image/png";
  const byteString = atob(data);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mime });
}

async function fetchForStyle(
  style: AdStyle,
  base64Image: string,
  prompt: string
): Promise<GenerationResult> {
  try {
    const url = WEBHOOK_URLS[style];

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", base64ToBlob(base64Image), `${style}.png`);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Bilinmeyen hata");
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const json = await response.json();
      if (json.image && typeof json.image === "string") {
        return {
          style,
          status: "success",
          dataUrl: json.image.startsWith("data:")
            ? json.image
            : `data:image/png;base64,${json.image}`,
        };
      }
      throw new Error("JSON yanıtında image alanı bulunamadı");
    }

    // Handle binary image blob
    const blob = await response.blob();
    if (blob.type.startsWith("image/")) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Blob okunamadı"));
        reader.readAsDataURL(blob);
      });
      return { style, status: "success", dataUrl };
    }

    throw new Error("Beklenmeyen yanıt formatı");
  } catch (err) {
    return {
      style,
      status: "error",
      error: err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu",
    };
  }
}

export async function generateImages(
  styles: AdStyle[],
  base64Image: string,
  prompt: string
): Promise<GenerationResult[]> {
  const promises = styles.map((style) =>
    fetchForStyle(style, base64Image, prompt)
  );

  const settled = await Promise.allSettled(promises);

  return settled.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      style: styles[index],
      status: "error",
      error: result.reason?.message || "Beklenmeyen bir hata oluştu",
    } as GenerationResult;
  });
}