import recipesData from "@/data/recipes.json";
import type { Recipe, MatchResult } from "./types";

const recipes: Recipe[] = recipesData.recipes as Recipe[];

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function normalizeIngredient(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/^(\d+[\s\/]*\d*)\s*(cups?|tbsp|tsp|oz|lbs?|g|kg|ml|l|cloves?|pieces?|cans?|packages?|bunch(?:es)?|heads?|stalks?|slices?)?\s*/i, "")
    .replace(/[^\w\s]/g, "")
    .replace(/(s|es)$/i, "")
    .trim();
}

export function matchRecipes(userIngredients: string[]): MatchResult[] {
  const normalizedUserIngredients = userIngredients
    .map(normalizeIngredient)
    .filter((ing) => ing.length > 0);

  if (normalizedUserIngredients.length === 0) {
    return [];
  }

  const results: MatchResult[] = [];

  for (const recipe of recipes) {
    const normalizedRecipeIngredients = recipe.ingredients.map(normalizeIngredient);

    const matchedIngredients = normalizedRecipeIngredients.filter((recipeIng) =>
      normalizedUserIngredients.some(
        (userIng) =>
          userIng.includes(recipeIng) || recipeIng.includes(userIng)
      )
    );

    const matchCount = matchedIngredients.length;
    const matchPercent = Math.round(
      (matchCount / normalizedRecipeIngredients.length) * 100
    );

    if (matchPercent > 0) {
      const missingIngredients = normalizedRecipeIngredients.filter(
        (recipeIng) =>
          !normalizedUserIngredients.some(
            (userIng) => userIng.includes(recipeIng) || recipeIng.includes(userIng)
          )
      );

      results.push({
        recipe,
        matchCount,
        matchPercent,
        missingIngredients: missingIngredients.slice(0, 5),
      });
    }
  }

  return results
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 10);
}
