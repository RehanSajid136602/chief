## ADDED Requirements

### Requirement: Recipe detail page exists for every recipe
The system SHALL render a dynamic route `/recipes/[slug]` for each recipe slug in the dataset, statically generated at build time.

#### Scenario: Detail page loads for a valid slug
- **WHEN** a user navigates to `/recipes/spaghetti-carbonara`
- **THEN** the page renders the full recipe detail for that slug

#### Scenario: 404 for unknown slug
- **WHEN** a user navigates to `/recipes/non-existent-recipe`
- **THEN** a 404 page is returned

### Requirement: 3-image gallery
The recipe detail page SHALL display all 3 recipe images in an interactive gallery (e.g., main image + 2 thumbnails, or a carousel). All images SHALL use `next/image`.

#### Scenario: Gallery shows 3 images
- **WHEN** a recipe detail page is displayed
- **THEN** exactly 3 images are shown, loaded via `next/image`

#### Scenario: Thumbnail click changes active image
- **WHEN** a user clicks a thumbnail image
- **THEN** it becomes the main displayed image in the gallery

### Requirement: YouTube video embed
The recipe detail page SHALL embed the recipe's YouTube video using the privacy-enhanced `youtube-nocookie.com` domain in a responsive `<iframe>`.

#### Scenario: Video embed is present
- **WHEN** a recipe detail page is displayed
- **THEN** an iframe embedding `youtube-nocookie.com/embed/<videoId>` is visible

#### Scenario: Video embed is responsive
- **WHEN** the page is viewed on mobile
- **THEN** the video iframe resizes proportionally and does not overflow

### Requirement: Recipe metadata display
The detail page SHALL clearly display: title, description, servings, prep time, cook time, total time, and calories per serving.

#### Scenario: Metadata is displayed
- **WHEN** a recipe detail page is shown
- **THEN** servings, prepTimeMinutes, cookTimeMinutes, totalTimeMinutes, and caloriesPerServing are all visible

### Requirement: Ingredients and steps
The detail page SHALL render the `ingredients` array as a styled list and the `steps` array as a numbered ordered list.

#### Scenario: Ingredients list
- **WHEN** the detail page renders
- **THEN** all ingredient strings appear in a readable list

#### Scenario: Steps list
- **WHEN** the detail page renders
- **THEN** all step strings appear in a numbered ordered list

### Requirement: Source link
The detail page SHALL include a visible link to the recipe's `sourceUrl`, opening in a new tab.

#### Scenario: Source link opens externally
- **WHEN** a user clicks the source link
- **THEN** the linked page opens in a new browser tab

### Requirement: SEO metadata and OG tags
Each recipe detail page SHALL export `generateMetadata` providing: `title`, `description`, Open Graph `title`, `description`, and `image` (using `images[0]`).

#### Scenario: OG metadata is present
- **WHEN** the page HTML is inspected
- **THEN** `og:title`, `og:description`, and `og:image` meta tags are present with recipe-specific values
