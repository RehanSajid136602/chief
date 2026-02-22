## Why

Home cooks struggle to find recipes that match the ingredients they already have, leading to food waste and decision fatigue. This project introduces a premium recipe website with an AI-powered "ingredients → recipes" generator — giving users instant, intelligent meal suggestions from what's in their fridge, with full auth-gated access.

## What Changes

- New Next.js 14+ (App Router) project bootstrapped with Tailwind CSS and shadcn/ui.
- **New**: `/` — Recipe discovery home with hero, full-text search, filter (time, calories, tags), sort, skeleton states, and responsive grid.
- **New**: `/recipes/[slug]` — Recipe detail page with 3-image gallery, YouTube embed, ingredients, steps, nutrition, and servings.
- **New**: `/ai` — Protected AI generator page; users enter ingredients as chips and get ranked recipe matches with match %, missing ingredients listed.
- **New**: `/auth/signup` and `/auth/login` — Email/password + Google OAuth flows; unauthenticated users are redirected to login before accessing `/ai`.
- **New**: `data/recipes.json` — Verified dataset of ≥10 curated recipes, each with 3 direct image URLs, YouTube link, calories, and full instructions.
- **New**: `lib/recipes.ts` — Server-side data access layer with deterministic ingredient-matching algorithm (normalize → overlap score → rank).
- **New**: `sources.md`, `validation.md`, `DESIGN.md`, `REVIEW.md`, `README.md` — Documentation and compliance artifacts.

## Capabilities

### New Capabilities

- `recipe-catalog`: Curated dataset of ≥10 recipes (JSON schema) with full metadata — slug, title, description, tags, servings, times, calories, ingredients, steps, 3 images, YouTube video URL, and source URL.
- `recipe-discovery`: Homepage with hero section, keyword search, tag/time/calorie filters, sort options, responsive RecipeCard grid, and skeleton loading states.
- `recipe-detail`: Individual recipe page (`/recipes/[slug]`) with 3-image gallery, embedded YouTube player, ingredients list, step-by-step instructions, time/calorie/servings display, and external source link.
- `ai-ingredient-matcher`: Deterministic matching engine in `lib/recipes.ts` — normalizes input ingredients, scores recipes by overlap percentage, returns ranked results with match % and missing ingredients list. Protected behind auth.
- `user-auth`: Email/password sign-up + login and Google OAuth via NextAuth.js (or similar). Session management with JWT. Protected routes redirect unauthenticated users to `/auth/login` with `callbackUrl`.

### Modified Capabilities

_(None — this is a greenfield project with no existing specs.)_

## Impact

- **New project root**: `/home/rehan/Documents/ai-recipe-generator/antigravity/` — all code lives here.
- **Dependencies**: Next.js 14+, React 18+, TypeScript, Tailwind CSS, shadcn/ui, NextAuth.js (or Auth.js v5), Framer Motion, next/image.
- **No backend database** — recipe data is static JSON; auth sessions are JWT-based (no DB required for MVP).
- **External services**: Google OAuth credentials (env vars), Unsplash/direct image CDN links, YouTube embed API.
- **Performance**: Server Components used throughout; client JS minimized; `next/image` for all images; lazy loading for non-critical UI.
- **SEO**: `generateMetadata` per route; OG tags on recipe detail pages.
