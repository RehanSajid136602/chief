## ADDED Requirements

### Requirement: Generate grocery list from weekly meal plan
Authenticated users SHALL be able to generate a grocery list from a selected weekly meal plan.

#### Scenario: Grocery list generated from planned meals
- **WHEN** a user generates a list from a week with planned recipes
- **THEN** the system creates a grocery list containing aggregated ingredients required by those meals

#### Scenario: Empty planner week produces empty-state
- **WHEN** a user generates a list from a week with no planned meals
- **THEN** the system shows a clear empty-state and does not create a misleading non-empty list

### Requirement: Pantry-aware subtraction and deduplication
The generated grocery list SHALL normalize and deduplicate ingredients across planned meals and subtract pantry-covered items according to configured strictness.

#### Scenario: Duplicate ingredients merged
- **WHEN** multiple planned recipes require the same normalized ingredient
- **THEN** the grocery list merges them into a single grouped shopping item when quantity/unit reconciliation is possible

#### Scenario: Pantry-covered item excluded
- **WHEN** a required ingredient is sufficiently available in the pantry
- **THEN** that ingredient is excluded or marked covered in the generated grocery list according to user settings

### Requirement: Editable, checkable grocery list
Users SHALL be able to manually edit generated grocery list items and toggle purchased/checked state.

#### Scenario: Toggle purchased state
- **WHEN** a user checks a grocery item
- **THEN** the item persists in a checked state across page reloads

#### Scenario: Manual item edit persists
- **WHEN** a user edits an item name, quantity, or note
- **THEN** the list stores the manual changes and displays them on subsequent visits

### Requirement: Regeneration preserves manual additions
Regenerating a grocery list from the same weekly plan SHALL preserve user-added manual items and explicit manual edits where supported.

#### Scenario: Manual additions preserved on regeneration
- **WHEN** a user regenerates a list after manually adding extra items
- **THEN** manually added items remain in the list after regeneration
