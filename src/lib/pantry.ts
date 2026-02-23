import { prisma } from "@/lib/db/prisma";
import { normalizeIngredient } from "@/lib/recipes";
import type { PantryItemRecord, PantryStatus } from "@/lib/types/pantry";
import { parsePantryLines } from "@/lib/validation/pantry";

const SHOULD_USE_PRISMA = Boolean(process.env.DATABASE_URL);

function computeStatus(item: {
  expiresAt: Date | null;
  quantity: number | null;
  lowStockThreshold: number | null;
}): PantryStatus {
  if (item.expiresAt && item.expiresAt.getTime() < Date.now()) return "expired";
  if (
    item.quantity !== null &&
    item.lowStockThreshold !== null &&
    item.quantity <= item.lowStockThreshold
  ) {
    return "low_stock";
  }
  return "in_stock";
}

function toRecord(item: {
  id: string;
  name: string;
  normalizedName: string;
  quantity: unknown;
  unit: string | null;
  category: string | null;
  expiresAt: Date | null;
  lowStockThreshold: unknown;
  note: string | null;
}): PantryItemRecord {
  const quantity = item.quantity === null ? null : Number(item.quantity);
  const lowStockThreshold = item.lowStockThreshold === null ? null : Number(item.lowStockThreshold);
  return {
    id: item.id,
    name: item.name,
    normalizedName: item.normalizedName,
    quantity,
    unit: (item.unit as PantryItemRecord["unit"]) ?? null,
    category: (item.category as PantryItemRecord["category"]) ?? "other",
    expiresAt: item.expiresAt?.toISOString() ?? null,
    lowStockThreshold,
    note: item.note,
    status: computeStatus({
      expiresAt: item.expiresAt,
      quantity,
      lowStockThreshold,
    }),
  };
}

async function getUserIdByEmail(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function listPantryItemsByEmail(email: string): Promise<PantryItemRecord[]> {
  if (!SHOULD_USE_PRISMA) return [];
  try {
    const userId = await getUserIdByEmail(email);
    const items = await prisma.pantryItem.findMany({
      where: { userId },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return items.map(toRecord);
  } catch (error) {
    console.error("Error listing pantry items:", error);
    return [];
  }
}

export async function addPantryItemByEmail(
  email: string,
  data: {
    name: string;
    quantity: number | null;
    unit: string | null;
    category: string;
    expiresAt: Date | null;
    lowStockThreshold: number | null;
    note: string | null;
  }
) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const userId = await getUserIdByEmail(email);
  await prisma.pantryItem.create({
    data: {
      userId,
      name: data.name,
      normalizedName: normalizeIngredient(data.name),
      quantity: data.quantity ?? undefined,
      unit: data.unit,
      category: data.category,
      expiresAt: data.expiresAt,
      lowStockThreshold: data.lowStockThreshold ?? undefined,
      note: data.note,
    },
  });
}

export async function updatePantryItemByEmail(
  email: string,
  itemId: string,
  data: {
    name: string;
    quantity: number | null;
    unit: string | null;
    category: string;
    expiresAt: Date | null;
    lowStockThreshold: number | null;
    note: string | null;
  }
) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const userId = await getUserIdByEmail(email);
  await prisma.pantryItem.update({
    where: { id: itemId, userId },
    data: {
      name: data.name,
      normalizedName: normalizeIngredient(data.name),
      quantity: data.quantity ?? undefined,
      unit: data.unit,
      category: data.category,
      expiresAt: data.expiresAt,
      lowStockThreshold: data.lowStockThreshold ?? undefined,
      note: data.note,
    },
  });
}

export async function deletePantryItemByEmail(email: string, itemId: string) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const userId = await getUserIdByEmail(email);
  await prisma.pantryItem.delete({ where: { id: itemId, userId } });
}

export async function bulkAddPantryItemsByEmail(email: string, rawText: string) {
  if (!SHOULD_USE_PRISMA) throw new Error("Database is not configured");
  const userId = await getUserIdByEmail(email);
  const lines = parsePantryLines(rawText);

  const created: string[] = [];
  const invalid: string[] = [];

  for (const line of lines) {
    const normalized = normalizeIngredient(line);
    if (!normalized) {
      invalid.push(line);
      continue;
    }
    await prisma.pantryItem.create({
      data: {
        userId,
        name: line,
        normalizedName: normalized,
        category: "other",
      },
    });
    created.push(line);
  }

  return { created, invalid };
}

export async function getPantrySummaryByEmail(email: string) {
  const items = await listPantryItemsByEmail(email);
  const expiredCount = items.filter((i) => i.status === "expired").length;
  const lowStockCount = items.filter((i) => i.status === "low_stock").length;
  return {
    total: items.length,
    expiredCount,
    lowStockCount,
  };
}
