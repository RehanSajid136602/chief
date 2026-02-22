"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IngredientInputProps {
  onFindRecipes: (ingredients: string[]) => void;
  isLoading: boolean;
}

export function IngredientInput({ onFindRecipes, isLoading }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length > 0) {
      onFindRecipes(ingredients);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter ingredients (press Enter or comma to add)"
          className="h-11"
        />
        <Button
          type="button"
          onClick={addIngredient}
          variant="outline"
          className="h-11 px-4"
        >
          Add
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <Chip
              key={ingredient}
              label={ingredient}
              onRemove={() => removeIngredient(ingredient)}
            />
          ))}
        </div>
      )}

      <Button
        type="submit"
        disabled={ingredients.length === 0 || isLoading}
        className="w-full h-11 font-semibold"
      >
        {isLoading ? "Finding recipes..." : "Find Recipes"}
      </Button>
    </form>
  );
}
