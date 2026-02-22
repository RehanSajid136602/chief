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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-wrap gap-3">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border",
              selectedTags.includes(tag)
                ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-105"
                : "bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select value={maxTime} onValueChange={handleTimeChange}>
          <SelectTrigger className="w-[160px] bg-white/5 border-white/5 text-zinc-300 rounded-xl h-12 focus:ring-emerald-500/50">
            <SelectValue placeholder="Max Time" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-xl">
            <SelectItem value="all" className="text-zinc-300">Any Time</SelectItem>
            <SelectItem value="15" className="text-zinc-300">Under 15 min</SelectItem>
            <SelectItem value="30" className="text-zinc-300">Under 30 min</SelectItem>
            <SelectItem value="45" className="text-zinc-300">Under 45 min</SelectItem>
            <SelectItem value="60" className="text-zinc-300">Under 1 hour</SelectItem>
          </SelectContent>
        </Select>

        <Select value={maxCalories} onValueChange={handleCaloriesChange}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/5 text-zinc-300 rounded-xl h-12 focus:ring-emerald-500/50">
            <SelectValue placeholder="Max Calories" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-xl">
            <SelectItem value="all" className="text-zinc-300">Any Calories</SelectItem>
            <SelectItem value="300" className="text-zinc-300">Under 300</SelectItem>
            <SelectItem value="400" className="text-zinc-300">Under 400</SelectItem>
            <SelectItem value="500" className="text-zinc-300">Under 500</SelectItem>
            <SelectItem value="600" className="text-zinc-300">Under 600</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/5 text-zinc-300 rounded-xl h-12 focus:ring-emerald-500/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-xl">
            <SelectItem value="time-asc" className="text-zinc-300">Quickest First</SelectItem>
            <SelectItem value="time-desc" className="text-zinc-300">Longest First</SelectItem>
            <SelectItem value="calories-asc" className="text-zinc-300">Lowest Calories</SelectItem>
            <SelectItem value="calories-desc" className="text-zinc-300">Highest Calories</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-zinc-500 hover:text-white rounded-full"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

