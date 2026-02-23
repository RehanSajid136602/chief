import type { MealSlotType } from "@/lib/types/planner";

export interface AiMealPlanSuggestion {
  dayOfWeek: number;
  slot: MealSlotType;
  recipeSlug: string;
  rationale?: string;
}

export interface AiMealPlanResponse {
  suggestions: AiMealPlanSuggestion[];
}

export function filterKnownAiSuggestions(
  suggestions: AiMealPlanSuggestion[],
  knownRecipeSlugs: Set<string>
) {
  return suggestions.filter((s) => knownRecipeSlugs.has(s.recipeSlug));
}

export function validateAiMealPlanResponse(input: unknown): input is AiMealPlanResponse {
  if (!input || typeof input !== "object") return false;
  const suggestions = (input as { suggestions?: unknown }).suggestions;
  if (!Array.isArray(suggestions)) return false;
  return suggestions.every((s) => {
    if (!s || typeof s !== "object") return false;
    const x = s as Record<string, unknown>;
    const day = x.dayOfWeek;
    return Number.isInteger(x.dayOfWeek) &&
      typeof day === "number" &&
      day >= 0 && day <= 6 &&
      (x.slot === "BREAKFAST" || x.slot === "LUNCH" || x.slot === "DINNER") &&
      typeof x.recipeSlug === "string";
  });
}
