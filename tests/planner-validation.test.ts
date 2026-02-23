import { describe, expect, it } from "vitest";
import { getCurrentWeekKey, validateDayOfWeek, validateSlot, validateWeekKey } from "@/lib/validation/planner";

describe("planner validation", () => {
  it("returns valid week key", () => {
    expect(validateWeekKey(getCurrentWeekKey(new Date("2026-02-22")))).toBe(true);
  });
  it("validates day and slot", () => {
    expect(validateDayOfWeek(0)).toBe(true);
    expect(validateDayOfWeek(7)).toBe(false);
    expect(validateSlot("DINNER")).toBe(true);
    expect(validateSlot("SNACK")).toBe(false);
  });
});
