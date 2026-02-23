import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { listPantryItemsByEmail } from "@/lib/pantry";
import { PantryClient } from "./PantryClient";

export const dynamic = "force-dynamic";

export default async function PantryPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const items = await listPantryItemsByEmail(session.user.email);

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-28 pb-16 md:pt-32">
        <Container className="max-w-5xl">
          <Reveal y={14}>
            <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Pantry
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100">
              Pantry Manager
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400">
              Track what you already have, flag low-stock staples, and power smarter meal planning and grocery generation.
            </p>
            </div>
          </Reveal>

          <Reveal y={16} delay={0.03}>
            <PantryClient items={items} dbConfigured={Boolean(process.env.DATABASE_URL)} />
          </Reveal>
        </Container>
      </main>
    </>
  );
}
