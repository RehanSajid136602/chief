import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getAllRecipes } from "@/lib/recipes";
import { getMealPlanWeekByEmail } from "@/lib/planner";
import { getCurrentWeekKey } from "@/lib/validation/planner";
import { PlannerClient } from "./PlannerClient";

export const dynamic = "force-dynamic";

export default async function PlannerPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/login");

  const weekKey = getCurrentWeekKey();
  let week;
  try {
    week = await getMealPlanWeekByEmail(session.user.email, weekKey);
  } catch {
    week = { id: "local", weekKey, timezone: null, entries: [] };
  }

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-28 pb-16 md:pt-32">
        <Container className="max-w-7xl">
          <Reveal y={14}>
            <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Planner</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100">Weekly Meal Planner</h1>
            <p className="text-sm leading-6 text-zinc-400 max-w-2xl">
              Plan breakfast, lunch, and dinner for the week. Use manual planning first or generate a plan with AI.
            </p>
            </div>
          </Reveal>
          <Reveal y={16} delay={0.03}>
            <PlannerClient
              initialWeek={week}
              recipes={getAllRecipes()}
              dbConfigured={Boolean(process.env.DATABASE_URL)}
            />
          </Reveal>
        </Container>
      </main>
    </>
  );
}
