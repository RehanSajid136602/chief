import { prisma } from "@/lib/db/prisma";
import type { HouseholdProfile } from "@/lib/types/household";
import type { Prisma } from "@prisma/client";

const SHOULD_USE_PRISMA = Boolean(process.env.DATABASE_URL);

function toStringList(value: Prisma.JsonValue | null | undefined): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)).filter(Boolean) : [];
}

export async function getHouseholdProfileByEmail(
  email: string
): Promise<HouseholdProfile | null> {
  if (!SHOULD_USE_PRISMA) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { household: true },
    });

    if (!user?.household) return null;

    const h = user.household;
    return {
      householdName: h.householdName ?? "",
      adultCount: h.adultCount,
      kidCount: h.kidCount,
      dietaryPreferences: toStringList(h.dietaryPreferences),
      allergies: toStringList(h.allergies),
      dislikedIngredients: toStringList(h.dislikedIngredients),
      weeklyBudget: h.weeklyBudget,
      maxWeekdayCookTime: h.maxWeekdayCookTime,
      maxWeekendCookTime: h.maxWeekendCookTime,
      mealsPerWeek: h.mealsPerWeek,
      prefersLeftovers: h.prefersLeftovers,
    };
  } catch (error) {
    console.error("Error loading household profile:", error);
    return null;
  }
}

export async function upsertHouseholdProfileByEmail(
  email: string,
  profile: HouseholdProfile
): Promise<HouseholdProfile> {
  if (!SHOULD_USE_PRISMA) {
    throw new Error("Database is not configured");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const saved = await prisma.household.upsert({
    where: { userId: user.id },
    update: {
      householdName: profile.householdName || null,
      adultCount: profile.adultCount,
      kidCount: profile.kidCount,
      dietaryPreferences: profile.dietaryPreferences,
      allergies: profile.allergies,
      dislikedIngredients: profile.dislikedIngredients,
      weeklyBudget: profile.weeklyBudget ?? null,
      maxWeekdayCookTime: profile.maxWeekdayCookTime ?? null,
      maxWeekendCookTime: profile.maxWeekendCookTime ?? null,
      mealsPerWeek: profile.mealsPerWeek ?? null,
      prefersLeftovers: profile.prefersLeftovers,
    },
    create: {
      userId: user.id,
      householdName: profile.householdName || null,
      adultCount: profile.adultCount,
      kidCount: profile.kidCount,
      dietaryPreferences: profile.dietaryPreferences,
      allergies: profile.allergies,
      dislikedIngredients: profile.dislikedIngredients,
      weeklyBudget: profile.weeklyBudget ?? null,
      maxWeekdayCookTime: profile.maxWeekdayCookTime ?? null,
      maxWeekendCookTime: profile.maxWeekendCookTime ?? null,
      mealsPerWeek: profile.mealsPerWeek ?? null,
      prefersLeftovers: profile.prefersLeftovers,
    },
  });

  return {
    householdName: saved.householdName ?? "",
    adultCount: saved.adultCount,
    kidCount: saved.kidCount,
    dietaryPreferences: toStringList(saved.dietaryPreferences),
    allergies: toStringList(saved.allergies),
    dislikedIngredients: toStringList(saved.dislikedIngredients),
    weeklyBudget: saved.weeklyBudget,
    maxWeekdayCookTime: saved.maxWeekdayCookTime,
    maxWeekendCookTime: saved.maxWeekendCookTime,
    mealsPerWeek: saved.mealsPerWeek,
    prefersLeftovers: saved.prefersLeftovers,
  };
}
