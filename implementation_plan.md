# Auth Page Redesign Implementation Plan

Date: 2026-02-22

## Scope

Redesign the authentication experience (`/auth/login` and `/auth/signup`) for competition quality while preserving existing functionality:

- Credentials login/signup
- Google OAuth login
- NextAuth callback flow
- Existing server API (`/api/auth/register`)

This plan also tracks the separate runtime issue reported by the user:

- Navbar content mismatch across ports (`3000` vs `3004`) caused by stale Next.js cache/server state
- Home hero section appearing to disappear (likely same stale instance/cache symptom)

## Current State Review

### Pages reviewed

- `src/app/auth/login/page.tsx`
- `src/app/auth/signup/page.tsx`
- `src/app/auth/layout.tsx`

### Form component review

There are **no separate `LoginForm` / `SignupForm` components** in the current codebase.

The app uses one shared component:

- `src/components/auth/AuthForm.tsx` with `mode: "login" | "signup"`

## Findings (Pre-Redesign)

1. Critical signup bug (patched)
- `src/app/api/auth/register/route.ts` called `createUser(name, email, password)` but `createUser` expects `(email, name, password)`.
- Impact: malformed user records + credentials login failure after signup.
- Status: fixed.

2. Navbar/hero inconsistency on port `3004`
- Likely stale Next.js cache / stale dev server instance.
- `.next` cache clearing is the correct first fix.
- Runtime verification on `3004` is blocked inside the current sandbox unless elevated permissions are granted (binding to local port is denied).

## Redesign Goals

- Make auth pages feel premium and competition-ready.
- Improve visual hierarchy and conversion clarity (login vs signup).
- Preserve performance (no heavy assets, minimal runtime JS beyond current client form logic).
- Keep accessibility solid (labels, focus states, errors, keyboard behavior).
- Keep Google OAuth button styling polished and recognizable.

## Recommended Approach

### Approach A (Recommended): Keep shared `AuthForm`, redesign page shells + internal visual structure

Pros:
- Lowest risk to auth behavior
- Reuses existing logic for credentials + Google OAuth
- Faster to ship and verify

Cons:
- Less separation if login/signup diverge further later

### Approach B: Split into `LoginForm` and `SignupForm` wrappers around shared sub-fields/actions

Pros:
- Clearer page-specific customization
- Easier future divergence

Cons:
- More refactor risk before competition
- More duplicated UX state/error handling unless carefully abstracted

## Implementation Steps (Post-Approval)

1. Redesign `src/app/auth/layout.tsx`
- Upgrade background composition and card container
- Improve mobile/desktop spacing and atmosphere
- Keep fast-loading CSS-only visual effects

2. Redesign `src/app/auth/login/page.tsx`
- Add stronger headline/support copy
- Add page-specific trust cues / CTA structure
- Keep `AuthForm mode="login"`

3. Redesign `src/app/auth/signup/page.tsx`
- Add distinct signup positioning and benefits copy
- Keep `AuthForm mode="signup"`

4. Refine `src/components/auth/AuthForm.tsx`
- Improve field grouping and error presentation
- Improve button/loading states
- Improve Google OAuth button icon alignment and styling
- Preserve current NextAuth callback behavior

5. Functional polish (low-risk)
- Preserve `callbackUrl` when switching between login/signup links if present
- Keep redirects and refresh behavior intact

6. Verification
- Manual test login/signup flows (credentials)
- Manual test Google OAuth button rendering (and flow if env vars available)
- Verify protected route redirect + callback return (`/ai`, `/dashboard`)
- Verify visual layout on mobile and desktop

## Runtime Cache / Port 3004 Fix Steps

1. Stop any dev server on port `3004`
2. Remove `.next` cache (`rm -rf .next`)
3. Restart dev server on `3004`
4. Verify navbar labels show `Login` and `Sign Up`
5. Verify home hero renders

## Verification Checklist (When Port Access Is Available)

- Home page shows hero headline and CTA buttons
- Navbar on `3004` shows `Login` and `Sign Up`
- `/auth/login` and `/auth/signup` render redesigned UI
- Credentials signup creates a correct user record (`email`, `name` fields not swapped)
- Post-signup auto-signin succeeds

## Files Expected To Change (After Approval)

- `src/app/auth/layout.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/signup/page.tsx`
- `src/components/auth/AuthForm.tsx`
- (optional) small supporting UI files only if necessary
