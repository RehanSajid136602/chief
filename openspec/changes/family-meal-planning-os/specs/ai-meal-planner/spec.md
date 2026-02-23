## ADDED Requirements

### Requirement: AI meal plan generation is authenticated and planner-integrated
Authenticated users SHALL be able to generate a weekly meal plan from the planner using household preferences, pantry data, and the recipe catalog.

#### Scenario: Generate weekly plan from planner
- **WHEN** an authenticated user requests AI plan generation with valid inputs
- **THEN** the system generates planner entries and displays them in the weekly planner

#### Scenario: Unauthenticated generation is blocked
- **WHEN** an unauthenticated user attempts to access AI planning functionality
- **THEN** access is denied via dashboard route protection and no generation request is executed

### Requirement: AI output is structured and validated server-side
The system SHALL require structured AI output and validate it on the server before persisting any generated plan data.

#### Scenario: Invalid AI JSON rejected
- **WHEN** the AI provider returns malformed or schema-invalid output
- **THEN** the system rejects the response, logs the failure, and returns a recoverable error to the user

#### Scenario: Unknown recipe suggestions rejected
- **WHEN** the AI provider suggests recipes not present in the current catalog
- **THEN** those suggestions are rejected or remapped before planner persistence, and the user is notified if generation is incomplete

### Requirement: AI generation has manual fallback
The planner SHALL remain fully usable for manual planning when AI generation fails or is unavailable.

#### Scenario: Provider timeout does not block planner use
- **WHEN** AI generation fails due to timeout or provider outage
- **THEN** the planner remains editable and the user can continue planning manually

### Requirement: Single-slot regeneration
The planner SHALL support AI regeneration of an individual day or meal slot without replacing the entire weekly plan.

#### Scenario: Regenerate one meal slot
- **WHEN** a user requests regeneration for a single slot
- **THEN** only that target slot is updated while the rest of the weekly plan remains unchanged
