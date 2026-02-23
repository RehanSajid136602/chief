#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const recipesPath = path.join(repoRoot, "src/data/recipes.json");
const manifestOut = path.join(repoRoot, "docs/assets/recipe-image-manifest.md");
const reviewPath = path.join(repoRoot, "docs/assets/recipe-image-review.json");

const raw = fs.readFileSync(recipesPath, "utf8");
const data = JSON.parse(raw);
const recipes = Array.isArray(data?.recipes) ? data.recipes : [];
const errors = [];
const warnings = [];
const allEntries = [];
const urlUsage = new Map();
let reviewData = { entries: {} };
if (fs.existsSync(reviewPath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
    if (parsed && typeof parsed === "object") {
      reviewData = {
        ...parsed,
        entries: parsed.entries && typeof parsed.entries === "object" ? parsed.entries : {},
      };
    }
  } catch (error) {
    warnings.push(`Unable to parse review file ${path.relative(repoRoot, reviewPath)}: ${String(error)}`);
  }
}

if (recipes.length === 0) {
  errors.push("No recipes found in src/data/recipes.json (expected data.recipes array).");
}

for (const recipe of recipes) {
  if (!recipe?.slug) {
    errors.push("Encountered recipe without slug.");
    continue;
  }

  if (!Array.isArray(recipe.images)) {
    errors.push(`${recipe.slug}: images must be an array.`);
    continue;
  }

  if (recipe.images.length !== 3) {
    errors.push(`${recipe.slug}: expected exactly 3 images, found ${recipe.images.length}.`);
  }

  const seenInRecipe = new Set();
  recipe.images.forEach((url, index) => {
    const imageIndex = index + 1;
    if (typeof url !== "string" || !url.trim()) {
      errors.push(`${recipe.slug}: image ${imageIndex} is empty.`);
      return;
    }
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
      warnings.push(`${recipe.slug}: image ${imageIndex} is not an absolute URL or local path (${url}).`);
    }
    if (seenInRecipe.has(url)) {
      errors.push(`${recipe.slug}: duplicate image URL within recipe (${url}).`);
    }
    seenInRecipe.add(url);

    allEntries.push({
      slug: recipe.slug,
      title: recipe.title ?? recipe.slug,
      imageIndex,
      url,
    });

    const usage = urlUsage.get(url) ?? [];
    usage.push(recipe.slug);
    urlUsage.set(url, usage);
  });
}

for (const [url, slugs] of urlUsage.entries()) {
  const uniq = [...new Set(slugs)];
  if (uniq.length > 1) {
    warnings.push(`Cross-recipe duplicate image URL used by ${uniq.join(", ")}: ${url}`);
  }
}

const totalImages = allEntries.length;
if (recipes.length > 0 && totalImages !== recipes.length * 3) {
  errors.push(`Total image count mismatch: expected ${recipes.length * 3}, found ${totalImages}.`);
}
if (recipes.length === 12 && totalImages !== 36) {
  errors.push(`Competition target mismatch: expected 36 images for 12 recipes, found ${totalImages}.`);
}

function hostFromUrl(url) {
  try {
    if (url.startsWith("/")) return "local";
    return new URL(url).hostname;
  } catch {
    return "invalid";
  }
}

function buildManifestMarkdown() {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push("# Recipe Image Manifest");
  lines.push("");
  lines.push(`Generated: ${today}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Recipes: ${recipes.length}`);
  lines.push(`- Total images: ${totalImages}`);
  lines.push(`- Expected images per recipe: 3`);
  lines.push(`- Status: ${errors.length ? "validation failed" : "structure valid (semantic review still required)"}`);
  if (reviewData.reviewedBy) lines.push(`- Reviewed by: ${reviewData.reviewedBy}`);
  if (reviewData.reviewDate) lines.push(`- Review date: ${reviewData.reviewDate}`);
  lines.push("");
  lines.push("## Manual Accuracy Policy");
  lines.push("");
  lines.push("- Use real photos only (no AI-generated images).");
  lines.push("- Each photo must clearly match the named recipe dish.");
  lines.push("- Cross-recipe duplicates should be reviewed and replaced unless intentionally shared.");
  lines.push("- Mark each image `approved` only after human visual verification.");
  lines.push("");
  if (warnings.length) {
    lines.push("## Warnings");
    lines.push("");
    warnings.forEach((w) => lines.push(`- ${w}`));
    lines.push("");
  }
  if (errors.length) {
    lines.push("## Errors");
    lines.push("");
    errors.forEach((e) => lines.push(`- ${e}`));
    lines.push("");
  }
  lines.push("## Image Entries");
  lines.push("");
  lines.push("| Recipe | Slug | Image # | Host | URL | Source Page | Verification | Notes |");
  lines.push("|---|---|---:|---|---|---|---|---|");
  for (const entry of allEntries) {
    const reviewKey = `${entry.slug}#${entry.imageIndex}`;
    const reviewEntry = reviewData.entries?.[reviewKey] ?? {};
    const sourcePage = reviewEntry.sourcePage || entry.url;
    const verification = reviewEntry.status || "pending_manual_review";
    const notes = reviewEntry.notes || "Verify dish match and licensing/source page";
    lines.push(
      `| ${entry.title} | \`${entry.slug}\` | ${entry.imageIndex} | ${hostFromUrl(entry.url)} | ${entry.url} | ${sourcePage} | ${verification} | ${notes} |`
    );
  }
  lines.push("");
  return lines.join("\n");
}

if (process.argv.includes("--write-manifest")) {
  fs.mkdirSync(path.dirname(manifestOut), { recursive: true });
  fs.writeFileSync(manifestOut, buildManifestMarkdown());
  console.log(`Wrote manifest: ${path.relative(repoRoot, manifestOut)}`);
}

console.log(`Recipes: ${recipes.length}`);
console.log(`Total images: ${totalImages}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((w) => console.log(`WARN: ${w}`));
errors.forEach((e) => console.error(`ERROR: ${e}`));

if (errors.length) {
  process.exitCode = 1;
}
