export interface HouseholdProfile {
  householdName: string;
  adultCount: number;
  kidCount: number;
  dietaryPreferences: string[];
  allergies: string[];
  dislikedIngredients: string[];
  weeklyBudget?: number | null;
  maxWeekdayCookTime?: number | null;
  maxWeekendCookTime?: number | null;
  mealsPerWeek?: number | null;
  prefersLeftovers: boolean;
}

export interface HouseholdValidationResult {
  success: boolean;
  data?: HouseholdProfile;
  errors?: Record<string, string>;
}
