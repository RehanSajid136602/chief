"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  addPantryItemByEmail,
  bulkAddPantryItemsByEmail,
  deletePantryItemByEmail,
  listPantryItemsByEmail,
  updatePantryItemByEmail,
} from "@/lib/pantry";
import { validatePantryItem } from "@/lib/validation/pantry";

export async function listPantryItems() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  return listPantryItemsByEmail(session.user.email);
}

export async function addPantryItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, error: "Unauthorized" as const };
  const parsed = validatePantryItem(formData);
  if (!parsed.success) return { success: false, error: "Validation failed" as const, fieldErrors: parsed.errors };

  try {
    await addPantryItemByEmail(session.user.email, parsed.data!);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pantry");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to add pantry item" };
  }
}

export async function updatePantryItem(itemId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, error: "Unauthorized" as const };
  const parsed = validatePantryItem(formData);
  if (!parsed.success) return { success: false, error: "Validation failed" as const, fieldErrors: parsed.errors };

  try {
    await updatePantryItemByEmail(session.user.email, itemId, parsed.data!);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pantry");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update pantry item" };
  }
}

export async function deletePantryItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, error: "Unauthorized" as const };
  try {
    await deletePantryItemByEmail(session.user.email, itemId);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pantry");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete pantry item" };
  }
}

export async function bulkAddPantryItemsFromText(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, error: "Unauthorized" as const };

  const rawText = String(formData.get("bulkText") ?? "");
  try {
    const result = await bulkAddPantryItemsByEmail(session.user.email, rawText);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pantry");
    return { success: true, ...result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Bulk add failed" };
  }
}
