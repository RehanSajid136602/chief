## ADDED Requirements

### Requirement: AI generator page is auth-protected
The `/ai` route SHALL require authentication. Unauthenticated users SHALL be redirected to `/auth/login?callbackUrl=/ai`.

#### Scenario: Unauthenticated access redirects to login
- **WHEN** an unauthenticated user navigates to `/ai`
- **THEN** they are redirected to `/auth/login?callbackUrl=/ai`

#### Scenario: Authenticated user accesses AI page
- **WHEN** an authenticated user navigates to `/ai`
- **THEN** the AI generator interface is displayed

### Requirement: Ingredient chip input
The `/ai` page SHALL provide a chip-style input where users can type an ingredient, press Enter or comma, and add it as a removable chip. A minimum of 1 chip is required before matching can run.

#### Scenario: Adding an ingredient chip
- **WHEN** a user types "garlic" and presses Enter
- **THEN** "garlic" appears as a removable chip in the input area and the text field is cleared

#### Scenario: Removing a chip
- **WHEN** a user clicks the × on a chip
- **THEN** that ingredient is removed from the list

#### Scenario: Submit with no ingredients is disabled
- **WHEN** the ingredient list is empty
- **THEN** the "Find Recipes" button is disabled and non-interactive

### Requirement: Deterministic ingredient matching
The system SHALL expose a `matchRecipes(userIngredients: string[]): MatchResult[]` function in `lib/recipes.ts` that:
1. Normalizes all strings (lowercase, trim, strip leading quantities/units, basic plural stripping).
2. Computes per-recipe `matchPercent = (matchingIngredientCount / recipe.ingredients.length) * 100`, rounded to nearest integer.
3. Computes `missingIngredients` as the set difference (recipe ingredients not in user ingredients).
4. Returns all recipes sorted descending by `matchPercent`, filtered to `matchPercent > 0`.

#### Scenario: Perfect ingredient match
- **WHEN** user provides all ingredients for a recipe
- **THEN** that recipe appears with `matchPercent === 100` and `missingIngredients` is empty

#### Scenario: Partial ingredient match
- **WHEN** user provides 3 out of 5 recipe ingredients
- **THEN** that recipe appears with `matchPercent === 60` and `missingIngredients` contains the 2 unmatched ingredients

#### Scenario: Zero overlap excluded
- **WHEN** no user ingredient matches any ingredient in a recipe
- **THEN** that recipe does NOT appear in the results

#### Scenario: Normalization handles case and plurals
- **WHEN** user enters "Eggs" and recipe has "egg"
- **THEN** the ingredient is considered a match

### Requirement: Match result display
The `/ai` page SHALL display matched recipes as RecipeCards showing: recipe title, match percentage badge, list of missing ingredients. Cards SHALL be sorted by match percentage, highest first.

#### Scenario: Results show match percentage
- **WHEN** matching results are returned
- **THEN** each result card displays a badge like "80% match"

#### Scenario: Missing ingredients are listed
- **WHEN** a recipe has unmatched ingredients
- **THEN** those ingredients are listed below the card labeled "Missing: …"

#### Scenario: No matches found
- **WHEN** the user's ingredients match no recipes
- **THEN** an EmptyState is shown with the message "No recipes found with those ingredients. Try adding more."

### Requirement: Loading state during matching
While the matching function is executing (even synchronously after a submit action), the UI SHALL show a loading indicator.

#### Scenario: Loading indicator shown
- **WHEN** the user submits ingredients
- **THEN** a loading spinner or skeleton state is briefly shown before results appear
