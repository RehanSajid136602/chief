"use client";

import { useState, useMemo, useCallback } from "react";
import { Recipe } from "@/lib/types";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { FilterBar } from "@/components/recipe/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/Reveal";
import { VoiceSearchButton } from "@/components/ui/VoiceSearchButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface RecipeListClientProps {
  recipes: Recipe[];
  allTags: string[];
  favorites: string[];
  pantryMatchCountsBySlug?: Record<string, number>;
}

export function RecipeListClient({ 
  recipes, 
  allTags,
  favorites,
  pantryMatchCountsBySlug = {},
}: RecipeListClientProps) {

  const [filters, setFilters] = useState({
    tags: [] as string[],
    maxTime: "all",
    maxCalories: "all",
    sort: "time-asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isSupported,
    isListening,
    isProcessing,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition({
    onTranscript(text) {
      setSearchQuery(text);
    },
  });

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (filters.tags.length > 0) {
      result = result.filter((r) =>
        filters.tags.some((tag) => r.tags.includes(tag))
      );
    }

    if (filters.maxTime !== "all") {
      result = result.filter((r) => r.totalTime <= parseInt(filters.maxTime));
    }

    if (filters.maxCalories !== "all") {
      result = result.filter(
        (r) => r.caloriesPerServing <= parseInt(filters.maxCalories)
      );
    }

    switch (filters.sort) {
      case "time-asc":
        result.sort((a, b) => a.totalTime - b.totalTime);
        break;
      case "time-desc":
        result.sort((a, b) => b.totalTime - a.totalTime);
        break;
      case "calories-asc":
        result.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing);
        break;
      case "calories-desc":
        result.sort((a, b) => b.caloriesPerServing - a.caloriesPerServing);
        break;
    }

    return result;
  }, [recipes, filters, searchQuery]);

  const handleFilterChange = useCallback(
    (newFilters: {
      tags: string[];
      maxTime: string;
      maxCalories: string;
      sort: string;
    }) => {
      setFilters(newFilters);
    },
    []
  );

  return (
    <div className="space-y-8" id="recipes">
      <Reveal y={10}>
        <div className="surface-subtle rounded-2xl p-4 md:p-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <p className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-500">
              Voice Search
            </p>
            {transcript ? (
              <button
                type="button"
                onClick={clearTranscript}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Clear transcript
              </button>
            ) : null}
          </div>
          {isListening ? (
            <p className="text-sm text-emerald-300">Listening... speak now and tap stop when finished.</p>
          ) : transcript ? (
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Transcript:</span> {transcript}
            </p>
          ) : (
            <p className="text-sm text-zinc-400">
              Tap Voice Search to speak a recipe name, ingredient, or tag. The transcript will fill the search box below.
            </p>
          )}
          {voiceError ? (
            <p className="text-xs text-rose-300">
              Voice search error: {voiceError === "not-allowed" ? "Microphone permission was denied." : voiceError}
            </p>
          ) : null}
          {!isSupported ? (
            <p className="text-xs text-zinc-500">
              Your browser does not support speech recognition. You can still use normal text search.
            </p>
          ) : null}
        </div>
      </Reveal>

      <Reveal y={12}>
        <div className="surface-panel rounded-2xl p-4 md:p-5 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-500">
                Search & Filter
              </p>
              <p className="text-sm text-zinc-400 leading-6">
                {filteredRecipes.length} result{filteredRecipes.length === 1 ? "" : "s"} from {recipes.length} recipes
              </p>
            </div>
            {(filters.tags.length > 0 || filters.maxTime !== "all" || filters.maxCalories !== "all" || searchQuery.trim()) && (
              <p className="text-xs text-zinc-500">
                Active filters are applied.
              </p>
            )}
          </div>
          <div className="max-w-2xl flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search title, tags, or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11"
              />
            </div>
            <VoiceSearchButton
              isSupported={isSupported}
              isListening={isListening}
              isProcessing={isProcessing}
              onStart={startListening}
              onStop={stopListening}
            />
          </div>
          <FilterBar allTags={allTags} onFilterChange={handleFilterChange} />
        </div>
      </Reveal>

      <Reveal y={18} delay={0.04}>
        {filteredRecipes.length > 0 ? (
          <RecipeGrid
            recipes={filteredRecipes}
            favorites={favorites}
            pantryMatchCounts={filteredRecipes.map((r) => pantryMatchCountsBySlug[r.slug] ?? 0)}
            animateEntrance={filteredRecipes.length <= 18}
            revealLimit={12}
          />
        ) : (
          <EmptyState
            heading="No recipes found"
            message="Try removing a tag, increasing the time/calorie limit, or using a broader search term."
          />
        )}
      </Reveal>
    </div>
  );
}
