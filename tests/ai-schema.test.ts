import { describe, expect, it } from "vitest";
import { validateAiMealPlanResponse } from "@/lib/ai/schemas";

describe("ai meal plan schema validation", () => {
  it("accepts valid structured payload", () => {
    expect(
      validateAiMealPlanResponse({
        suggestions: [{ dayOfWeek: 1, slot: "DINNER", recipeSlug: "beef-tacos", rationale: "quick" }],
      })
    ).toBe(true);
  });

  it("rejects invalid payload", () => {
    expect(validateAiMealPlanResponse({ suggestions: [{ dayOfWeek: 9, slot: "SNACK", recipeSlug: 1 }] })).toBe(false);
  });
});
