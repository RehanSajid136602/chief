# Competition-First Plan: Top 5 Features to Turn RecipeHub into a Family Meal Planning OS

## Summary

This plan prioritizes **five fully functional, high-impact features** that transform the current app (recipe browsing + AI ingredient matcher + auth) into a **real end-to-end family meal planning product**.

### What we optimized for
- Fully working features (not demo/simulated)
- 3-4 week competition window
- Home cooks / families
- End-to-end workflow proof for judges
- `Postgres + Prisma + NextAuth` (no Firebase)
- `Groq` as the primary AI provider

### Current app constraints that drive this plan
- Users are currently stored in `data/users.json` via `src/lib/users.ts` (not production-safe for competition hosting)
- Recipes are static in `src/data/recipes.json`
- Auth is NextAuth v5 and should be kept
- Existing ingredient matching logic can be reused for pantry/planner features

## Feature Portfolio Options Considered (and Recommendation)

### Option A (Recommended): Workflow-First Family Meal OS
Focus on household preferences, pantry, planning, grocery execution, and cooking assistance.

- Best for competition scoring based on real usefulness + completeness
- Demonstrates product thinking and AI usefulness without over-relying on "chatbot wow"
- Strongest end-to-end story

### Option B: AI-First Cooking Assistant
Focus on chat, substitutions, step guidance, and conversational UX.

- High AI appeal
- Weaker "family workflow" proof
- More risk of looking like a demo if not deeply integrated into data/workflows

### Option C: Content Expansion + Social
Focus on recipe import/community/sharing

- Potentially impressive
- Higher reliability/legal/scraping risk in 3-4 weeks
- Less aligned with your stated target (fully functional family workflow)

## The First 5 Features (High Priority)

## 1. Household Profile & Family Preferences (Foundation Feature)
Create a household-level profile that stores planning constraints and family preferences.

### User value
- Planner and AI recommendations become personalized and practical
- Prevents generic meal plans

### Scope (v1)
- Household name
- Number of adults/kids
- Dietary preferences (vegetarian, halal, etc.)
- Allergies/intolerances
- Disliked ingredients
- Weekly budget target (optional)
- Max cook time on weekdays/weekends
- Preferred meal count per week
- Leftovers preference (on/off)

### UI surface
- New route: `src/app/dashboard/household/page.tsx`
- Entry point from dashboard card in `src/app/dashboard/page.tsx`

### Public interfaces / types (new)
- `Household`
- `HouseholdPreferences`
- `DietaryRestriction`
- `Allergy`
- `MealPlanningConstraints`

### API / actions (new)
- `createOrUpdateHouseholdProfile`
- `getHouseholdProfile`

---

## 2. Pantry Manager (Inventory + Expiry Tracking)
Add pantry inventory management with quantities and expiration dates.

### User value
- Makes the planner and grocery list truly useful
- Reduces waste and duplicate purchasing

### Scope (v1)
- Add/edit/delete pantry items
- Quantity + unit (e.g., 2 lb, 1 bottle)
- Optional expiry date
- Pantry categories (produce, dairy, spices, etc.)
- "Low stock" indicator
- Quick-add from ingredient chips or free text
- Pantry-aware recipe suggestions (reuse ingredient normalization logic)

### UI surface
- New route: `src/app/dashboard/pantry/page.tsx`
- Pantry summary widget on dashboard
- Optional badge in recipe cards: "You have X/Y ingredients"

### Public interfaces / types (new)
- `PantryItem`
- `PantryUnit`
- `PantryCategory`
- `PantryStatus` (`in_stock | low_stock | expired`)

### API / actions (new)
- `addPantryItem`
- `updatePantryItem`
- `deletePantryItem`
- `listPantryItems`
- `bulkAddPantryItemsFromText`

---

## 3. Weekly Meal Planner (Manual Planner + Calendar Slots)
Build a weekly planner users can manage manually (AI comes in Feature 4).

