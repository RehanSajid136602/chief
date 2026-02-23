import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getHouseholdProfileByEmail } from "@/lib/household";
import { HouseholdForm } from "./HouseholdForm";

export const dynamic = "force-dynamic";

export default async function HouseholdPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const profile = await getHouseholdProfileByEmail(session.user.email);

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-28 pb-16 md:pt-32">
        <Container className="max-w-4xl">
          <Reveal y={14}>
            <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Household
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100">
              Family Preferences & Planning Defaults
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400">
              Configure the constraints and preferences that power meal planning, grocery generation, and AI suggestions.
            </p>
            </div>
          </Reveal>

          <Reveal y={16} delay={0.03}>
            <section className="surface-panel rounded-2xl p-6 md:p-8">
            {!process.env.DATABASE_URL && (
              <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                Database is not configured yet. You can review the form, but saving requires a running Postgres database and `DATABASE_URL`.
              </div>
            )}
            <HouseholdForm initialProfile={profile} />
            </section>
          </Reveal>
        </Container>
      </main>
    </>
  );
}
