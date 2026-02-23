"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  copyPreviousWeekPlanByEmail,
  deleteMealPlanEntryByEmail,
  getMealPlanWeekByEmail,
  upsertMealPlanEntryByEmail,
  createMealPlanWeekByEmail,
} from "@/lib/planner";
import type { MealSlotType } from "@/lib/types/planner";
import { getCurrentWeekKey } from "@/lib/validation/planner";

async function requireEmail() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email;
}

export async function createMealPlanWeek(weekKey?: string) {
  const email = await requireEmail();
  return createMealPlanWeekByEmail(email, weekKey ?? getCurrentWeekKey());
}

export async function getMealPlanWeek(weekKey?: string) {
  const email = await requireEmail();
  return getMealPlanWeekByEmail(email, weekKey ?? getCurrentWeekKey());
}

export async function upsertMealPlanEntry(input: {
  weekKey: string;
  dayOfWeek: number;
  slot: MealSlotType;
  recipeSlug: string;
  note?: string | null;
  isLeftoversRepeat?: boolean;
  rationale?: string | null;
}) {
  const email = await requireEmail();
  const result = await upsertMealPlanEntryByEmail(email, input);
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard");
  return result;
}

export async function deleteMealPlanEntry(input: { weekKey: string; dayOfWeek: number; slot: MealSlotType }) {
  const email = await requireEmail();
  const result = await deleteMealPlanEntryByEmail(email, input);
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard");
  return result;
}

export async function copyPreviousWeekPlan(weekKey: string) {
  const email = await requireEmail();
  const result = await copyPreviousWeekPlanByEmail(email, weekKey);
  revalidatePath("/dashboard/planner");
  return result;
}
