import { prisma } from "@/lib/db/prisma";
import { getRecipeBySlug, normalizeIngredient } from "@/lib/recipes";
import { listPantryItemsByEmail } from "@/lib/pantry";
import { getMealPlanWeekByEmail } from "@/lib/planner";
import type { ShoppingListRecord } from "@/lib/types/shopping";

const SHOULD_USE_PRISMA = Boolean(process.env.DATABASE_URL);
const INGREDIENT_ALIASES: Record<string, string> = {
  scallion: "green onion",
  scallions: "green onion",
  "spring onion": "green onion",
  cilantro: "coriander",
  chickpea: "garbanzo bean",
  chickpeas: "garbanzo bean",
};

export function canonicalIngredient(name: string) {
  const normalized = normalizeIngredient(name);
  return INGREDIENT_ALIASES[normalized] ?? normalized;
}

async function getUserIdByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new Error("User not found");
  return user.id;
}

function inferCategory(name: string) {
  const n = canonicalIngredient(name);
  if (/rice|pasta|bread|flour/.test(n)) return "grains";
  if (/milk|cheese|yogurt|butter/.test(n)) return "dairy";
  if (/chicken|beef|egg|fish/.test(n)) return "protein";
  if (/salt|pepper|paprika|cumin/.test(n)) return "spices";
  return "produce";
}

function mapList(
  list: {
    id: string;
    title: string;
    mealPlanWeekId: string | null;
    strictness: string | null;
    items: Array<{
      id: string;
      name: string;
      normalizedName: string | null;
      quantityText: string | null;
      category: string | null;
      note: string | null;
      checked: boolean;
      isManual: boolean;
      sourceRecipeSlugs: unknown;
    }>;
  } | null
): ShoppingListRecord {
  if (!list) throw new Error("Shopping list not found");
  return {
    id: list.id,
    title: list.title,
    mealPlanWeekId: list.mealPlanWeekId,
    strictness: list.strictness,
    items: list.items.map((i) => ({
      id: i.id,
      name: i.name,
      normalizedName: i.normalizedName,
      quantityText: i.quantityText,
      category: i.category,
      note: i.note,
      checked: i.checked,
      isManual: i.isManual,
      sourceRecipeSlugs: Array.isArray(i.sourceRecipeSlugs) ? i.sourceRecipeSlugs.map(String) : [],
    })),
  };
}

export async function generateShoppingListFromMealPlanByEmail(email: string, weekKey: string, strictness = "exclude-covered") {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const [userId, week, pantry] = await Promise.all([
    getUserIdByEmail(email),
    getMealPlanWeekByEmail(email, weekKey),
    listPantryItemsByEmail(email),
  ]);
  const pantrySet = new Set(pantry.map((p) => canonicalIngredient(p.normalizedName || p.name)).filter(Boolean));
  const ingredientMap = new Map<string, { name: string; category: string; sourceRecipeSlugs: Set<string> }>();

  for (const entry of week.entries) {
    const recipe = getRecipeBySlug(entry.recipeSlug);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const normalized = canonicalIngredient(ing);
      if (!normalized) continue;
      const pantryCovered = pantrySet.has(normalized);
      if (strictness === "exclude-covered" && pantryCovered) continue;
      if (strictness === "mark-covered" && pantryCovered) {
        const existingCovered = ingredientMap.get(normalized);
        if (!existingCovered) {
          ingredientMap.set(normalized, {
            name: `${ing} (pantry)`,
            category: inferCategory(ing),
            sourceRecipeSlugs: new Set([recipe.slug]),
          });
        } else {
          existingCovered.sourceRecipeSlugs.add(recipe.slug);
        }
        continue;
      }
      const existing = ingredientMap.get(normalized);
      if (existing) {
        existing.sourceRecipeSlugs.add(recipe.slug);
      } else {
        ingredientMap.set(normalized, {
          name: ing,
          category: inferCategory(ing),
          sourceRecipeSlugs: new Set([recipe.slug]),
        });
      }
    }
  }

  let list = await prisma.shoppingList.findFirst({
    where: { userId, mealPlanWeekId: week.id },
    include: { items: true },
  });

  if (!list) {
    list = await prisma.shoppingList.create({
      data: {
        userId,
        mealPlanWeekId: week.id,
        title: `Shopping List (${week.weekKey})`,
        strictness,
        generatedAt: new Date(),
      },
      include: { items: true },
    });
  } else {
    const manualItems = list.items.filter((i) => i.isManual);
    await prisma.shoppingListItem.deleteMany({ where: { shoppingListId: list.id, isManual: false } });
    list = await prisma.shoppingList.findUnique({ where: { id: list.id }, include: { items: true } });
    if (!list) throw new Error("Shopping list missing after regeneration");
    list.items = manualItems as typeof list.items;
  }

  if (ingredientMap.size > 0) {
    await prisma.shoppingListItem.createMany({
      data: Array.from(ingredientMap.entries()).map(([normalizedName, value]) => ({
        shoppingListId: list.id,
        name: value.name,
        normalizedName,
        category: value.category,
        quantityText: null,
        sourceRecipeSlugs: Array.from(value.sourceRecipeSlugs),
        isManual: false,
      })),
    });
  }

  const refreshed = await prisma.shoppingList.findUnique({ where: { id: list.id }, include: { items: { orderBy: [{ category: "asc" }, { name: "asc" }] } } });
  return mapList(refreshed);
}

export async function getShoppingListForWeekByEmail(email: string, weekKey: string): Promise<ShoppingListRecord | null> {
  if (!SHOULD_USE_PRISMA) return null;
  const userId = await getUserIdByEmail(email);
  const week = await getMealPlanWeekByEmail(email, weekKey);
  const list = await prisma.shoppingList.findFirst({ where: { userId, mealPlanWeekId: week.id }, include: { items: true } });
  return list ? mapList(list) : null;
}

export async function toggleShoppingListItemByEmail(email: string, itemId: string) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const userId = await getUserIdByEmail(email);
  const item = await prisma.shoppingListItem.findFirst({ where: { id: itemId, shoppingList: { userId } } });
  if (!item) throw new Error("Item not found");
  await prisma.shoppingListItem.update({ where: { id: itemId }, data: { checked: !item.checked } });
}

export async function updateShoppingListItemByEmail(email: string, itemId: string, updates: Partial<{ name: string; quantityText: string | null; note: string | null; category: string | null; }>) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const userId = await getUserIdByEmail(email);
  const item = await prisma.shoppingListItem.findFirst({ where: { id: itemId, shoppingList: { userId } } });
  if (!item) throw new Error("Item not found");
  await prisma.shoppingListItem.update({
    where: { id: itemId },
    data: {
      name: updates.name ?? item.name,
      normalizedName: updates.name ? canonicalIngredient(updates.name) : item.normalizedName,
      quantityText: updates.quantityText ?? item.quantityText,
      note: updates.note ?? item.note,
      category: updates.category ?? item.category,
    },
  });
}

export async function mergeShoppingListRegenerationByEmail(email: string, weekKey: string) {
  return generateShoppingListFromMealPlanByEmail(email, weekKey);
}
