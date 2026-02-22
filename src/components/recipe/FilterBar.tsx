"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  allTags: string[];
  onFilterChange: (filters: {
    tags: string[];
    maxTime: string;
    maxCalories: string;
    sort: string;
  }) => void;
}

export function FilterBar({ allTags, onFilterChange }: FilterBarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState("all");
  const [maxCalories, setMaxCalories] = useState("all");
  const [sort, setSort] = useState("time-asc");

  const handleTagToggle = useCallback(
    (tag: string) => {
      const newTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      setSelectedTags(newTags);
      onFilterChange({ tags: newTags, maxTime, maxCalories, sort });
    },
    [selectedTags, maxTime, maxCalories, sort, onFilterChange]
  );

  const handleTimeChange = useCallback(
    (value: string) => {
      setMaxTime(value);
      onFilterChange({ tags: selectedTags, maxTime: value, maxCalories, sort });
    },
    [selectedTags, maxCalories, sort, onFilterChange]
  );

  const handleCaloriesChange = useCallback(
    (value: string) => {
      setMaxCalories(value);
      onFilterChange({ tags: selectedTags, maxTime, maxCalories: value, sort });
    },
    [selectedTags, maxTime, sort, onFilterChange]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSort(value);
      onFilterChange({ tags: selectedTags, maxTime, maxCalories, sort: value });
    },
    [selectedTags, maxTime, maxCalories, onFilterChange]
  );

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setMaxTime("all");
    setMaxCalories("all");
    setSort("time-asc");
    onFilterChange({ tags: [], maxTime: "all", maxCalories: "all", sort: "time-asc" });
  }, [onFilterChange]);

  const hasFilters =
    selectedTags.length > 0 || maxTime !== "all" || maxCalories !== "all";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2.5">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-[0.08em] transition-colors border",
              selectedTags.includes(tag)
                ? "bg-emerald-400/15 border-emerald-300/30 text-emerald-200"
                : "bg-white/[0.02] border-white/[0.06] text-zinc-500 hover:text-zinc-200 hover:border-white/10"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-[160px_180px_180px_auto] md:items-center">
        <Select value={maxTime} onValueChange={handleTimeChange}>
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="Max Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Time</SelectItem>
            <SelectItem value="15">Under 15 min</SelectItem>
            <SelectItem value="30">Under 30 min</SelectItem>
            <SelectItem value="45">Under 45 min</SelectItem>
            <SelectItem value="60">Under 1 hour</SelectItem>
          </SelectContent>
        </Select>

        <Select value={maxCalories} onValueChange={handleCaloriesChange}>
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="Max Calories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Calories</SelectItem>
            <SelectItem value="300">Under 300</SelectItem>
            <SelectItem value="400">Under 400</SelectItem>
            <SelectItem value="500">Under 500</SelectItem>
            <SelectItem value="600">Under 600</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time-asc">Quickest First</SelectItem>
            <SelectItem value="time-desc">Longest First</SelectItem>
            <SelectItem value="calories-asc">Lowest Calories</SelectItem>
            <SelectItem value="calories-desc">Highest Calories</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="justify-self-start md:justify-self-end rounded-full px-3 text-zinc-400"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
