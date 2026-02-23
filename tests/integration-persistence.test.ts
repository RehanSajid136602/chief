import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { upsertHouseholdProfileByEmail, getHouseholdProfileByEmail } from "@/lib/household";
import { addPantryItemByEmail, getPantrySummaryByEmail } from "@/lib/pantry";
import { createMealPlanWeekByEmail, upsertMealPlanEntryByEmail, getMealPlanWeekByEmail } from "@/lib/planner";
import { generateShoppingListFromMealPlanByEmail } from "@/lib/shopping";
import { getCurrentWeekKey } from "@/lib/validation/planner";
import { createUser, findUserByEmail, updateUser } from "@/lib/users";

async function resetDb() {
  await prisma.shoppingListItem.deleteMany();
  await prisma.shoppingList.deleteMany();
  await prisma.mealPlanEntry.deleteMany();
  await prisma.mealPlanWeek.deleteMany();
  await prisma.pantryItem.deleteMany();
  await prisma.household.deleteMany();
  await prisma.favoriteRecipe.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUser(email = "test@example.com") {
  await prisma.user.create({ data: { email, name: "Test User", password: "hash" } });
  return email;
}

describe("sqlite integration persistence", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("persists household profile", async () => {
    const email = await seedUser();
    await upsertHouseholdProfileByEmail(email, {
      householdName: "Family",
      adultCount: 2,
      kidCount: 1,
      dietaryPreferences: ["halal"],
      allergies: ["peanut"],
      dislikedIngredients: ["mushroom"],
      weeklyBudget: 150,
      maxWeekdayCookTime: 30,
      maxWeekendCookTime: 60,
      mealsPerWeek: 14,
      prefersLeftovers: true,
    });
    const profile = await getHouseholdProfileByEmail(email);
    expect(profile?.adultCount).toBe(2);
    expect(profile?.dietaryPreferences).toContain("halal");
  });

  it("supports user profile and favorites persistence via users helpers", async () => {
    const email = "authflow@example.com";
    await createUser(email, "Auth User", "password123");
    let user = await findUserByEmail(email);
    expect(user).not.toBeNull();
    await updateUser(email, { name: "Updated Name", favorites: ["beef-tacos"] });
    user = await findUserByEmail(email);
    expect(user?.name).toBe("Updated Name");
    expect(user?.favorites).toContain("beef-tacos");
  });

  it("persists pantry items and computes status summary", async () => {
    const email = await seedUser();
    await addPantryItemByEmail(email, {
      name: "Onion",
      quantity: 1,
      unit: "pcs",
      category: "produce",
      expiresAt: new Date(Date.now() - 86400000),
      lowStockThreshold: 2,
      note: null,
    });
    const summary = await getPantrySummaryByEmail(email);
    expect(summary.total).toBe(1);
    expect(summary.expiredCount).toBe(1);
  });

  it("supports manual planner and shopping generation without AI", async () => {
    const email = await seedUser();
    const weekKey = getCurrentWeekKey(new Date("2026-02-22"));
    await createMealPlanWeekByEmail(email, weekKey);
    await upsertMealPlanEntryByEmail(email, {
      weekKey,
      dayOfWeek: 0,
      slot: "DINNER",
      recipeSlug: "beef-tacos",
      note: "manual",
    });
    const week = await getMealPlanWeekByEmail(email, weekKey);
    expect(week.entries.length).toBe(1);
    const list = await generateShoppingListFromMealPlanByEmail(email, weekKey, "exclude-covered");
    expect(list.items.length).toBeGreaterThan(0);
  });

  it("preserves manual shopping items on regeneration", async () => {
    const email = await seedUser("shop@example.com");
    const weekKey = getCurrentWeekKey(new Date("2026-02-22"));
    await createMealPlanWeekByEmail(email, weekKey);
    await upsertMealPlanEntryByEmail(email, {
      weekKey,
      dayOfWeek: 0,
      slot: "DINNER",
      recipeSlug: "beef-tacos",
    });
    const first = await generateShoppingListFromMealPlanByEmail(email, weekKey, "exclude-covered");
    await prisma.shoppingListItem.create({
      data: {
        shoppingListId: first.id,
        name: "Paper towels",
        category: "other",
        isManual: true,
      },
    });
    const regenerated = await generateShoppingListFromMealPlanByEmail(email, weekKey, "exclude-covered");
    expect(regenerated.items.some((i) => i.name === "Paper towels" && i.isManual)).toBe(true);
  });
});
