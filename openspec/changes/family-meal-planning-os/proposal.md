## Why

RecipeHub currently delivers recipe discovery, recipe detail pages, favorites, authentication, and an auth-gated ingredient matcher. For a competition-ready product, the next step is to prove a **complete, practical family meal workflow**: plan meals, manage pantry inventory, generate shopping lists, and use AI to accelerate planning with real constraints.

The current file-based user storage (`data/users.json`) is also not suitable for production-like multi-user competition deployment. A stronger persistence layer is required to support household, pantry, planner, and shopping data reliably.

This proposal upgrades RecipeHub from a recipe browser into a **family meal planning operating system**.

## What Changes

- **New**: Household Profile & Preferences module for dietary restrictions, dislikes, schedule constraints, and planning defaults.
- **New**: Pantry Manager with quantity/unit tracking, optional expiry dates, low-stock indicators, and pantry-aware ingredient matching.
- **New**: Weekly Meal Planner with breakfast/lunch/dinner slots, week navigation, recipe assignment, and manual editing.
- **New**: Groq-powered Smart Meal Plan Generator that produces structured weekly plans grounded in household preferences + pantry + recipe catalog.
- **New**: Pantry-aware Grocery List Generator with ingredient aggregation, deduplication, category grouping, check-off state, and manual overrides.
- **Modified**: User persistence layer migrates from file-based JSON to Postgres + Prisma while preserving current NextAuth flows and favorite/profile behaviors.
- **Modified**: Dashboard gains navigation and status widgets for Household, Pantry, Planner, and Shopping modules.

## Capabilities

### New Capabilities

- `household-profile`: Authenticated users can configure household planning preferences (dietary restrictions, dislikes, budget/time constraints, leftovers preference).
- `pantry-manager`: Authenticated users can create, edit, delete, and review pantry items with quantities, units, categories, and expiry dates.
- `meal-planner`: Authenticated users can create and edit a weekly meal plan with breakfast/lunch/dinner slots using existing recipes.
- `ai-meal-planner`: Authenticated users can request a structured meal plan from Groq using household preferences, pantry inventory, and recipe catalog constraints.
- `shopping-list-generation`: Authenticated users can generate and manage a pantry-aware grocery list from a weekly meal plan.

### Modified Capabilities

- `user-auth`: Authenticated user profile/favorites persistence is backed by Postgres + Prisma instead of local JSON file storage, without changing the user-facing auth flows.
- `ai-ingredient-matcher`: Matching results become pantry-aware for authenticated users (optional indicators and reuse of ingredient normalization).
- `recipe-discovery`: Homepage/dashboard surfaces planner/pantry/shopping entry points and optionally shows pantry match indicators for logged-in users.

## Impact

- **Data layer**: Introduces Postgres + Prisma for users, favorites, household, pantry, meal plans, shopping lists, and AI generation audits.
- **Auth**: Keeps NextAuth v5 login/signup flows and middleware protection; no Firebase migration.
- **AI provider**: Adds Groq as the single AI provider for structured planning generation.
- **UI routes**: Adds `/dashboard/household`, `/dashboard/pantry`, `/dashboard/planner`, and `/dashboard/shopping`.
- **Reliability**: Manual planner and grocery workflows remain functional if Groq is unavailable.
- **Testing**: Requires unit, integration, and end-to-end test coverage for the planning workflow before competition submission.

## Non-Goals (This Change)

- Multi-household collaboration
- Real-time collaborative planning
- Recipe URL import/scraping
- Nutrition/macro optimization engine
- Grocery store marketplace/cart integrations
- Offline mode
