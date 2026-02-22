## ADDED Requirements

### Requirement: Homepage displays recipe grid
The `/` route SHALL render a responsive grid of RecipeCard components, one per recipe in the dataset, visible without authentication.

#### Scenario: All recipes shown by default
- **WHEN** a user visits `/`
- **THEN** all ≥10 recipe cards are displayed in a responsive grid (1 col mobile, 2 col tablet, 3–4 col desktop)

### Requirement: Hero section on homepage
The homepage SHALL display a hero section at the top with a headline, subheadline, and a call-to-action linking to the `/ai` page.

#### Scenario: Hero is visible above the fold
- **WHEN** a user visits `/`
- **THEN** the hero headline, subheadline, and CTA button are visible without scrolling on desktop

### Requirement: Full-text search
The homepage SHALL provide a search input that filters the displayed recipe grid in real-time (or on submit) by recipe title, description, and tags.

#### Scenario: Search filters recipes
- **WHEN** a user types "pasta" in the search input
- **THEN** only recipes whose title, description, or tags contain "pasta" (case-insensitive) are shown

#### Scenario: No results message
- **WHEN** a user types a query that matches no recipes
- **THEN** an EmptyState component is displayed with a clear "No recipes found" message

### Requirement: Tag filter
The homepage SHALL provide a clickable tag filter list. Selecting a tag filters the grid to only show recipes with that tag.

#### Scenario: Tag filter applies
- **WHEN** a user clicks the "vegetarian" tag
- **THEN** only recipes tagged "vegetarian" are displayed

#### Scenario: Tag filter can be cleared
- **WHEN** a user clicks a selected tag again or clicks "All"
- **THEN** the filter is removed and all recipes are shown

### Requirement: Time and calorie range filter
The homepage SHALL provide filter controls for maximum prep+cook time (e.g., ≤30 min, ≤60 min) and calorie range (e.g., <400, <600, <800 kcal).

#### Scenario: Time filter applies
- **WHEN** a user selects "≤30 min"
- **THEN** only recipes with `totalTimeMinutes ≤ 30` are shown

#### Scenario: Calorie filter applies
- **WHEN** a user selects "<400 kcal"
- **THEN** only recipes with `caloriesPerServing < 400` are shown

### Requirement: Sort options
The homepage SHALL provide sort options: default (featured), alphabetical (A–Z), quickest first (lowest `totalTimeMinutes`), lowest calories.

#### Scenario: Sort by quickest
- **WHEN** a user selects "Quickest First"
- **THEN** the recipe grid is sorted ascending by `totalTimeMinutes`

### Requirement: Skeleton loading states
While recipe data loads on the client (if any async operation occurs), the homepage SHALL display SkeletonCard placeholders in the grid.

#### Scenario: Skeleton shown during load
- **WHEN** the recipe grid is loading
- **THEN** skeleton placeholder cards matching the RecipeCard dimensions are displayed

### Requirement: Responsive and accessible layout
The recipe grid SHALL be mobile-first, fluid, and keyboard-navigable. Each RecipeCard SHALL have an accessible name and be reachable via Tab key.

#### Scenario: Cards are keyboard accessible
- **WHEN** a user navigates via Tab
- **THEN** each RecipeCard link receives visible focus and can be activated with Enter
