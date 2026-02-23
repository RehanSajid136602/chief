export type MealSlotType = "BREAKFAST" | "LUNCH" | "DINNER";

export interface MealPlanEntryRecord {
  id: string;
  dayOfWeek: number;
  slot: MealSlotType;
  recipeSlug: string;
  recipeTitleSnapshot: string;
  recipeTotalTimeSnapshot: number | null;
  recipeCaloriesSnapshot: number | null;
  note: string | null;
  isLeftoversRepeat: boolean;
  rationale: string | null;
}

export interface MealPlanWeekRecord {
  id: string;
  weekKey: string;
  timezone: string | null;
  entries: MealPlanEntryRecord[];
}
