#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const recipesPath = path.join(repoRoot, "src/data/recipes.json");
const reviewPath = path.join(repoRoot, "docs/assets/recipe-video-review.json");
const manifestOut = path.join(repoRoot, "docs/assets/recipe-video-manifest.md");

function getYouTubeVideoId(url) {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/i,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const raw = fs.readFileSync(recipesPath, "utf8");
const data = JSON.parse(raw);
const recipes = Array.isArray(data?.recipes) ? data.recipes : [];
const errors = [];
const warnings = [];
const entries = [];
const usedVideoIds = new Map();

let reviewData = { reviewedBy: "", reviewDate: "", entries: {} };
if (fs.existsSync(reviewPath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
    if (parsed && typeof parsed === "object") {
      reviewData = {
        reviewedBy: parsed.reviewedBy ?? "",
        reviewDate: parsed.reviewDate ?? "",
        entries: parsed.entries && typeof parsed.entries === "object" ? parsed.entries : {},
      };
    }
  } catch (error) {
    warnings.push(`Unable to parse ${path.relative(repoRoot, reviewPath)}: ${String(error)}`);
  }
}

if (!recipes.length) {
  errors.push("No recipes found in src/data/recipes.json (expected data.recipes array).");
}

for (const recipe of recipes) {
  if (!recipe?.slug) {
    errors.push("Encountered recipe without slug.");
    continue;
  }

  const youtubeUrl = typeof recipe.youtubeVideoUrl === "string" ? recipe.youtubeVideoUrl.trim() : "";
  if (!youtubeUrl) {
    warnings.push(`${recipe.slug}: youtubeVideoUrl is empty (video section should be hidden).`);
    entries.push({
      slug: recipe.slug,
      title: recipe.title ?? recipe.slug,
      youtubeUrl: "",
      videoId: "",
    });
    continue;
  }

  const videoId = getYouTubeVideoId(youtubeUrl);
  if (!videoId) {
    errors.push(`${recipe.slug}: invalid YouTube URL or video ID (${youtubeUrl}).`);
  } else {
    const usage = usedVideoIds.get(videoId) ?? [];
    usage.push(recipe.slug);
    usedVideoIds.set(videoId, usage);
  }

  entries.push({
    slug: recipe.slug,
    title: recipe.title ?? recipe.slug,
    youtubeUrl,
    videoId: videoId ?? "",
  });
}

for (const [videoId, slugs] of usedVideoIds.entries()) {
  const uniq = [...new Set(slugs)];
  if (uniq.length > 1) {
    warnings.push(`Duplicate YouTube video ID ${videoId} reused by ${uniq.join(", ")}`);
  }
}

if (recipes.length === 12 && entries.length !== 12) {
  errors.push(`Expected 12 recipe video entries, found ${entries.length}.`);
}

function hostFromUrl(url) {
  try {
    if (!url) return "none";
    return new URL(url).hostname;
  } catch {
    return "invalid";
  }
}

function buildManifestMarkdown() {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push("# Recipe Video Manifest");
  lines.push("");
  lines.push(`Generated: ${today}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Recipes: ${recipes.length}`);
  lines.push(`- Video entries: ${entries.length}`);
  lines.push(`- Status: ${errors.length ? "validation failed" : "format valid (manual relevance review documented below)"}`);
  if (reviewData.reviewedBy) lines.push(`- Reviewed by: ${reviewData.reviewedBy}`);
  if (reviewData.reviewDate) lines.push(`- Review date: ${reviewData.reviewDate}`);
  lines.push("");
  lines.push("## Policy");
  lines.push("");
  lines.push("- YouTube only");
  lines.push("- Same dish relevance required (tutorial style may vary)");
  lines.push("- Hide video section if URL is invalid or intentionally omitted");
  lines.push("");
  if (warnings.length) {
    lines.push("## Warnings");
    lines.push("");
    warnings.forEach((warning) => lines.push(`- ${warning}`));
    lines.push("");
  }
  if (errors.length) {
    lines.push("## Errors");
    lines.push("");
    errors.forEach((error) => lines.push(`- ${error}`));
    lines.push("");
  }
  lines.push("## Video Entries");
  lines.push("");
  lines.push("| Recipe | Slug | Host | Video ID | URL | Channel | Source Page | Review | Notes |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  for (const entry of entries) {
    const review = reviewData.entries?.[entry.slug] ?? {};
    const reviewStatus = review.status ?? "pending_manual_review";
    const notes = review.notes ?? "Verify video relevance and embed behavior";
    const sourcePage = review.sourcePage ?? entry.youtubeUrl ?? "";
    const channelName = review.channelName ?? "";
    lines.push(
      `| ${entry.title} | \`${entry.slug}\` | ${hostFromUrl(entry.youtubeUrl)} | ${entry.videoId || "n/a"} | ${entry.youtubeUrl || "(none)"} | ${channelName} | ${sourcePage} | ${reviewStatus} | ${notes} |`
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
console.log(`Video entries: ${entries.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((warning) => console.log(`WARN: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));

if (errors.length) {
  process.exitCode = 1;
}
