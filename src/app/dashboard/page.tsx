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
      <main className="min-h-screen pt-32 pb-20">
        <Container className="max-w-6xl">
          <header className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
              Welcome back, <br />
              <span className="text-gradient-emerald">
                {user.name || "Chef"}
              </span>
            </h1>
            <p className="text-zinc-500 font-medium">
              Manage your profile and explore your saved culinary masterpieces.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              <section className="space-y-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                  My Favorites
                  <span className="ml-2 text-sm font-bold text-zinc-600 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest">
                    {favoriteRecipes.length}
                  </span>
                </h2>

                {favoriteRecipes.length > 0 ? (
                  <RecipeGrid 
                    recipes={favoriteRecipes} 
                    favorites={user.favorites}
                  />
                ) : (
                  <div className="premium-card rounded-[2rem] p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                      <ChefHat className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Your cookbook is empty</h3>
                      <p className="text-zinc-500 max-w-sm mx-auto">
                        Start exploring our curated collection and save recipes you&apos;d love to cook later.
                      </p>
                    </div>
                    <Link href="/#recipes">
                      <Button className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 px-8 font-bold">
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
