## ADDED Requirements

### Requirement: Weekly meal planner
Authenticated users SHALL be able to create and manage a weekly meal plan organized by day and meal slot.

#### Scenario: Create and view current week plan
- **WHEN** a user opens the planner for the first time in a week
- **THEN** the system creates or loads a plan for that week and displays day/slot sections

#### Scenario: Navigate between weeks
- **WHEN** a user selects a different week
- **THEN** the planner loads the corresponding weekly plan without overwriting another week

### Requirement: Recipe assignment to meal slots
The planner SHALL allow users to assign existing catalog recipes to breakfast, lunch, or dinner slots and persist those assignments.

#### Scenario: Add recipe to slot
- **WHEN** a user chooses a recipe for a specific day and meal slot
- **THEN** the planner stores the recipe assignment and displays it in that slot

#### Scenario: Replace or remove slot recipe
- **WHEN** a user replaces or removes a planned recipe from a slot
- **THEN** the planner persists the change and updates the visible schedule

### Requirement: Planner notes and repeat behavior
The planner SHALL support per-slot notes and an explicit repeat/leftovers workflow for faster scheduling.

#### Scenario: Add note to planned meal
- **WHEN** a user saves a note on a planned meal slot
- **THEN** the note is persisted and shown when revisiting the slot

#### Scenario: Repeat previous meal as leftovers
- **WHEN** a user selects a repeat/leftovers action for a slot
- **THEN** the selected recipe is copied into the target slot with a repeat marker or equivalent persisted indicator

### Requirement: Snapshot recipe metadata in planner entries
Planner entries SHALL persist minimal recipe snapshot metadata in addition to recipe identifiers to preserve plan readability over time.

#### Scenario: Recipe title changes after planning
- **WHEN** the underlying recipe title changes after a meal plan was created
- **THEN** the planner still renders the saved planned entry using stored snapshot metadata
