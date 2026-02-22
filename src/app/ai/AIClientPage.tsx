"use client";

import { useState } from "react";
import { matchRecipes } from "@/lib/recipes";
import { MatchResult } from "@/lib/types";
import { IngredientInput } from "@/components/ai/IngredientInput";
import { MatchResults } from "@/components/ai/MatchResults";
import { Container } from "@/components/ui/Container";

export function AIClientPage() {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindRecipes = (ingredients: string[]) => {
    setIsLoading(true);
    setTimeout(() => {
      const matched = matchRecipes(ingredients);
      setResults(matched);
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      <Container className="max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            AI Ingredient Matcher
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Tell us what ingredients you have, and we&apos;ll find recipes you can
            make. Our smart matching algorithm finds the best matches based on
            what you have available.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              What ingredients do you have?
            </h2>
            <IngredientInput
              onFindRecipes={handleFindRecipes}
              isLoading={isLoading}
            />
          </div>
        </div>

        {results.length > 0 && <MatchResults results={results} />}
      </Container>
    </main>
  );
}
