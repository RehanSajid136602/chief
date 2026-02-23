import type { PantryCategory, PantryUnit, PantryValidationResult } from "@/lib/types/pantry";

const PANTRY_CATEGORIES: PantryCategory[] = [
  "produce",
  "protein",
  "dairy",
  "grains",
  "spices",
  "frozen",
  "canned",
  "snacks",
  "other",
];

const PANTRY_UNITS: PantryUnit[] = [
  "g",
  "kg",
  "oz",
  "lb",
  "ml",
  "l",
  "cup",
  "tbsp",
  "tsp",
  "pcs",
  "can",
  "bottle",
  "pack",
  "unit",
];

function parseNumber(value: FormDataEntryValue | null): number | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function validatePantryItem(formData: FormData): PantryValidationResult {
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const quantity = parseNumber(formData.get("quantity"));
  const lowStockThreshold = parseNumber(formData.get("lowStockThreshold"));
  const unitRaw = String(formData.get("unit") ?? "").trim() as PantryUnit | "";
  const categoryRaw = String(formData.get("category") ?? "other").trim() as PantryCategory;
  const noteRaw = String(formData.get("note") ?? "").trim();
  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Item name is required";
  if (quantity !== null && quantity < 0) errors.quantity = "Quantity cannot be negative";
  if (lowStockThreshold !== null && lowStockThreshold < 0) {
    errors.lowStockThreshold = "Low-stock threshold cannot be negative";
  }
  if (unitRaw && !PANTRY_UNITS.includes(unitRaw)) errors.unit = "Invalid unit";
  if (!PANTRY_CATEGORIES.includes(categoryRaw)) errors.category = "Invalid category";

  let expiresAt: Date | null = null;
  if (expiresRaw) {
    const parsed = new Date(expiresRaw);
    if (Number.isNaN(parsed.getTime())) {
      errors.expiresAt = "Invalid expiry date";
    } else {
      expiresAt = parsed;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      quantity,
      unit: unitRaw || null,
      category: categoryRaw,
      expiresAt,
      lowStockThreshold,
      note: noteRaw || null,
    },
  };
}

export function parsePantryLines(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 100);
}
