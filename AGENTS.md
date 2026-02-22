# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build/Lint/Test Commands
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- No test framework configured

## Code Style Guidelines
- Use `@/*` path alias (defined in tsconfig.json)
- Use `cn()` from `@/lib/utils` for Tailwind class merging (not raw clsx/tailwind-merge)
- Components follow shadcn/ui "new-york" style
- Dark mode is enforced by default (`class="dark"` in html tag)

## Critical Patterns (Non-Obvious)
- **User storage**: Users stored in JSON file at `data/users.json`, NOT a database. User functions in `src/lib/users.ts` handle file I/O directly.
- **Recipe data**: Recipes loaded from static `data/recipes.json` via `src/lib/recipes.ts`
- **Auth config**: NextAuth v5 configured in `src/auth.ts` (not in API routes). Uses JWT strategy with credentials and Google OAuth providers.
- **Route protection**: Middleware at `src/middleware.ts` protects `/ai/*` routes, redirecting unauthenticated users to `/auth/login`
- **Session**: Get session with `import { auth } from "@/auth"` in server components

## Environment Variables Required
- `NEXTAUTH_SECRET` - Required for NextAuth
- `NEXTAUTH_URL` - App URL (http://localhost:3000 for dev)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Optional, for OAuth

## Project Structure Notes
- `src/app/` - Next.js 14 App Router pages
- `src/components/ui/` - shadcn/ui base components
- `openspec/` - Project specifications directory
