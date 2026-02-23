import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getCurrentWeekKey } from "@/lib/validation/planner";
import { getShoppingListForWeekByEmail } from "@/lib/shopping";
import { ShoppingClient } from "./ShoppingClient";

export const dynamic = "force-dynamic";

export default async function ShoppingPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/login");
  const weekKey = getCurrentWeekKey();
  let list = null;
  try {
    list = await getShoppingListForWeekByEmail(session.user.email, weekKey);
  } catch {
    list = null;
  }
  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-28 pb-16 md:pt-32">
        <Container className="max-w-5xl">
          <Reveal y={14}>
            <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Shopping</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100">Pantry-Aware Grocery List</h1>
            <p className="text-sm leading-6 text-zinc-400">Generate a grocery list from your current week plan and exclude pantry-covered items.</p>
            </div>
          </Reveal>
          <Reveal y={16} delay={0.03}>
            <ShoppingClient initialList={list} weekKey={weekKey} dbConfigured={Boolean(process.env.DATABASE_URL)} />
          </Reveal>
        </Container>
      </main>
    </>
  );
}
