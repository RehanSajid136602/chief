## Context

This is a greenfield Next.js 14 (App Router) project. There is no existing codebase to migrate. The product is a recipe discovery website with an auth-gated AI ingredient-matching engine. The design must satisfy premium visual quality, fast performance, and deterministic (no LLM dependency) ingredient matching as the core interactive feature.

Stakeholders: solo developer (user), end-users (home cooks). Tech constraints from the brief: Next.js + Tailwind CSS + shadcn/ui, no mandatory database for MVP, Google OAuth + email auth, `next/image` for all images.

## Goals / Non-Goals

**Goals:**
- Ship a fully functional, visually premium recipe website with ≥10 curated recipes.
- Implement deterministic ingredient-matching that works without any API key.
- Provide Google OAuth + email/password auth using NextAuth.js; protect `/ai` behind auth.
- All recipe images must be direct CDN URLs; YouTube embeds must use the privacy-enhanced `nocookie` domain.
- Performance: Lighthouse ≥90; Server Components used wherever possible; `next/image` everywhere.
- Mobile-first, responsive layout; accessible keyboard navigation; ARIA labels.

**Non-Goals:**
- Real-time LLM recipe generation (optional enhancement behind feature flag only).
- Database persistence (no Prisma/Postgres in v1 — static JSON + JWT sessions).
- User-generated recipe submissions.
- Native mobile app.
- Payment or subscription gating.

## Decisions

### D1: App Router (Next.js 14) — Server Components by default
**Decision**: Use Next.js App Router with Server Components as the default; add `"use client"` only for interactive islands (FilterBar, ChipInput, auth forms, animations).  
**Rationale**: Reduces client JS bundle significantly; enables `generateMetadata` for per-page SEO; streaming and `Suspense`-based skeleton loading is built-in.  
**Alternative considered**: Pages Router — rejected because it lacks native Server Components and requires more manual data-fetching boilerplate.

### D2: Static JSON recipe dataset (no DB)
**Decision**: Store all recipe data in `data/recipes.json`, imported server-side via `lib/recipes.ts`.  
**Rationale**: Zero infrastructure cost; instant cold starts; data is curated and infrequently updated; no auth complexity for data reads.  
**Alternative considered**: Supabase/Postgres — rejected for MVP due to added infra complexity and latency.

### D3: NextAuth.js v5 (Auth.js) for authentication
**Decision**: Use `next-auth@beta` (Auth.js v5) with the Credentials provider (email/password with bcrypt) and Google OAuth provider.  
**Rationale**: Native Next.js App Router support; unified session via JWT (no adapter/DB required); well-documented Google OAuth integration.  
**Alternative considered**: Clerk — simpler DX but adds third-party dependency and cost at scale.  
**Password hashing**: `bcryptjs` for Credentials provider; passwords stored in a flat `users.json` for MVP (no DB). Route protection via middleware `matcher`.

### D4: Deterministic ingredient matching algorithm
**Decision**: Implement in `lib/recipes.ts` as a pure function — no external API calls.  
**Algorithm**:
1. Normalize both recipe ingredients and user inputs: lowercase, trim, strip quantities/units (regex), basic plural stripping (`-s`, `-es`).
2. Compute ingredient overlap: `matchCount = |userIngredients ∩ recipeIngredients|` per recipe.
3. `matchPercent = (matchCount / recipeIngredients.length) * 100` (rounded).
4. Sort descending by matchPercent; return top 10 results with `missingIngredients` array.
**Rationale**: Works offline; deterministic; instant; no API key required; easy to test.  
**Alternative considered**: OpenAI Embeddings — kept as optional feature flag behind `NEXT_PUBLIC_ENABLE_AI_ENHANCE=true`.

### D5: Styling — Tailwind CSS + shadcn/ui + Framer Motion
**Decision**: Tailwind utility classes with shadcn/ui primitives (Button, Input, Dialog, etc.) and Framer Motion for entrance animations and micro-interactions.  
**Rationale**: shadcn/ui gives accessible, unstyled-first components; Framer Motion enables performant GPU-accelerated animations without layout thrashing.  
**Design tokens**: 4-color system — `zinc-950` (dark bg), `zinc-50` (light text), `emerald-400` (accent 1), `amber-400` (accent 2). Glassmorphism navbar via `backdrop-blur` + `bg-white/5`.  
**Font**: Geist Sans (Next.js default) — single font family, weight contrast for hierarchy.

### D6: Image sourcing — Unsplash Source API / direct CDN
**Decision**: Use verified, stable CDN image URLs for all recipe images (Unsplash photo IDs or Pexels direct links in recipes.json).  
**Rationale**: Direct image URLs are required by the brief; Unsplash source URLs are permanent and load in-browser; `next/image` provides automatic optimization.  
**Validation**: Each URL tested for 200 status and Content-Type: image/* before inclusion.

### D7: YouTube embeds — privacy-enhanced mode
**Decision**: All YouTube embeds use `https://www.youtube-nocookie.com/embed/<videoId>` inside a responsive `<iframe>`.  
**Rationale**: Reduces third-party cookie tracking; required by brief that links must be real and reachable.

## Risks / Trade-offs

- **Static JSON scalability** → Acceptable for ≤1000 recipes; if catalog grows, migrate to a database with the same `lib/recipes.ts` interface (no page-level changes needed).
- **Credential password storage in flat file** → MVP only; clearly documented in README. Upgrade path: add Prisma + Postgres adapter to NextAuth.
- **YouTube embed availability** → URLs validated at build time; if a video is removed, `validation.md` provides a replacement workflow.
- **Google OAuth in dev** → Requires valid `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` env vars; documented in README. Without them, only email auth works.
- **Framer Motion bundle size** → Mitigated by dynamic import (`next/dynamic`) for animation-heavy components only. Core pages remain Server Components.
- **Image URL rot** → Unsplash photo IDs are stable; `sources.md` records original source pages for easy re-validation.
