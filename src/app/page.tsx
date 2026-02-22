import { Suspense } from "react";
import { getAllRecipes } from "@/lib/recipes";
import { Hero } from "@/components/home/Hero";
import { RecipeListClient } from "@/components/home/RecipeListClient";
import { RecipeGridSkeleton } from "@/components/recipe/RecipeGrid";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/ui/Navbar";
import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/users";

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
  if (session?.user?.email) {
    const user = await findUserByEmail(session.user.email);
    favorites = user?.favorites || [];
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
          <div className="mb-8 md:mb-10 flex flex-col gap-2">
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
          <Suspense fallback={<RecipeGridSkeleton count={6} />}>
            <RecipeListClient 
              recipes={recipes} 
              allTags={allTags} 
              favorites={favorites}
            />
          </Suspense>
        </Container>
      </main>
    </>
  );
}
