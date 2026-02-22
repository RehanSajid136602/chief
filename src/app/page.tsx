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
        <Container className="py-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8">
            All Recipes
          </h2>
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

