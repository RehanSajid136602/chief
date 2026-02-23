export type PantryCategory =
  | "produce"
  | "protein"
  | "dairy"
  | "grains"
  | "spices"
  | "frozen"
  | "canned"
  | "snacks"
  | "other";

export type PantryUnit =
  | "g"
  | "kg"
  | "oz"
  | "lb"
  | "ml"
  | "l"
  | "cup"
  | "tbsp"
  | "tsp"
  | "pcs"
  | "can"
  | "bottle"
  | "pack"
  | "unit";

export type PantryStatus = "in_stock" | "low_stock" | "expired";

export interface PantryItemRecord {
  id: string;
  name: string;
  normalizedName: string;
  quantity: number | null;
  unit: PantryUnit | null;
  category: PantryCategory;
  expiresAt: string | null;
  lowStockThreshold: number | null;
  note: string | null;
  status: PantryStatus;
}

export interface PantryValidationResult {
  success: boolean;
  data?: {
    name: string;
    quantity: number | null;
    unit: PantryUnit | null;
    category: PantryCategory;
    expiresAt: Date | null;
    lowStockThreshold: number | null;
    note: string | null;
  };
  errors?: Record<string, string>;
}
