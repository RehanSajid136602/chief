## ADDED Requirements

### Requirement: Recipe dataset file exists
The system SHALL provide a `data/recipes.json` file at the project root containing an array of at least 10 recipe objects conforming to the defined schema.

#### Scenario: Dataset is present and valid
- **WHEN** the application builds
- **THEN** `data/recipes.json` exists, is valid JSON, and contains ≥10 recipe objects

### Requirement: Recipe schema completeness
Each recipe object in `data/recipes.json` SHALL include all of the following fields: `slug` (string, URL-safe), `title` (string), `description` (string), `tags` (non-empty string array), `servings` (positive integer), `prepTimeMinutes` (positive integer), `cookTimeMinutes` (positive integer), `totalTimeMinutes` (positive integer equal to prep + cook), `caloriesPerServing` (positive integer, realistic 100–1500 range), `ingredients` (non-empty string array), `steps` (non-empty string array), `images` (array of exactly 3 strings), `youtubeVideoUrl` (string), `sourceUrl` (string).

#### Scenario: Recipe has all required fields
- **WHEN** a recipe object is read from `data/recipes.json`
- **THEN** every required field is present and non-null

#### Scenario: Images array has exactly 3 entries
- **WHEN** a recipe object is inspected
- **THEN** `images.length === 3`

### Requirement: All recipe image URLs are direct image links
Each URL in a recipe's `images` array SHALL be a direct link to an image file (returns HTTP 200 with `Content-Type: image/*`) and SHALL NOT be an HTML page URL.

#### Scenario: Image URLs resolve to image content
- **WHEN** any `images[n]` URL is fetched
- **THEN** the HTTP response status is 200 and Content-Type begins with `image/`

### Requirement: All recipe YouTube URLs are valid
Each recipe's `youtubeVideoUrl` SHALL be a valid YouTube watch URL (`https://www.youtube.com/watch?v=<id>`) pointing to a real, publicly accessible video relevant to the recipe.

#### Scenario: YouTube URL is reachable
- **WHEN** the `youtubeVideoUrl` is accessed
- **THEN** the video exists and is publicly viewable on YouTube

### Requirement: Calorie and time values are realistic
`caloriesPerServing` SHALL be between 100 and 1500 (inclusive). `totalTimeMinutes` SHALL equal `prepTimeMinutes + cookTimeMinutes`.

#### Scenario: Calorie value is in realistic range
- **WHEN** a recipe is read
- **THEN** `100 ≤ caloriesPerServing ≤ 1500`

#### Scenario: Total time is consistent
- **WHEN** a recipe is read
- **THEN** `totalTimeMinutes === prepTimeMinutes + cookTimeMinutes`

### Requirement: Recipe slugs are unique and URL-safe
Each recipe `slug` SHALL be unique within the dataset and SHALL contain only lowercase letters, digits, and hyphens.

#### Scenario: No duplicate slugs
- **WHEN** the dataset is loaded
- **THEN** all slug values are distinct

#### Scenario: Slug is URL-safe
- **WHEN** a slug is inspected
- **THEN** it matches the pattern `^[a-z0-9-]+$`
