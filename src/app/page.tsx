import nextDynamic from "next/dynamic";
import { getAllRecipes } from "@/lib/recipes";
import { Hero } from "@/components/home/Hero";
import { RecipeGridSkeleton } from "@/components/recipe/RecipeGrid";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/ui/Navbar";
import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/users";
import { listPantryItemsByEmail } from "@/lib/pantry";
import { normalizeIngredient } from "@/lib/recipes";

const RecipeListClient = nextDynamic(
  () => import("@/components/home/RecipeListClient").then((mod) => mod.RecipeListClient),
  {
    ssr: false,
    loading: () => (
      <div id="recipes" className="space-y-6">
        <div className="surface-subtle rounded-2xl p-4 md:p-5">
          <p className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-500 mb-2">
            Loading Recipes
          </p>
          <p className="text-sm text-zinc-400">
            Preparing filters and search tools for the recipe library.
          </p>
        </div>
        <RecipeGridSkeleton count={6} />
      </div>
    ),
  }
);

export const dynamic = "force-dynamic";

export const metadata = {
  title: "RecipeHub - Discover Delicious Recipes",
  description:
    "Explore our curated collection of amazing recipes. Find exactly what you're looking for with our smart ingredient matcher.",
};

export default async function Home() {
  const session = await auth();
  const recipes = getAllRecipes();
  
  let favorites: string[] = [];
  let pantryMatchCountsBySlug: Record<string, number> = {};
  if (session?.user?.email) {
    const user = await findUserByEmail(session.user.email);
    favorites = user?.favorites || [];
    const pantryItems = await listPantryItemsByEmail(session.user.email);
    const pantrySet = new Set(pantryItems.map((p) => normalizeIngredient(p.normalizedName || p.name)).filter(Boolean));
    pantryMatchCountsBySlug = Object.fromEntries(
      recipes.map((recipe) => [
        recipe.slug,
        recipe.ingredients
          .map((i) => normalizeIngredient(i))
          .filter((i) => pantrySet.has(i)).length,
      ])
    );
  }

  const allTags = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.tags))
  ).sort();

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-16">
        <Hero />
        <Container className="py-10 md:py-12">
          <div className="mb-8 md:mb-10 flex flex-col gap-2 reveal-on-mount">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 font-semibold">
              Recipe Library
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100">
              Browse recipes by time, calories, and cravings
            </h2>
            <p className="max-w-2xl text-sm md:text-base leading-6 text-zinc-400">
              Start broad, then narrow quickly with tags and filters. The interface is optimized for scanning, not endless scrolling.
            </p>
          </div>
          <RecipeListClient
            recipes={recipes}
            allTags={allTags}
            favorites={favorites}
            pantryMatchCountsBySlug={pantryMatchCountsBySlug}
          />
        </Container>
      </main>
    </>
  );
}
