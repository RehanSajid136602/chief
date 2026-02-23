## 1. Persistence Foundation (P0)

- [x] 1.1 Add Prisma + Postgres configuration (`prisma/schema.prisma`, client setup, env vars)
- [x] 1.2 Model `User`, `FavoriteRecipe`, `Household`, `PantryItem`, `MealPlanWeek`, `MealPlanEntry`, `ShoppingList`, `ShoppingListItem`, and `AiGenerationRun`
- [x] 1.3 Create initial Prisma migration and verify local/dev DB bootstrap
- [x] 1.4 Replace file-based implementations in `src/lib/users.ts` with Prisma-backed persistence (preserve public helper signatures where practical)
- [x] 1.5 Add one-time migration script to import legacy `data/users.json` users/favorites into Postgres
- [x] 1.6 Validate existing auth, favorites, and dashboard profile flows after migration

## 2. Household Profile & Preferences

- [x] 2.1 Add household profile types and validation schema
- [x] 2.2 Implement household CRUD server actions (`createOrUpdateHouseholdProfile`, `getHouseholdProfile`)
- [x] 2.3 Create `/dashboard/household` page with form UI and save/error states
- [x] 2.4 Add dashboard card/widget linking to household settings and completion status
- [x] 2.5 Add tests for household validation and persistence

## 3. Pantry Manager

- [x] 3.1 Add pantry item data model, types, and validation (quantity/unit/category/expiry)
- [x] 3.2 Implement pantry server actions (add/update/delete/list/bulk-add-from-text)
- [x] 3.3 Create `/dashboard/pantry` page with CRUD UI, filtering, and low-stock/expired indicators
- [x] 3.4 Reuse and extend ingredient normalization for pantry-aware matching support
- [x] 3.5 Add pantry summary widget to dashboard
- [x] 3.6 Add unit/integration tests for pantry logic and expiry/status rules

## 4. Weekly Meal Planner (Manual First)

- [x] 4.1 Add meal plan week/entry models and validation (week key, day, slot, notes, recipe snapshot)
- [x] 4.2 Implement planner server actions (create/get week, upsert entry, delete entry, copy previous week)
- [x] 4.3 Create `/dashboard/planner` page with week navigation and breakfast/lunch/dinner slots
- [x] 4.4 Build recipe picker flow for assigning existing recipes to slots
- [x] 4.5 Support manual replace/remove/repeat/notes editing
- [x] 4.6 Add tests for planner slot constraints and week persistence

## 5. Groq-Powered AI Meal Plan Generator

- [x] 5.1 Add Groq server adapter and environment variable configuration
- [x] 5.2 Define request/response schemas and server-side validation for structured AI plan outputs
- [x] 5.3 Implement `generateMealPlanWithAI` and `regenerateMealSlotWithAI` server actions
- [x] 5.4 Ground AI generation with household profile + pantry + recipe catalog and enforce known-recipe mapping
- [x] 5.5 Log AI generation metadata/errors in `AiGenerationRun`
- [x] 5.6 Add planner UI actions and fallback error states/retry UX
- [x] 5.7 Add tests for invalid JSON, unknown recipes, and provider failure fallback

## 6. Pantry-Aware Grocery List Generator

- [x] 6.1 Add shopping list/list item models and validation
- [x] 6.2 Implement ingredient aggregation + normalization + deduplication pipeline from meal plan recipes
- [x] 6.3 Implement pantry subtraction with configurable strictness and alias support
- [x] 6.4 Implement shopping list server actions (generate, toggle, update, merge regeneration)
- [x] 6.5 Create `/dashboard/shopping` page with grouped list UI and check-off state
- [x] 6.6 Add planner shortcut action to generate list from current week plan
- [x] 6.7 Add tests for deduplication, pantry subtraction, and regeneration merge behavior

## 7. Dashboard & UX Integration

- [x] 7.1 Add dashboard navigation/status widgets for Household, Pantry, Planner, and Shopping modules
- [x] 7.2 Add optional recipe page/homepage CTAs: "Add to Planner" and pantry-aware indicators for logged-in users
- [x] 7.3 Ensure responsive behavior and keyboard accessibility across new pages
- [x] 7.4 Add loading/empty/error states for all new workflows

## 8. Verification & Competition Readiness

- [x] 8.1 Add/enable unit and integration testing tooling (e.g., Vitest)
- [x] 8.2 Add end-to-end tests for full workflow (preferences -> pantry -> planner -> AI -> shopping)
- [x] 8.3 Verify manual planner/shopping flows work when Groq is unavailable
- [x] 8.4 Validate no production-path writes rely on `data/users.json`
- [x] 8.5 Run production build and sanity-check all new dashboard routes
