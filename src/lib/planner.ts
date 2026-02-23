import { prisma } from "@/lib/db/prisma";
import { getRecipeBySlug } from "@/lib/recipes";
import type { MealPlanEntryRecord, MealPlanWeekRecord, MealSlotType } from "@/lib/types/planner";
import { getCurrentWeekKey, validateDayOfWeek, validateSlot, validateWeekKey } from "@/lib/validation/planner";

const SHOULD_USE_PRISMA = Boolean(process.env.DATABASE_URL);

async function getUserIdByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new Error("User not found");
  return user.id;
}

function mapEntry(e: {
  id: string; dayOfWeek: number; slot: MealSlotType; recipeSlug: string; recipeTitleSnapshot: string;
  recipeTotalTimeSnapshot: number | null; recipeCaloriesSnapshot: number | null; note: string | null;
  isLeftoversRepeat: boolean; rationale: string | null;
}): MealPlanEntryRecord {
  return { ...e };
}

export async function createMealPlanWeekByEmail(email: string, weekKey = getCurrentWeekKey()): Promise<MealPlanWeekRecord> {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  if (!validateWeekKey(weekKey)) throw new Error("Invalid week key");
  const userId = await getUserIdByEmail(email);
  const week = await prisma.mealPlanWeek.upsert({
    where: { userId_weekKey: { userId, weekKey } },
    update: {},
    create: { userId, weekKey },
    include: { entries: true },
  });
  return { id: week.id, weekKey: week.weekKey, timezone: week.timezone, entries: week.entries.map(mapEntry) };
}

export async function getMealPlanWeekByEmail(email: string, weekKey = getCurrentWeekKey()): Promise<MealPlanWeekRecord> {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const userId = await getUserIdByEmail(email);
  const week = await prisma.mealPlanWeek.findUnique({
    where: { userId_weekKey: { userId, weekKey } },
    include: { entries: { orderBy: [{ dayOfWeek: "asc" }, { slot: "asc" }] } },
  });
  if (!week) return createMealPlanWeekByEmail(email, weekKey);
  return { id: week.id, weekKey: week.weekKey, timezone: week.timezone, entries: week.entries.map(mapEntry) };
}

export async function upsertMealPlanEntryByEmail(
  email: string,
  params: { weekKey: string; dayOfWeek: number; slot: MealSlotType; recipeSlug: string; note?: string | null; isLeftoversRepeat?: boolean; rationale?: string | null; }
) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  if (!validateWeekKey(params.weekKey) || !validateDayOfWeek(params.dayOfWeek) || !validateSlot(params.slot)) {
    throw new Error("Invalid planner payload");
  }
  const recipe = getRecipeBySlug(params.recipeSlug);
  if (!recipe) throw new Error("Recipe not found");
  const week = await createMealPlanWeekByEmail(email, params.weekKey);

  await prisma.mealPlanEntry.upsert({
    where: { mealPlanWeekId_dayOfWeek_slot: { mealPlanWeekId: week.id, dayOfWeek: params.dayOfWeek, slot: params.slot } },
    update: {
      recipeSlug: recipe.slug,
      recipeTitleSnapshot: recipe.title,
      recipeTotalTimeSnapshot: recipe.totalTime,
      recipeCaloriesSnapshot: recipe.caloriesPerServing,
      note: params.note ?? null,
      isLeftoversRepeat: Boolean(params.isLeftoversRepeat),
      rationale: params.rationale ?? null,
    },
    create: {
      mealPlanWeekId: week.id,
      dayOfWeek: params.dayOfWeek,
      slot: params.slot,
      recipeSlug: recipe.slug,
      recipeTitleSnapshot: recipe.title,
      recipeTotalTimeSnapshot: recipe.totalTime,
      recipeCaloriesSnapshot: recipe.caloriesPerServing,
      note: params.note ?? null,
      isLeftoversRepeat: Boolean(params.isLeftoversRepeat),
      rationale: params.rationale ?? null,
    },
  });

  return getMealPlanWeekByEmail(email, params.weekKey);
}

export async function deleteMealPlanEntryByEmail(email: string, params: { weekKey: string; dayOfWeek: number; slot: MealSlotType }) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const week = await getMealPlanWeekByEmail(email, params.weekKey);
  await prisma.mealPlanEntry.deleteMany({
    where: { mealPlanWeekId: week.id, dayOfWeek: params.dayOfWeek, slot: params.slot },
  });
  return getMealPlanWeekByEmail(email, params.weekKey);
}

export async function copyPreviousWeekPlanByEmail(email: string, targetWeekKey: string) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const current = await getMealPlanWeekByEmail(email, targetWeekKey);
  if (current.entries.length > 0) return current;
  const previousWeekNum = Number(targetWeekKey.slice(-2)) - 1;
  const previousKey = `${targetWeekKey.slice(0, 6)}${String(Math.max(previousWeekNum, 1)).padStart(2, "0")}`;
  const prev = await getMealPlanWeekByEmail(email, previousKey);
  for (const e of prev.entries) {
    await upsertMealPlanEntryByEmail(email, {
      weekKey: targetWeekKey, dayOfWeek: e.dayOfWeek, slot: e.slot, recipeSlug: e.recipeSlug,
      note: e.note, isLeftoversRepeat: e.isLeftoversRepeat, rationale: e.rationale,
    });
  }
  return getMealPlanWeekByEmail(email, targetWeekKey);
}
