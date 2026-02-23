import { describe, expect, it } from "vitest";
import { parsePantryLines, validatePantryItem } from "@/lib/validation/pantry";

describe("pantry validation", () => {
  it("parses bulk pantry lines", () => {
    expect(parsePantryLines("onion\n\n garlic \n")).toEqual(["onion", "garlic"]);
  });

  it("validates pantry item payload", () => {
    const fd = new FormData();
    fd.set("name", "Rice");
    fd.set("quantity", "2");
    fd.set("category", "grains");
    const result = validatePantryItem(fd);
    expect(result.success).toBe(true);
  });
});
