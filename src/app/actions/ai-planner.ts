"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { groqChatJson } from "@/lib/ai/groq";
import { filterKnownAiSuggestions, validateAiMealPlanResponse } from "@/lib/ai/schemas";
import { getAllRecipes } from "@/lib/recipes";
import { getHouseholdProfileByEmail } from "@/lib/household";
import { listPantryItemsByEmail } from "@/lib/pantry";
import { prisma } from "@/lib/db/prisma";
import { getMealPlanWeekByEmail, upsertMealPlanEntryByEmail } from "@/lib/planner";
import type { MealSlotType } from "@/lib/types/planner";

async function requireEmail() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email;
}

async function logAiRun(email: string, data: { type: "WEEK_PLAN" | "SLOT_REGEN"; status: string; model: string; latencyMs?: number; errorCode?: string; errorMessage?: string; requestScope?: string; }) {
  if (!process.env.DATABASE_URL) return;
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return;
  await prisma.aiGenerationRun.create({ data: { userId: user.id, ...data } });
}

export async function generateMealPlanWithAI(input: { weekKey: string }) {
  const email = await requireEmail();
  const started = Date.now();
  const model = "llama-3.3-70b-versatile";
  try {
    const [household, pantry] = await Promise.all([
      getHouseholdProfileByEmail(email),
      listPantryItemsByEmail(email),
    ]);
    const recipes = getAllRecipes().map((r) => ({
      slug: r.slug, title: r.title, tags: r.tags, totalTime: r.totalTime, caloriesPerServing: r.caloriesPerServing,
    }));
    const prompt = JSON.stringify({
      weekKey: input.weekKey,
      household,
      pantry: pantry.slice(0, 80).map((p) => p.normalizedName),
      recipes,
      output: { suggestions: [{ dayOfWeek: 0, slot: "DINNER", recipeSlug: "slug", rationale: "reason" }] },
      rules: ["Use only provided recipe slugs", "Cover multiple days and slots", "Return JSON object only"],
    });
    const response = await groqChatJson<unknown>({
      system: "You are a meal planner. Return valid JSON only.",
      user: prompt,
      model,
    });
    if (!validateAiMealPlanResponse(response)) {
      await logAiRun(email, { type: "WEEK_PLAN", status: "invalid_json", model, latencyMs: Date.now() - started });
      return { success: false as const, error: "AI returned invalid structured output" };
    }
    const recipeSlugs = new Set(getAllRecipes().map((r) => r.slug));
    for (const s of filterKnownAiSuggestions(response.suggestions, recipeSlugs)) {
      await upsertMealPlanEntryByEmail(email, {
        weekKey: input.weekKey,
        dayOfWeek: s.dayOfWeek,
        slot: s.slot,
        recipeSlug: s.recipeSlug,
        rationale: s.rationale ?? null,
      });
    }
    const nextWeek = await getMealPlanWeekByEmail(email, input.weekKey);
    await logAiRun(email, { type: "WEEK_PLAN", status: "success", model, latencyMs: Date.now() - started });
    revalidatePath("/dashboard/planner");
    return { success: true as const, week: nextWeek };
  } catch (error) {
    await logAiRun(email, {
      type: "WEEK_PLAN",
      status: "error",
      model,
      latencyMs: Date.now() - started,
      errorCode: "runtime",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false as const, error: error instanceof Error ? error.message : "AI generation failed" };
  }
}

export async function regenerateMealSlotWithAI(input: { weekKey: string; dayOfWeek: number; slot: MealSlotType }) {
  const email = await requireEmail();
  const recipes = getAllRecipes();
  const idx = Math.abs((input.dayOfWeek + input.slot.length + Date.now()) % recipes.length);
  const recipe = recipes[idx];
  try {
    await upsertMealPlanEntryByEmail(email, {
      weekKey: input.weekKey,
      dayOfWeek: input.dayOfWeek,
      slot: input.slot,
      recipeSlug: recipe.slug,
      rationale: "Single-slot AI regeneration fallback selection",
    });
    const week = await getMealPlanWeekByEmail(email, input.weekKey);
    revalidatePath("/dashboard/planner");
    return { success: true as const, week };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Slot regeneration failed" };
  }
}
