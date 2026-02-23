"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getHouseholdProfileByEmail, upsertHouseholdProfileByEmail } from "@/lib/household";
import { validateHouseholdProfile } from "@/lib/validation/household";

export async function getHouseholdProfile() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return getHouseholdProfileByEmail(session.user.email);
}

export async function createOrUpdateHouseholdProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized" as const };
  }

  const parsed = validateHouseholdProfile(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed" as const,
      fieldErrors: parsed.errors,
    };
  }

  try {
    const profile = await upsertHouseholdProfileByEmail(session.user.email, parsed.data!);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/household");
    return { success: true, profile };
  } catch (error) {
    console.error("Failed to save household profile:", error);
    return {
      success: false,
      error:
        error instanceof Error && error.message === "Database is not configured"
          ? "Database is not configured"
          : "Failed to save household profile",
    };
  }
}
