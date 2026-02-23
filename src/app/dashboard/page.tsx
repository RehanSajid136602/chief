import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { findUserByEmail } from "@/lib/users";
import { getRecipeBySlug } from "@/lib/recipes";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/ui/Navbar";
import { Reveal } from "@/components/ui/Reveal";
import { DashboardClient } from "./DashboardClient";
import { Heart, ChefHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getHouseholdProfileByEmail } from "@/lib/household";
import { getPantrySummaryByEmail } from "@/lib/pantry";
import { getCurrentWeekKey } from "@/lib/validation/planner";
import { getMealPlanWeekByEmail } from "@/lib/planner";
import { getShoppingListForWeekByEmail } from "@/lib/shopping";

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
  const householdProfile = await getHouseholdProfileByEmail(session.user.email);
  const pantrySummary = await getPantrySummaryByEmail(session.user.email);
  const weekKey = getCurrentWeekKey();
  let plannerWeek = { entries: [] as { id: string }[] };
  let shoppingList = null as Awaited<ReturnType<typeof getShoppingListForWeekByEmail>> | null;
  try {
    plannerWeek = await getMealPlanWeekByEmail(session.user.email, weekKey);
    shoppingList = await getShoppingListForWeekByEmail(session.user.email, weekKey);
  } catch {
    plannerWeek = { entries: [] };
    shoppingList = null;
  }

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-28 pb-16 md:pt-32 md:pb-20">
        <Container className="max-w-6xl">
          <Reveal y={14}>
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
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            <Reveal className="lg:col-span-2 space-y-10" y={16} delay={0.02}>
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
            </Reveal>

            <Reveal className="space-y-8" y={16} delay={0.04}>
              <section className="surface-panel rounded-2xl p-6 md:p-7 reveal-on-mount" style={{ ["--reveal-delay" as string]: "40ms" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.1em] font-semibold text-zinc-500">
                      Household
                    </p>
                    <h2 className="text-lg font-semibold text-zinc-100">
                      {householdProfile ? "Preferences configured" : "Set up household profile"}
                    </h2>
                    <p className="text-sm leading-6 text-zinc-400">
                      {householdProfile
                        ? `Meals/week: ${householdProfile.mealsPerWeek ?? "not set"} · Leftovers: ${
                            householdProfile.prefersLeftovers ? "on" : "off"
                          }`
                        : "Save your family preferences so the planner and grocery features can personalize recommendations."}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] border ${
                      householdProfile
                        ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                        : "border-white/[0.08] bg-white/[0.03] text-zinc-400"
                    }`}
                  >
                    {householdProfile ? "Ready" : "Incomplete"}
                  </span>
                </div>
                <Link href="/dashboard/household" className="mt-5 inline-flex">
                  <Button variant="outline" className="h-10 rounded-xl">
                    {householdProfile ? "Edit Household" : "Set Up Household"}
                  </Button>
                </Link>
              </section>
              <section className="surface-panel rounded-2xl p-6 md:p-7 reveal-on-mount" style={{ ["--reveal-delay" as string]: "80ms" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.1em] font-semibold text-zinc-500">
                      Pantry
                    </p>
                    <h2 className="text-lg font-semibold text-zinc-100">
                      {pantrySummary.total > 0 ? "Inventory active" : "Add pantry staples"}
                    </h2>
                    <p className="text-sm leading-6 text-zinc-400">
                      {pantrySummary.total > 0
                        ? `${pantrySummary.total} item(s) · ${pantrySummary.lowStockCount} low-stock · ${pantrySummary.expiredCount} expired`
                        : "Track ingredients you already have so meal plans and grocery lists avoid duplicates."}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                    {pantrySummary.total} items
                  </span>
                </div>
                <Link href="/dashboard/pantry" className="mt-5 inline-flex">
                  <Button variant="outline" className="h-10 rounded-xl">
                    Open Pantry
                  </Button>
                </Link>
              </section>
              <section className="surface-panel rounded-2xl p-6 md:p-7 reveal-on-mount" style={{ ["--reveal-delay" as string]: "120ms" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.1em] font-semibold text-zinc-500">Planner</p>
                    <h2 className="text-lg font-semibold text-zinc-100">Weekly Meal Plan</h2>
                    <p className="text-sm leading-6 text-zinc-400">
                      {plannerWeek.entries.length > 0
                        ? `${plannerWeek.entries.length} planned slot(s) for ${weekKey}`
                        : "Create your weekly plan manually or generate one with AI."}
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/planner" className="mt-5 inline-flex">
                  <Button variant="outline" className="h-10 rounded-xl">Open Planner</Button>
                </Link>
              </section>
              <section className="surface-panel rounded-2xl p-6 md:p-7 reveal-on-mount" style={{ ["--reveal-delay" as string]: "160ms" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.1em] font-semibold text-zinc-500">Shopping</p>
                    <h2 className="text-lg font-semibold text-zinc-100">Grocery List</h2>
                    <p className="text-sm leading-6 text-zinc-400">
                      {shoppingList?.items?.length
                        ? `${shoppingList.items.length} item(s) in your latest list`
                        : "Generate a pantry-aware grocery list from your weekly meal plan."}
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/shopping" className="mt-5 inline-flex">
                  <Button variant="outline" className="h-10 rounded-xl">Open Shopping</Button>
                </Link>
              </section>
              <div className="reveal-on-mount" style={{ ["--reveal-delay" as string]: "200ms" }}>
                <DashboardClient user={{ email: user.email, name: user.name, region: user.region ?? null }} />
              </div>
            </Reveal>
          </div>
        </Container>
      </main>
    </>
  );
}
