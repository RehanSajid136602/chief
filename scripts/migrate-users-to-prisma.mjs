import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const usersFile = path.join(process.cwd(), "data", "users.json");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  if (!fs.existsSync(usersFile)) {
    console.log("No legacy data file found at data/users.json. Nothing to migrate.");
    return;
  }

  const raw = fs.readFileSync(usersFile, "utf-8");
  const parsed = JSON.parse(raw);
  const users = Array.isArray(parsed.users) ? parsed.users : [];

  for (const legacy of users) {
    if (!legacy?.email) continue;

    const user = await prisma.user.upsert({
      where: { email: legacy.email },
      update: {
        name: legacy.name ?? "",
        password: legacy.password ?? null,
      },
      create: {
        email: legacy.email,
        name: legacy.name ?? "",
        password: legacy.password ?? null,
      },
    });

    await prisma.favoriteRecipe.deleteMany({ where: { userId: user.id } });

    const favorites = Array.isArray(legacy.favorites) ? legacy.favorites : [];
    if (favorites.length > 0) {
      await prisma.favoriteRecipe.createMany({
        data: favorites.map((recipeSlug) => ({ userId: user.id, recipeSlug })),
        skipDuplicates: true,
      });
    }
  }

  console.log(`Migrated ${users.length} legacy users to Prisma.`);
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