### User value
- Core "meal planning OS" behavior
- Gives judges a concrete workflow beyond recipe browsing

### Scope (v1)
- 7-day planner view
- Meal slots: breakfast / lunch / dinner (configurable later)
- Add recipe to slot from existing catalog
- Move/replace/remove planned meals
- "Repeat meal" for leftovers
- Notes per meal (e.g., "kid-friendly swap", "prep ahead")
- Week switching (current week + future week)

### UI surface
- New route: `src/app/dashboard/planner/page.tsx`
- Planner-integrated recipe picker modal using existing recipe catalog data

### Public interfaces / types (new)
- `MealPlanWeek`
- `MealPlanEntry`
- `MealSlotType`
- `PlannedRecipeSnapshot` (store recipe snapshot fields to avoid breakage if recipes change)

### API / actions (new)
- `createMealPlanWeek`
- `getMealPlanWeek`
- `upsertMealPlanEntry`
- `deleteMealPlanEntry`
- `copyPreviousWeekPlan`

---

## 4. Groq-Powered Smart Meal Plan Generator (Structured AI)
Add a real AI feature that generates a weekly plan from household preferences + pantry + recipe catalog.

### User value
- Makes planning dramatically faster
- Strong competition differentiator when it is grounded in actual user data

### Scope (v1)
- "Generate week plan" action from planner page
- Inputs:
  - household preferences
  - pantry items
  - target meals
  - max prep/cook time
  - budget sensitivity (coarse)
  - optional theme ("high protein", "comfort foods", etc.)
- Outputs:
  - structured meal plan entries (mapped to existing recipes)
  - rationale per day/meal (short)
  - pantry usage suggestions
- Regenerate single day / single meal slot
- Strict server-side validation of AI output
- Fallback if AI fails: manual planner remains fully usable

### Implementation approach (decision)
- Use `Groq` via a server-side adapter (`src/lib/ai/groq.ts`)
- Require JSON/structured output schema
- Post-process AI output to map only to valid recipe IDs/slugs
- Reject hallucinated recipes unless explicitly supported later

### Public interfaces / types (new)
- `AiMealPlanRequest`
- `AiMealPlanResponse`
- `AiMealPlanSuggestion`
- `AiGenerationAudit` (request metadata, model, timing, status)

### API / actions (new)
- `generateMealPlanWithAI`
- `regenerateMealSlotWithAI`

### Failure modes handled
- Groq timeout / rate limit
- Invalid JSON
- AI suggests unknown recipes
- Conflicting constraints (e.g., allergy + tiny catalog)
- Empty pantry / missing household profile

---

## 5. Pantry-Aware Grocery List Generator (Deduped, Actionable, Check-off)
Generate an actual grocery list from the weekly plan, subtracting pantry stock and grouping items.

### User value
- Completes the family workflow from planning to execution
- One of the strongest "real product" signals for judges

### Scope (v1)
- Generate grocery list from current week meal plan
- Aggregate ingredients across planned meals
- Deduplicate similar ingredients (using normalization + alias mapping)
- Exclude pantry items already in stock (with configurable strictness)
- Group by aisle/category
- Manual add/remove/edit items
- Check-off state
- "Bought" items can update pantry quantities (optional toggle)
- Regenerate while preserving manually added items

### UI surface
- New route: `src/app/dashboard/shopping/page.tsx`
- Planner page shortcut: "Generate Grocery List"

### Public interfaces / types (new)
- `ShoppingList`
- `ShoppingListItem`
- `IngredientNormalizationAlias`
- `PantryCoverageDecision`

### API / actions (new)
- `generateShoppingListFromMealPlan`
- `toggleShoppingListItem`
- `updateShoppingListItem`
- `mergeShoppingListRegeneration`

## Required Non-Feature Foundation Work (P0, must happen before or alongside Feature 1)

This is not counted as one of the five features, but it is required for a production-like competition build.

### P0. Move user/app data persistence to Postgres + Prisma
Current file-based storage (`src/lib/users.ts`) is not suitable for multi-user hosted competition usage.

