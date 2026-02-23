import type {
  HouseholdProfile,
  HouseholdValidationResult,
} from "@/lib/types/household";

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 25);
}

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

export function validateHouseholdProfile(
  input:
    | FormData
    | Partial<HouseholdProfile>
): HouseholdValidationResult {
  const get = (key: string): FormDataEntryValue | unknown | null =>
    input instanceof FormData ? input.get(key) : (input as Record<string, unknown>)[key] ?? null;

  const asEntry = (value: unknown): FormDataEntryValue | null =>
    typeof value === "string" || value instanceof File ? value : null;

  const householdNameRaw = get("householdName");
  const householdName =
    typeof householdNameRaw === "string" ? householdNameRaw.trim().slice(0, 80) : "";

  const adultCount =
    input instanceof FormData
      ? parseOptionalInt(asEntry(get("adultCount"))) ?? 1
      : Number((get("adultCount") as number | undefined) ?? 1);

  const kidCount =
    input instanceof FormData
      ? parseOptionalInt(asEntry(get("kidCount"))) ?? 0
      : Number((get("kidCount") as number | undefined) ?? 0);

  const dietaryPreferences =
    input instanceof FormData
      ? parseList(asEntry(get("dietaryPreferences")))
      : Array.isArray(get("dietaryPreferences"))
        ? (get("dietaryPreferences") as string[]).map((v) => String(v).trim()).filter(Boolean)
        : [];

  const allergies =
    input instanceof FormData
      ? parseList(asEntry(get("allergies")))
      : Array.isArray(get("allergies"))
        ? (get("allergies") as string[]).map((v) => String(v).trim()).filter(Boolean)
        : [];

  const dislikedIngredients =
    input instanceof FormData
      ? parseList(asEntry(get("dislikedIngredients")))
      : Array.isArray(get("dislikedIngredients"))
        ? (get("dislikedIngredients") as string[]).map((v) => String(v).trim()).filter(Boolean)
        : [];

  const weeklyBudget =
    input instanceof FormData
      ? parseOptionalInt(asEntry(get("weeklyBudget")))
      : (get("weeklyBudget") as number | null | undefined) ?? null;
  const maxWeekdayCookTime =
    input instanceof FormData
      ? parseOptionalInt(asEntry(get("maxWeekdayCookTime")))
      : (get("maxWeekdayCookTime") as number | null | undefined) ?? null;
  const maxWeekendCookTime =
    input instanceof FormData
      ? parseOptionalInt(asEntry(get("maxWeekendCookTime")))
      : (get("maxWeekendCookTime") as number | null | undefined) ?? null;
  const mealsPerWeek =
    input instanceof FormData
      ? parseOptionalInt(asEntry(get("mealsPerWeek")))
      : (get("mealsPerWeek") as number | null | undefined) ?? null;

  const prefersLeftoversRaw = get("prefersLeftovers");
  const prefersLeftovers =
    input instanceof FormData
      ? prefersLeftoversRaw === "on" || prefersLeftoversRaw === "true"
      : Boolean(prefersLeftoversRaw);

  const errors: Record<string, string> = {};

  if (!Number.isInteger(adultCount) || adultCount < 1 || adultCount > 20) {
    errors.adultCount = "Adult count must be between 1 and 20";
  }
  if (!Number.isInteger(kidCount) || kidCount < 0 || kidCount > 20) {
    errors.kidCount = "Kid count must be between 0 and 20";
  }
  if (weeklyBudget !== null && (weeklyBudget < 0 || weeklyBudget > 10000)) {
    errors.weeklyBudget = "Weekly budget must be between 0 and 10000";
  }
  if (maxWeekdayCookTime !== null && (maxWeekdayCookTime < 5 || maxWeekdayCookTime > 600)) {
    errors.maxWeekdayCookTime = "Weekday cook time must be between 5 and 600 minutes";
  }
  if (maxWeekendCookTime !== null && (maxWeekendCookTime < 5 || maxWeekendCookTime > 600)) {
    errors.maxWeekendCookTime = "Weekend cook time must be between 5 and 600 minutes";
  }
  if (mealsPerWeek !== null && (mealsPerWeek < 1 || mealsPerWeek > 21)) {
    errors.mealsPerWeek = "Meals per week must be between 1 and 21";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      householdName,
      adultCount,
      kidCount,
      dietaryPreferences,
      allergies,
      dislikedIngredients,
      weeklyBudget,
      maxWeekdayCookTime,
      maxWeekendCookTime,
      mealsPerWeek,
      prefersLeftovers,
    },
  };
}
