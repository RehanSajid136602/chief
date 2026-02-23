## ADDED Requirements

### Requirement: Household profile management
Authenticated users SHALL be able to create and update a household profile that stores meal-planning preferences and constraints.

#### Scenario: User saves household profile
- **WHEN** an authenticated user submits valid household preferences (e.g., household size, dislikes, schedule constraints)
- **THEN** the profile is persisted and available on subsequent visits

#### Scenario: Unauthenticated access is blocked
- **WHEN** an unauthenticated user navigates to the household profile page
- **THEN** they are redirected to the login page according to dashboard route protection rules

### Requirement: Household planning preferences are structured
The household profile SHALL support structured planning inputs including dietary restrictions, allergies/intolerances, disliked ingredients, time limits, and leftovers preference.

#### Scenario: Dietary and allergy preferences saved
- **WHEN** a user configures dietary restrictions and allergies
- **THEN** those values are stored in structured fields and retrievable for planner and AI generation

#### Scenario: Invalid preference payload rejected
- **WHEN** a user submits malformed or unsupported preference values
- **THEN** validation fails and no partial profile update is persisted

### Requirement: Household profile defaults support planner initialization
The system SHALL use household profile values as defaults for planner and AI planning forms when available.

#### Scenario: Planner uses household defaults
- **WHEN** a household profile exists and the user opens the planner
- **THEN** planner generation defaults (e.g., meal count or time limits) are pre-populated from the household profile