### Decisions
- Keep `NextAuth` UI/flow
- Replace file-based user persistence with Prisma-backed user records
- Store new feature data in Postgres
- Keep static recipe catalog in `src/data/recipes.json` for v1 (fastest path)

### Migration strategy
- Phase 1: Add Prisma + Postgres schema for feature data and app user profile linkage by email
- Phase 2: Replace `src/lib/users.ts` calls used by favorites/profile with Prisma implementations (preserve function signatures where possible)
- Phase 3: Backfill/migrate existing `data/users.json` (one-time script)

## Architecture & Data Flow (Decision Complete)

## Backend stack
- Next.js App Router + Server Actions
- NextAuth v5 (kept)
- Postgres + Prisma
- Groq API (single AI provider)
- Static recipe catalog remains in JSON for v1 planning source

## Data ownership
- `recipes`: static dataset (`src/data/recipes.json`) for v1
- `users + favorites + profile + household + pantry + meal plans + shopping`: Postgres
- `ai generation logs/audits`: Postgres (minimal metadata, no sensitive prompt dumps by default)

## API design style
- Prefer Server Actions for authenticated mutations
- Use route handlers only when needed for async/background-style requests or external callbacks
- Validate all AI input/output with schemas
- Revalidate relevant pages after mutations (`/dashboard`, `/dashboard/pantry`, `/dashboard/planner`, `/dashboard/shopping`, `/`)

## Core new data model (Prisma-level, conceptual)
- `User` (email, name, auth linkage)
- `FavoriteRecipe`
- `Household`
- `HouseholdMember` (optional v1-lite)
- `HouseholdPreference`
- `PantryItem`
- `MealPlanWeek`
- `MealPlanEntry`
- `ShoppingList`
- `ShoppingListItem`
- `AiGenerationRun`

## Route / UX Additions (Decision Complete)

### New primary routes
- `/dashboard/household`
- `/dashboard/pantry`
- `/dashboard/planner`
- `/dashboard/shopping`

### Dashboard upgrades
- Add navigation cards/widgets for:
  - Household setup completion
  - Pantry item count / low-stock count
  - Current week meal plan progress
  - Latest shopping list status

### Existing page enhancements
- `src/app/page.tsx`:
  - optional "pantry match" indicators if user is logged in
- `src/app/recipes/[slug]/page.tsx`:
  - add "Add ingredients to pantry" and/or "Add recipe to planner" CTA (v1 optional, but recommended)
- `src/components/recipe/FavoriteButton.tsx`:
  - no major change, but ensure Prisma-backed persistence after P0 migration

## Implementation Sequencing (3-4 Week Plan)

## Week 1: Foundation + Household
- P0 data migration foundation (`Postgres + Prisma`)
- Replace file-based user persistence for favorites/profile
- Build Household Profile feature end-to-end
- Add dashboard navigation for new modules

## Week 2: Pantry Manager
- Pantry CRUD
- Pantry UI + quick-add
- Expiry/low-stock logic
- Pantry-aware matching hooks (reusing normalization from `src/lib/recipes.ts`)

## Week 3: Weekly Meal Planner
- Planner data model + week navigation
- Manual planning UI and recipe picker
- Plan persistence and edits
- Basic list generation stub (non-AI)

## Week 4: AI Planner + Grocery List Finalization
- Groq integration with structured outputs and validation
- AI generate/regenerate flows
- Grocery aggregation/dedup/pantry subtraction
- Shopping UI check-off and regeneration merge
- Polish + E2E test pass + judging script prep

## Key Public API / Interface Changes (Explicit)

## Existing modules to refactor
- `src/lib/users.ts`
  - move implementation to Prisma backend while preserving public helpers (`findUserByEmail`, `updateUser`, etc.) where practical
- `src/app/actions/user.ts`
  - continue for profile/favorites, but route to Prisma instead of JSON file

