"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  generateShoppingListFromMealPlanByEmail,
  getShoppingListForWeekByEmail,
  mergeShoppingListRegenerationByEmail,
  toggleShoppingListItemByEmail,
  updateShoppingListItemByEmail,
} from "@/lib/shopping";
import { getCurrentWeekKey } from "@/lib/validation/planner";

async function requireEmail() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email;
}

export async function generateShoppingListFromMealPlan(weekKey?: string) {
  const email = await requireEmail();
  const list = await generateShoppingListFromMealPlanByEmail(email, weekKey ?? getCurrentWeekKey());
  revalidatePath("/dashboard/shopping");
  revalidatePath("/dashboard");
  return list;
}

export async function getShoppingListForWeek(weekKey?: string) {
  const email = await requireEmail();
  return getShoppingListForWeekByEmail(email, weekKey ?? getCurrentWeekKey());
}

export async function toggleShoppingListItem(itemId: string) {
  const email = await requireEmail();
  await toggleShoppingListItemByEmail(email, itemId);
  revalidatePath("/dashboard/shopping");
}

export async function updateShoppingListItem(itemId: string, updates: { name?: string; quantityText?: string | null; note?: string | null; category?: string | null; }) {
  const email = await requireEmail();
  await updateShoppingListItemByEmail(email, itemId, updates);
  revalidatePath("/dashboard/shopping");
}

export async function mergeShoppingListRegeneration(weekKey?: string) {
  const email = await requireEmail();
  const list = await mergeShoppingListRegenerationByEmail(email, weekKey ?? getCurrentWeekKey());
  revalidatePath("/dashboard/shopping");
  return list;
}
