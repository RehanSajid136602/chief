import { test, expect } from "@playwright/test";

test.describe("family workflow", () => {
  test("dashboard routes render and core navigation exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /AI Matcher/i })).toBeVisible();
    // Full auth -> pantry -> planner -> AI -> shopping flow requires seeded user + DB and is run in deployment validation.
  });

  test.skip("full workflow: preferences -> pantry -> planner -> AI -> shopping", async ({ page }) => {
    // This test is intentionally skipped by default until CI/deployment credentials are configured.
    // Expected steps:
    // 1. Sign in with test user
    // 2. Save household profile
    // 3. Add pantry items
    // 4. Create manual planner entry
    // 5. Trigger AI plan generation (optional if key configured)
    // 6. Generate shopping list and verify items render
    await page.goto("/auth/login");
    await expect(page).toHaveURL(/auth\/login/);
  });
});