## New modules (planned)
- `src/lib/db/prisma.ts`
- `src/lib/ai/groq.ts`
- `src/lib/ai/schemas.ts`
- `src/lib/planner/*`
- `src/lib/pantry/*`
- `src/lib/shopping/*`
- `src/app/actions/pantry.ts`
- `src/app/actions/planner.ts`
- `src/app/actions/shopping.ts`
- `src/app/actions/ai-planner.ts`

## New shared types (planned)
- `src/lib/types/planner.ts`
- `src/lib/types/pantry.ts`
- `src/lib/types/shopping.ts`
- `src/lib/types/household.ts`

## Edge Cases & Failure Modes (Must Be Handled)

## Auth / user state
- User logged in but no household profile exists
- Legacy JSON user exists but Prisma user record not yet backfilled
- Session email missing/changed

## Pantry / ingredients
- Duplicate pantry items with different units
- Expired items accidentally included in grocery subtraction
- Ingredient name mismatch ("scallion" vs "green onion")

## Planner
- Recipe removed/changed after plan creation (use snapshot fields)
- Week plan partially complete
- Over-constrained plan request (too many preferences for limited catalog)

## AI / Groq
- Timeout / 429 / provider outage
- Invalid structure / unknown recipe IDs
- Non-deterministic outputs causing poor repeatability (log generation metadata)
- Unsafe/unhelpful output (apply server-side constraints and filtering)

## Grocery lists
- Manual edits lost during regeneration (must preserve user-added items)
- Ambiguous quantity merges ("1 can" + "2 cups tomatoes")
- Pantry subtraction too aggressive (toggle behavior)

## Testing & Acceptance Criteria

## Test strategy additions (recommended)
- Add `Vitest` for unit/integration tests
- Add `Playwright` for end-to-end competition workflow tests

## Unit tests
- Ingredient normalization / aliasing
- Grocery list aggregation + dedup rules
- Pantry subtraction logic
- Planner slot validation
- AI response schema validation and mapping

## Integration tests
- Server actions with authenticated session
- Prisma CRUD for household/pantry/planner/shopping
- AI generation fallback behavior on provider errors

## E2E scenarios (competition-critical)
1. New user logs in, sets household preferences, saves successfully
2. User adds pantry items with quantities and expiry dates
3. User manually plans a week from recipe catalog
4. User generates AI meal plan that respects constraints
5. User generates grocery list and sees pantry-aware exclusions
6. User checks off purchased items and updates pantry
7. User returns later and sees persisted data across all modules

## Acceptance criteria for "competition ready"
- All 5 features work with real persistence (no mock data)
- Planner and shopping flows function even if Groq is unavailable
- No writes to local JSON for user-critical data in production path
- Core E2E workflow passes on deployed environment

## Rollout / Demo-Readiness (without being demo-only)

## Release gating
- Feature-complete only when end-to-end workflow is stable
- AI feature does not block manual planner and grocery features

## Observability (lightweight, competition-appropriate)
- Server logs for action failures and AI provider failures
- AI run metadata table (status, latency, model, error code)
- Basic user-facing error states with retry options

## Explicit Assumptions & Defaults Chosen

- `US` locale and grocery conventions for v1
- Single household per account in v1
- Recipe source remains the existing static dataset in `src/data/recipes.json` for first release
- Groq is the only AI provider in v1 (no provider abstraction beyond a thin adapter)
- AI-generated plans may only reference known recipes (no hallucinated recipes)
- Week planner supports `breakfast/lunch/dinner` in v1 (snacks optional later)
- Mobile responsive support is required; offline mode is out of scope for first 5 features
- Social/community sharing, recipe import-from-URL, and payments are out of scope for this first milestone

## Out of Scope (for this first 5-feature milestone)
- Firebase migration
- Multi-household collaboration
- Real-time multi-user sync
- Recipe scraping/import pipeline
- Nutrition/macro optimization engine
- Voice assistant
- Marketplace/cart integration with grocery stores
