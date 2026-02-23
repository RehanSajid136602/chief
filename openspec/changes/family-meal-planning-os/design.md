## Context

RecipeHub is a Next.js 14 App Router application with static recipe data in `src/data/recipes.json`, NextAuth v5 authentication, and file-based user persistence in `src/lib/users.ts`. The competition goal is to demonstrate a complete family meal workflow, not a demo-only AI feature.

This change introduces a production-like persistence layer and five end-user features:
1. Household Profile & Preferences
2. Pantry Manager
3. Weekly Meal Planner (manual-first)
4. Groq-powered AI Meal Plan Generator
5. Pantry-aware Grocery List Generator

## Goals / Non-Goals

**Goals**
- Deliver a fully functional family workflow: preferences -> pantry -> weekly plan -> grocery list -> cooking prep.
- Preserve existing auth UX (NextAuth login/signup and protected routes).
- Add AI planning that is grounded in real app data and fails gracefully.
- Keep the static recipe catalog for v1 to minimize scope and maximize delivery speed.
- Support a 3-4 week implementation window with incremental milestones.

**Non-Goals**
- Replacing NextAuth with Firebase/Auth provider migration.
- User-generated recipes or recipe scraping/import.
- Multi-user real-time collaboration in the same household.
- Advanced nutrition optimization or medical diet compliance guarantees.

## Decisions

### D1: Postgres + Prisma for all user-generated state
**Decision**: Introduce Postgres + Prisma and migrate file-backed user/profile/favorites persistence to Prisma-backed storage.  
**Rationale**: Supports reliable multi-user hosted usage and relational data for household, pantry, planner, and shopping list features.  
**Alternative considered**: Continue JSON files — rejected due to reliability and scalability risks.

### D2: Keep NextAuth v5 as the auth layer
**Decision**: Preserve the current NextAuth v5 login and middleware flow and link application data by authenticated user identity (email / internal user record).  
**Rationale**: Minimizes migration risk while enabling the new data model.  
**Alternative considered**: Auth migration (e.g., Firebase Auth/Supabase Auth) — rejected due to competition timeline.

### D3: Manual-first planner, AI-accelerated second
**Decision**: The weekly planner is fully usable without AI. AI generation and slot regeneration enhance, but do not gate, planning.  
**Rationale**: Ensures the core workflow remains functional when Groq is unavailable or constrained.  
**Alternative considered**: AI-first planner — rejected because it increases failure risk and weakens reliability.

### D4: Groq as single provider with structured server-side validation
**Decision**: Integrate Groq behind a server-side adapter and require structured JSON responses validated before persistence.  
**Rationale**: Keeps provider integration simple and makes outputs auditable and safe for planner insertion.  
**Alternative considered**: Provider abstraction at v1 — rejected as extra engineering without competition payoff.

### D5: Static recipe catalog remains source-of-truth in v1
**Decision**: Continue using `src/data/recipes.json` for recipe metadata referenced by the planner and shopping list generator.  
**Rationale**: Keeps scope focused on workflow features and avoids recipe ingestion complexity.  
**Trade-off**: Planner AI must map outputs to existing recipes only; unknown recipes are rejected.

### D6: Snapshot recipe fields inside meal plan entries
**Decision**: Store minimal recipe snapshot fields (title, slug, timing, calories) on each meal plan entry in addition to the recipe slug reference.  
**Rationale**: Preserves plan readability if recipe metadata changes later.  
**Alternative considered**: Reference-only storage — rejected due to fragility.

## Architecture & Data Flow

### Runtime architecture
- Next.js App Router pages and Server Actions remain the primary interface
- Prisma handles persistent data access
- Groq requests execute server-side only
- Static recipe catalog is read from JSON and joined in application logic

### Core flow: AI-generated weekly plan
1. User opens planner and requests generation
2. Server loads household profile, pantry items, and recipe catalog
3. Server constructs Groq prompt + schema instructions
4. Groq returns structured plan suggestions
5. Server validates schema, maps suggestions to known recipes, rejects unknowns
6. Server persists meal plan entries
7. Planner UI revalidates and renders generated plan + rationale

### Core flow: Grocery list generation
1. User requests shopping list from current week plan
2. Server collects planned recipes and expands ingredients
3. Server normalizes + deduplicates ingredient names
4. Server subtracts pantry inventory (configurable strictness)
5. Server groups items by category/aisle and persists list
6. User checks off or edits items; regeneration preserves manual additions

## Data Model (Conceptual)

- `User`
- `FavoriteRecipe`
- `Household`
- `HouseholdPreference`
- `PantryItem`
- `MealPlanWeek`
- `MealPlanEntry`
- `ShoppingList`
- `ShoppingListItem`
- `AiGenerationRun`

## Risks / Trade-offs

- **Ingredient normalization ambiguity** (e.g., scallion vs green onion) may reduce pantry subtraction accuracy; mitigate with alias mapping table.
- **AI output quality** can vary; mitigate with strict schema validation, recipe-catalog grounding, and manual fallback.
- **Catalog size limits** may constrain AI plan variety; acceptable for competition v1.
- **Migration complexity** from file-based users to Prisma can affect favorites/profile; mitigate by preserving helper function contracts where possible.

## Rollout Strategy

- Phase 1: Prisma/Postgres foundation + user/favorites migration
- Phase 2: Household + Pantry
- Phase 3: Manual Planner
- Phase 4: AI Planner + Grocery List
- Phase 5: Test hardening and competition readiness validation
