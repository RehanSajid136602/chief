import { describe, expect, it } from "vitest";
import { validateHouseholdProfile } from "@/lib/validation/household";

describe("household validation", () => {
  it("accepts a valid payload", () => {
    const fd = new FormData();
    fd.set("adultCount", "2");
    fd.set("kidCount", "1");
    fd.set("dietaryPreferences", "halal, vegetarian");
    fd.set("prefersLeftovers", "on");
    const result = validateHouseholdProfile(fd);
    expect(result.success).toBe(true);
    if (!result.success || !result.data) throw new Error("Expected valid household profile");
    expect(result.data.adultCount).toBe(2);
    expect(result.data.dietaryPreferences).toEqual(["halal", "vegetarian"]);
    expect(result.data.prefersLeftovers).toBe(true);
  });

  it("rejects invalid adult count", () => {
    const fd = new FormData();
    fd.set("adultCount", "0");
    const result = validateHouseholdProfile(fd);
    expect(result.success).toBe(false);
  });
});
