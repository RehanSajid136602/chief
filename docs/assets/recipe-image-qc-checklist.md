# Recipe Image QC Checklist

Use this checklist before marking any recipe image as `approved`.

## Per-image checks (required)

- Dish shown matches the recipe title exactly (or canonical presentation).
- Photo is a real photograph (not AI-generated artwork/render).
- Main ingredients visually align with the recipe (e.g., pad thai looks like pad thai).
- Cuisine style is consistent (e.g., Greek salad is not a generic mixed salad).
- No unrelated dish dominates the image.
- Image is clear and usable at card/hero/gallery sizes.
- URL loads and is stable.
- Source page and usage/license are documented.

## Per-recipe checks (required)

- Exactly 3 images are present.
- At least 2 images show distinct compositions/angles.
- No accidental duplicates within the same recipe.
- Images are relevant across the whole set (not random food shots).

## Dataset checks (required)

- 12 recipes total.
- 36 images total.
- Duplicate URLs across recipes are reviewed and replaced where inaccurate.
- `npm run validate:images` passes structure checks.

## Final signoff

- Reviewer name:
- Review date:
- Notes / replacements made:
