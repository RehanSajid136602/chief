import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  const heroStats = [
    ["12 curated recipes", "Fast browsing with filters and search"],
    ["Ingredient matcher", "Use pantry items to narrow options"],
    ["Save favorites", "Build your cookbook after login"],
  ] as const;

  return (
    <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 h-48 w-[85%] rounded-full bg-emerald-400/5 blur-3xl animate-glow-drift" />
        <div
          className="absolute top-24 right-[8%] h-36 w-36 rounded-full bg-cyan-300/5 blur-3xl animate-glow-drift"
          style={{ animationDelay: "-5s" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 mb-6 reveal-on-mount">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-zinc-400">
              AI-Powered Culinary Magic
            </span>
          </div>

          <h1 className="max-w-5xl text-left text-[2.4rem] leading-[1.02] tracking-tight text-zinc-50 md:text-6xl lg:text-7xl font-semibold mb-5">
            Cook better with what you already have.
            <span className="block text-zinc-400 mt-2 md:mt-3">
              Find recipes fast, compare options, and save what you actually want to make.
            </span>
          </h1>

          <p
            className="max-w-2xl text-left text-base md:text-lg leading-7 text-zinc-400 mb-8 reveal-on-mount"
            style={{ ["--reveal-delay" as string]: "70ms" }}
          >
            Search by ingredients, filter by time or calories, and build a personal cookbook of reliable recipes. Clean workflow, no clutter.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center reveal-on-mount"
            style={{ ["--reveal-delay" as string]: "110ms" }}
          >
            <Link href="/ai">
              <Button
                size="lg"
                className="h-12 px-6 text-sm md:text-base rounded-xl font-semibold"
              >
                Try AI Matcher
              </Button>
            </Link>
            <Link href="/#recipes">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-6 text-sm md:text-base rounded-xl"
              >
                Explore Recipes
              </Button>
            </Link>
          </div>

          <div
            className="mt-10 grid gap-3 sm:grid-cols-3 max-w-3xl reveal-on-mount"
            style={{ ["--reveal-delay" as string]: "140ms" }}
          >
            {heroStats.map(([title, text], index) => (
              <div
                key={title}
                className="surface-subtle rounded-xl p-4"
                style={{ ["--reveal-delay" as string]: `${170 + index * 35}ms` }}
              >
                <p className="text-sm font-semibold text-zinc-100">{title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#090b0f] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
