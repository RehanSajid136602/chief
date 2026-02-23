-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FavoriteRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recipeSlug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FavoriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "householdName" TEXT,
    "adultCount" INTEGER NOT NULL DEFAULT 1,
    "kidCount" INTEGER NOT NULL DEFAULT 0,
    "dietaryPreferences" JSONB,
    "allergies" JSONB,
    "dislikedIngredients" JSONB,
    "weeklyBudget" INTEGER,
    "maxWeekdayCookTime" INTEGER,
    "maxWeekendCookTime" INTEGER,
    "mealsPerWeek" INTEGER,
    "prefersLeftovers" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Household_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PantryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "quantity" REAL,
    "unit" TEXT,
    "category" TEXT,
    "expiresAt" DATETIME,
    "lowStockThreshold" REAL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PantryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealPlanWeek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekKey" TEXT NOT NULL,
    "timezone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MealPlanWeek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealPlanEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealPlanWeekId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "slot" TEXT NOT NULL,
    "recipeSlug" TEXT NOT NULL,
    "recipeTitleSnapshot" TEXT NOT NULL,
    "recipeTotalTimeSnapshot" INTEGER,
    "recipeCaloriesSnapshot" INTEGER,
    "note" TEXT,
    "isLeftoversRepeat" BOOLEAN NOT NULL DEFAULT false,
    "rationale" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MealPlanEntry_mealPlanWeekId_fkey" FOREIGN KEY ("mealPlanWeekId") REFERENCES "MealPlanWeek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShoppingList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mealPlanWeekId" TEXT,
    "title" TEXT NOT NULL,
    "strictness" TEXT,
    "generatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ShoppingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShoppingList_mealPlanWeekId_fkey" FOREIGN KEY ("mealPlanWeekId") REFERENCES "MealPlanWeek" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shoppingListId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT,
    "quantityText" TEXT,
    "category" TEXT,
    "note" TEXT,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "isManual" BOOLEAN NOT NULL DEFAULT false,
    "sourceRecipeSlugs" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ShoppingListItem_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "ShoppingList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiGenerationRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "requestScope" TEXT,
    "status" TEXT NOT NULL,
    "latencyMs" INTEGER,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiGenerationRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "FavoriteRecipe_userId_idx" ON "FavoriteRecipe"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteRecipe_userId_recipeSlug_key" ON "FavoriteRecipe"("userId", "recipeSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Household_userId_key" ON "Household"("userId");

-- CreateIndex
CREATE INDEX "PantryItem_userId_idx" ON "PantryItem"("userId");

-- CreateIndex
CREATE INDEX "PantryItem_userId_normalizedName_idx" ON "PantryItem"("userId", "normalizedName");

-- CreateIndex
CREATE INDEX "MealPlanWeek_userId_idx" ON "MealPlanWeek"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MealPlanWeek_userId_weekKey_key" ON "MealPlanWeek"("userId", "weekKey");

-- CreateIndex
CREATE INDEX "MealPlanEntry_mealPlanWeekId_idx" ON "MealPlanEntry"("mealPlanWeekId");

-- CreateIndex
CREATE UNIQUE INDEX "MealPlanEntry_mealPlanWeekId_dayOfWeek_slot_key" ON "MealPlanEntry"("mealPlanWeekId", "dayOfWeek", "slot");

-- CreateIndex
CREATE INDEX "ShoppingList_userId_idx" ON "ShoppingList"("userId");

-- CreateIndex
CREATE INDEX "ShoppingList_mealPlanWeekId_idx" ON "ShoppingList"("mealPlanWeekId");

-- CreateIndex
CREATE INDEX "ShoppingListItem_shoppingListId_idx" ON "ShoppingListItem"("shoppingListId");

-- CreateIndex
CREATE INDEX "AiGenerationRun_userId_createdAt_idx" ON "AiGenerationRun"("userId", "createdAt");
