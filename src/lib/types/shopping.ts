export interface ShoppingListItemRecord {
  id: string;
  name: string;
  normalizedName: string | null;
  quantityText: string | null;
  category: string | null;
  note: string | null;
  checked: boolean;
  isManual: boolean;
  sourceRecipeSlugs: string[];
}

export interface ShoppingListRecord {
  id: string;
  title: string;
  mealPlanWeekId: string | null;
  strictness: string | null;
  items: ShoppingListItemRecord[];
}
