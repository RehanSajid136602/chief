import type { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ChefShowcaseClient } from "@/components/chefs/ChefShowcaseClient";
import { chefs } from "@/data/chefs";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Featured Chefs - RecipeHub",
  description:
    "Discover popular chefs from Pakistan and around the world, with specialties and trusted profile links.",
};

export default async function ChefsPage() {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pt-28 pb-16 md:pt-32 md:pb-20">
        <Container className="max-w-7xl">
          <Reveal y={14}>
            <header className="mb-8 md:mb-10 space-y-2">
              <p className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-500">
                Chef Showcase
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100">
                Popular Chefs from Pakistan and Around the World
              </h1>
              <p className="max-w-3xl text-sm md:text-base leading-6 text-zinc-400">
                Explore a curated list of influential chefs and cooking personalities. Use this as inspiration for cuisines, techniques, and cooking styles.
              </p>
            </header>
          </Reveal>

          <Reveal y={16} delay={0.03}>
            <ChefShowcaseClient chefs={chefs} />
          </Reveal>
        </Container>
      </main>
    </>
  );
}
