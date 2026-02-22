## 1. Project Scaffolding & Configuration

- [x] 1.1 Bootstrap Next.js 14 App Router project with TypeScript and Tailwind CSS in the workspace root
- [x] 1.2 Install and configure shadcn/ui (Button, Input, Badge, Dialog, Skeleton components)
- [x] 1.3 Install Framer Motion, NextAuth.js v5 (Auth.js beta), bcryptjs, and @types/bcryptjs
- [x] 1.4 Configure `tailwind.config.ts` with design tokens (zinc-950, zinc-50, emerald-400, amber-400 palette, Geist Sans font)
- [x] 1.5 Set up `app/globals.css` with CSS custom properties, base reset, and glassmorphism utility classes
- [x] 1.6 Create `.env.local.example` documenting required env vars: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- [x] 1.7 Configure `next.config.ts` with allowed image domains for `next/image` (Unsplash, Pexels CDN)

## 2. Recipe Data Curation

- [x] 2.1 Research and curate ≥10 diverse recipes with realistic times, calories, ingredients, and steps
- [x] 2.2 Find and validate 3 direct image URLs per recipe (HTTP 200, Content-Type: image/*) from Unsplash or Pexels
- [x] 2.3 Find and validate 1 YouTube URL per recipe (real, public, relevant video)
- [x] 2.4 Write `data/recipes.json` with all ≥10 recipes conforming to the full schema
- [x] 2.5 Create `sources.md` documenting source pages, image URLs and their sources, YouTube video URLs for all recipes
- [x] 2.6 Create `validation.md` describing how each image URL and YouTube URL was verified

## 3. Data Access Layer

- [x] 3.1 Create `lib/recipes.ts` with `getAllRecipes()` and `getRecipeBySlug(slug)` server-side functions
- [x] 3.2 Implement `normalizeIngredient(str: string): string` — lowercase, trim, strip quantities/units, basic plural stripping
- [x] 3.3 Implement `matchRecipes(userIngredients: string[]): MatchResult[]` — normalize inputs, compute overlap score, sort by matchPercent descending, exclude 0% matches, return missingIngredients
- [x] 3.4 Export TypeScript types: `Recipe`, `MatchResult` from `lib/types.ts`

## 4. Authentication Setup

- [x] 4.1 Create `auth.ts` at project root configuring NextAuth.js with Google provider and Credentials provider (bcrypt password check)
- [x] 4.2 Create `lib/users.ts` with `findUserByEmail`, `createUser` functions backed by `data/users.json` (flat file store for MVP)
- [x] 4.3 Create `app/api/auth/[...nextauth]/route.ts` handler
- [x] 4.4 Create `middleware.ts` using NextAuth middleware to protect `/ai` route — redirect unauthenticated users to `/auth/login?callbackUrl=/ai`
- [x] 4.5 Create `app/api/auth/register/route.ts` POST endpoint for new user registration (validate, hash password, write to users.json)

## 5. UI Component Library

- [x] 5.1 Create `components/ui/Navbar.tsx` — floating glassmorphism nav, unauthenticated (Log in / Sign up links) and authenticated (user name + Sign out) states, mobile hamburger menu
- [x] 5.2 Create `components/ui/Container.tsx` — max-width responsive wrapper with horizontal padding
- [x] 5.3 Create `components/ui/Button.tsx` — primary, secondary, and ghost variants using shadcn/ui Button base
- [x] 5.4 Create `components/ui/Tag.tsx` — pill chip display component (read-only) for tags and categories
- [x] 5.5 Create `components/ui/Chip.tsx` — interactive removable chip for ingredient input (with × button)
- [x] 5.6 Create `components/ui/SkeletonCard.tsx` — placeholder card matching RecipeCard dimensions using shadcn Skeleton
- [x] 5.7 Create `components/ui/EmptyState.tsx` — illustration/icon + heading + message component for zero-results states
- [x] 5.8 Create `components/recipe/RecipeCard.tsx` — card showing recipe image (`next/image`), title, tags, time, calories, match % badge (optional prop); links to `/recipes/[slug]`
- [x] 5.9 Create `components/recipe/RecipeGrid.tsx` — responsive grid layout wrapping RecipeCard list with Suspense + SkeletonCard fallback
- [x] 5.10 Create `components/recipe/ImageGallery.tsx` — main image + 2 thumbnails gallery with click-to-swap, using `next/image`; subtle Framer Motion fade on swap
- [x] 5.11 Create `components/recipe/VideoEmbed.tsx` — responsive YouTube iframe using `youtube-nocookie.com/embed/<id>`, 16:9 aspect ratio, lazy-loaded
- [x] 5.12 Create `components/recipe/FilterBar.tsx` (client component) — tag filter chips, time filter dropdown, calorie filter dropdown, sort select

## 6. Authentication Pages

- [x] 6.1 Create `app/auth/login/page.tsx` — login form (email + password fields) + "Continue with Google" button; link to signup
- [x] 6.2 Create `app/auth/signup/page.tsx` — signup form (name + email + password fields) + "Continue with Google" button; link to login; POST to `/api/auth/register` then sign in
- [x] 6.3 Create `components/auth/AuthForm.tsx` — shared form container with logo, title, inputs, submit button, error display, and provider button
- [x] 6.4 Add client-side validation to both auth forms (required fields, email format, password ≥8 chars)
- [x] 6.5 Add success redirect after login/signup to `callbackUrl` or `/`

## 7. Homepage (Recipe Discovery)

- [x] 7.1 Create `app/page.tsx` as a Server Component — fetch all recipes server-side; render Hero + FilterBar + RecipeGrid
- [x] 7.2 Create `components/home/Hero.tsx` — full-width hero with bold headline, subheadline, CTA to `/ai`, subtle mesh gradient background and Framer Motion entrance animation
- [x] 7.3 Implement client-side filter/sort/search state in a `components/home/RecipeListClient.tsx` wrapper — filters applied to the pre-fetched recipe list
- [x] 7.4 Wire FilterBar tag chips, time dropdown, calorie dropdown, and sort select to filter/sort the RecipeGrid
- [x] 7.5 Implement keyword search input — real-time filter by title, description, and tags (debounced 200ms)
- [x] 7.6 Show EmptyState when no recipes match the current filters/search

## 8. Recipe Detail Page

- [x] 8.1 Create `app/recipes/[slug]/page.tsx` as a Server Component — fetch recipe by slug; return 404 if not found; export `generateMetadata` with OG tags
- [x] 8.2 Create `app/recipes/[slug]/generateStaticParams.ts` — export `generateStaticParams` returning all recipe slugs for SSG
- [x] 8.3 Render ImageGallery with the recipe's 3 images
- [x] 8.4 Render VideoEmbed with the recipe's YouTube video ID (extracted from `youtubeVideoUrl`)
- [x] 8.5 Display recipe metadata: title, description, servings, prep/cook/total time, calories per serving in a styled info bar
- [x] 8.6 Render ingredients as a styled unordered list and steps as a numbered ordered list
- [x] 8.7 Add source link (external `<a target="_blank">`) and back-navigation button

## 9. AI Generator Page

- [x] 9.1 Create `app/ai/page.tsx` — verify session server-side (redirect if missing); render AI generator UI
- [x] 9.2 Create `components/ai/IngredientInput.tsx` (client component) — text input + chip list; Enter/comma adds chip; × removes chip; "Find Recipes" button disabled when chips empty
- [x] 9.3 Create `components/ai/MatchResults.tsx` — renders MatchResult array as RecipeCards with match % badge and missing ingredients list
- [x] 9.4 Wire form submission to call `matchRecipes()` (imported from lib or via server action); show loading state; display results or EmptyState
- [x] 9.5 Add page hero/intro section explaining the AI ingredient matcher

## 10. Performance, SEO & Accessibility

- [x] 10.1 Verify all images across all pages use `next/image` with `alt` text, `width`, and `height` props
- [x] 10.2 Add `generateMetadata` to `app/layout.tsx` (site-level), `app/page.tsx` (homepage), and `app/ai/page.tsx` (AI page)
- [x] 10.3 Dynamic import (next/dynamic) for Framer Motion heavy components to avoid blocking SSR
- [x] 10.4 Add `aria-label` to all icon-only buttons (Navbar hamburger, chip × buttons, gallery thumbnails)
- [x] 10.5 Verify Tab-key navigation and visible focus rings on all interactive elements

## 11. Styling & Design Polish

- [ ] 11.1 Apply glassmorphism navbar: `backdrop-blur-md bg-white/5 border-b border-white/10`
- [ ] 11.2 Add Framer Motion `fadeInUp` entrance animation to Hero and RecipeCard grid items
- [ ] 11.3 Add hover micro-interactions to RecipeCard (subtle scale + shadow lift)
- [ ] 11.4 Ensure 4-color system (zinc-950 bg, zinc-50 text, emerald-400 accent, amber-400 accent) is consistent across all pages
- [ ] 11.5 Apply dark mode as default; ensure no hardcoded light-only color values
- [ ] 11.6 Typography: Geist Sans throughout; heading hierarchy via font-weight (800, 700, 600, 500, 400); line-height ≈ 1.5 for body

## 12. Documentation & Compliance

- [x] 12.1 Create `DESIGN.md` documenting the 4-color palette, typography rules, component hierarchy, and motion principles
- [x] 12.2 Create `README.md` with project overview, setup instructions, env var documentation, and development commands
- [x] 12.3 Create `REVIEW.md` with PASS/FAIL checklist covering all constitution requirements (10+ recipes, images, YouTube, auth, /ai protection, matching logic, design, performance)
- [x] 12.4 Run `npm run build` and confirm zero build errors
- [x] 12.5 Confirm dev server starts and `/`, `/recipes/[slug]`, `/auth/login`, `/auth/signup`, `/ai` all render correctly
