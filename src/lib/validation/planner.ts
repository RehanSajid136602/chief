import type { MealSlotType } from "@/lib/types/planner";

export function validateWeekKey(weekKey: string) {
  return /^\d{4}-W\d{2}$/.test(weekKey);
}

export function validateDayOfWeek(day: number) {
  return Number.isInteger(day) && day >= 0 && day <= 6;
}

export function validateSlot(slot: string): slot is MealSlotType {
  return slot === "BREAKFAST" || slot === "LUNCH" || slot === "DINNER";
}

export function getCurrentWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
