export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  caloriesPerServing: number;
  tags: string[];
  category: string;
  images: string[];
  youtubeVideoUrl: string;
  sourceUrl: string;
  ingredients: string[];
  steps: string[];
}

export interface MatchResult {
  recipe: Recipe;
  matchCount: number;
  matchPercent: number;
  missingIngredients: string[];
}
