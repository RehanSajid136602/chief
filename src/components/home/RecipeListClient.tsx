"use client";

import { useState, useMemo, useCallback } from "react";
import { Recipe } from "@/lib/types";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { FilterBar } from "@/components/recipe/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";

interface RecipeListClientProps {
  recipes: Recipe[];
  allTags: string[];
  favorites: string[];
}

export function RecipeListClient({ 
  recipes, 
  allTags,
  favorites,
}: RecipeListClientProps) {

  const [filters, setFilters] = useState({
    tags: [] as string[],
    maxTime: "all",
    maxCalories: "all",
    sort: "time-asc",
  });
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="max-w-xl">
          <Input
            type="search"
            placeholder="Search title, tags, or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11"
          />
        </div>
        <FilterBar allTags={allTags} onFilterChange={handleFilterChange} />
      </div>

      {filteredRecipes.length > 0 ? (
        <RecipeGrid recipes={filteredRecipes} favorites={favorites} />
      ) : (
        <EmptyState
          heading="No recipes found"
          message="Try removing a tag, increasing the time/calorie limit, or using a broader search term."
        />
      )}
    </div>
  );
}
