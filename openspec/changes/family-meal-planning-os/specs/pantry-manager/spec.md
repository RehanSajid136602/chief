## ADDED Requirements

### Requirement: Pantry item CRUD
Authenticated users SHALL be able to add, edit, list, and delete pantry items with quantity and unit information.

#### Scenario: Add pantry item
- **WHEN** a user submits a pantry item with a valid ingredient name and quantity/unit
- **THEN** the pantry item is stored and appears in the pantry list

#### Scenario: Edit pantry item
- **WHEN** a user updates quantity, unit, or category of an existing pantry item
- **THEN** the pantry list reflects the updated values

#### Scenario: Delete pantry item
- **WHEN** a user deletes a pantry item
- **THEN** the item is removed from the pantry list and no longer used for planning/shopping calculations

### Requirement: Pantry expiry and stock status indicators
The pantry SHALL support optional expiry dates and computed status indicators such as in-stock, low-stock, and expired.

#### Scenario: Expired item flagged
- **WHEN** a pantry item has an expiry date earlier than the current date
- **THEN** the item is marked as expired in the pantry UI

#### Scenario: Low-stock item flagged
- **WHEN** a pantry item falls below a configured or default low-stock threshold
- **THEN** the item is marked as low stock

### Requirement: Pantry-aware recipe matching support
The system SHALL expose pantry-normalized ingredient data for reuse by recipe matching, planner generation, and grocery list subtraction.

#### Scenario: Pantry items normalized for matching
- **WHEN** pantry items are loaded for planning/matching
- **THEN** ingredient names are normalized using the shared normalization logic before comparison

#### Scenario: Bulk add pantry items from text
- **WHEN** a user submits a free-text list of pantry items
- **THEN** parsable items are added to the pantry and invalid lines are reported without failing all additions
