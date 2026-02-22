"use server";

import { auth } from "@/auth";
import { findUserByEmail, updateUser } from "@/lib/users";
import { revalidatePath } from "next/cache";

export async function updateName(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  if (!name || name.length < 2) {
    throw new Error("Invalid name");
  }

  await updateUser(session.user.email, { name });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleFavorite(recipeSlug: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await findUserByEmail(session.user.email);
  if (!user) {
    throw new Error("User not found");
  }

  const favorites = user.favorites || [];
  const isFavorite = favorites.includes(recipeSlug);

  const newFavorites = isFavorite
    ? favorites.filter((slug) => slug !== recipeSlug)
    : [...favorites, recipeSlug];

  await updateUser(session.user.email, { favorites: newFavorites });
  revalidatePath("/dashboard");
  revalidatePath(`/recipes/${recipeSlug}`);
  revalidatePath("/");
  
  return { isFavorite: !isFavorite };
}
