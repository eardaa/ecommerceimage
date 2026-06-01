export type AdStyle = "ugc" | "dtc" | "marketplace";

export interface StyleOption {
  id: AdStyle;
  title: string;
  description: string;
  icon: "ugc" | "dtc" | "marketplace";
}

export interface GenerationResult {
  style: AdStyle;
  status: "success" | "error";
  dataUrl?: string;
  error?: string;
}