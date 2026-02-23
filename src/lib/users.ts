import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const SHOULD_USE_PRISMA = Boolean(process.env.DATABASE_URL);
const ALLOW_FILE_FALLBACK = process.env.NODE_ENV !== "production";

export interface User {
  id: string;
  email: string;
  name: string;
  region?: string | null;
  password: string;
  createdAt: string;
  favorites?: string[];
}

interface UsersData {
  users: User[];
}

function readUsersFile(): UsersData {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading users file:", error);
  }
  return { users: [] };
}

function writeUsersFile(data: UsersData): void {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

export async function findUserByEmail(email: string): Promise<User | null> {
  if (SHOULD_USE_PRISMA) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { favorites: true },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? "",
        region: user.region ?? null,
        password: user.password ?? "",
        createdAt: user.createdAt.toISOString(),
        favorites: user.favorites.map((f) => f.recipeSlug),
      };
    } catch (error) {
      console.error("Error reading user from Prisma:", error);
      return null;
    }
  }

  if (!ALLOW_FILE_FALLBACK) return null;
  const data = readUsersFile();
  const user = data.users.find((u) => u.email === email) || null;
  if (user && !user.favorites) {
    user.favorites = [];
  }
  if (user && user.region === undefined) {
    user.region = null;
  }
  return user;
}

export async function updateUser(
  email: string,
  updates: Partial<User>
): Promise<User | null> {
  if (SHOULD_USE_PRISMA) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email },
      });
      if (!existing) return null;

      const favoriteSlugs = updates.favorites;

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { email },
          data: {
            name: updates.name ?? existing.name,
            region:
              updates.region === undefined ? existing.region : updates.region,
            password: updates.password ?? existing.password,
          },
        });

        if (favoriteSlugs) {
          await tx.favoriteRecipe.deleteMany({ where: { userId: existing.id } });
          if (favoriteSlugs.length > 0) {
            await tx.favoriteRecipe.createMany({
              data: favoriteSlugs.map((recipeSlug) => ({
                userId: existing.id,
                recipeSlug,
              })),
            });
          }
        }
      });

      return findUserByEmail(email);
    } catch (error) {
      console.error("Error updating user in Prisma:", error);
      return null;
    }
  }

  if (!ALLOW_FILE_FALLBACK) {
    throw new Error("Database is required in production");
  }
  const data = readUsersFile();
  const userIndex = data.users.findIndex((u) => u.email === email);
  if (userIndex === -1) return null;

  data.users[userIndex] = {
    ...data.users[userIndex],
    ...updates,
    favorites: updates.favorites || data.users[userIndex].favorites || [],
    region:
      updates.region === undefined
        ? (data.users[userIndex].region ?? null)
        : updates.region,
  };

  writeUsersFile(data);
  return data.users[userIndex];
}

export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<User> {
  if (SHOULD_USE_PRISMA) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const created = await prisma.user.create({
      data: {
        email,
        name,
        region: null,
        password: hashedPassword,
      },
    });

    return {
      id: created.id,
      email: created.email,
      name: created.name ?? "",
      region: created.region ?? null,
      password: created.password ?? "",
      createdAt: created.createdAt.toISOString(),
      favorites: [],
    };
  }

  if (!ALLOW_FILE_FALLBACK) {
    throw new Error("Database is required in production");
  }
  const data = readUsersFile();
  
  const existingUser = data.users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name,
    region: null,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    favorites: [],
  };

  data.users.push(newUser);
  writeUsersFile(data);

  return newUser;
}

export async function verifyPassword(
  user: User,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}
