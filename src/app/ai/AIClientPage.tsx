"use client";

import { useState } from "react";
import { matchRecipes } from "@/lib/recipes";
import { MatchResult } from "@/lib/types";
import { IngredientInput } from "@/components/ai/IngredientInput";
import { MatchResults } from "@/components/ai/MatchResults";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function AIClientPage() {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindRecipes = (ingredients: string[]) => {
    setHasSearched(true);
    setIsLoading(true);
    setTimeout(() => {
      const matched = matchRecipes(ingredients);
      setResults(matched);
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen pt-24 pb-14">
      <Container className="max-w-5xl">
        <Reveal y={14}>
          <div className="mb-10 md:mb-12">
          <p className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-500 mb-2">
            Ingredient Matcher
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100 mb-3">
            AI Ingredient Matcher
          </h1>
          <p className="text-base md:text-lg leading-7 text-zinc-400 max-w-3xl">
            Add ingredients from your pantry and get the best recipe matches. This flow is optimized for quick decisions, not noisy prompts.
          </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <Reveal y={16}>
            <div className="surface-panel rounded-2xl p-5 md:p-6 h-fit">
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">
                What ingredients do you have?
              </h2>
              <p className="text-sm leading-6 text-zinc-400 mb-4">
                Press Enter or comma to add each ingredient. Keep it simple: “chicken”, “rice”, “garlic”, “tomato”.
              </p>
              <IngredientInput
                onFindRecipes={handleFindRecipes}
                isLoading={isLoading}
              />
            </div>
          </Reveal>

          <Reveal y={16} delay={0.03}>
            <div className="space-y-4">
            {!hasSearched && (
              <div className="surface-subtle rounded-2xl p-5">
                <p className="text-sm font-semibold text-zinc-100 mb-1">
                  Start with 3 to 5 ingredients
                </p>
                <p className="text-sm leading-6 text-zinc-400">
                  The matcher works best when you add core ingredients first, then filter recipe options by time or calories on the home page if needed.
                </p>
              </div>
            )}
            {(hasSearched || results.length > 0) && <MatchResults results={results} />}
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
