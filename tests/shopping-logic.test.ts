import { describe, expect, it } from "vitest";
import { normalizeIngredient } from "@/lib/recipes";
import { canonicalIngredient } from "@/lib/shopping";

describe("shopping dedup and alias baseline", () => {
  it("normalizes duplicate ingredient names", () => {
    expect(normalizeIngredient("2 cups onions")).toBe(normalizeIngredient("onion"));
  });

  it("maps aliases to canonical names", () => {
    expect(canonicalIngredient("scallions")).toBe("green onion");
    expect(canonicalIngredient("cilantro")).toBe("coriander");
  });
});
