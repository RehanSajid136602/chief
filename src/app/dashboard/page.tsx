import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { findUserByEmail } from "@/lib/users";
import { getRecipeBySlug } from "@/lib/recipes";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/ui/Navbar";
import { DashboardClient } from "./DashboardClient";
import { Heart, ChefHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await findUserByEmail(session.user.email);
  if (!user) {
    redirect("/auth/login");
  }

  const favoriteRecipes = (user.favorites || [])
    .map((slug) => getRecipeBySlug(slug))
    .filter((r) => !!r);

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-28 pb-16 md:pt-32 md:pb-20">
        <Container className="max-w-6xl">
          <header className="mb-10 md:mb-12 space-y-2">
            <p className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-500">
              Dashboard
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold text-zinc-100 tracking-tight">
              Welcome back, {user.name || "Chef"}
            </h1>
            <p className="text-sm md:text-base leading-6 text-zinc-400 max-w-2xl">
              Manage your profile and return to the recipes you saved. Everything is grouped for quick scanning.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-10">
              <section className="space-y-8">
                <h2 className="text-xl md:text-2xl font-semibold text-zinc-100 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
                  My Favorites
                  <span className="ml-1 text-xs font-semibold text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] uppercase tracking-[0.08em]">
                    {favoriteRecipes.length}
                  </span>
                </h2>

                {favoriteRecipes.length > 0 ? (
                  <RecipeGrid 
                    recipes={favoriteRecipes} 
                    favorites={user.favorites}
                  />
                ) : (
                  <div className="surface-panel rounded-2xl p-8 md:p-10 text-left space-y-5">
                    <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-zinc-100">Your cookbook is empty</h3>
                      <p className="text-zinc-400 max-w-md leading-6">
                        Start exploring our curated collection and save recipes you&apos;d love to cook later.
                      </p>
                    </div>
                    <Link href="/#recipes">
                      <Button variant="outline" className="h-11 px-5 rounded-xl font-medium">
                        Browse Recipes
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-8">
              <DashboardClient user={{ email: user.email, name: user.name }} />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
