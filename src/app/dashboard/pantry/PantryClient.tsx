"use client";

import { useState, useTransition } from "react";
import type { PantryItemRecord } from "@/lib/types/pantry";
import { addPantryItem, bulkAddPantryItemsFromText, deletePantryItem } from "@/app/actions/pantry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";

interface PantryClientProps {
  items: PantryItemRecord[];
  dbConfigured: boolean;
}

export function PantryClient({ items, dbConfigured }: PantryClientProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  const onAdd = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await addPantryItem(formData);
      if (!result.success) setError(result.error ?? "Failed to add pantry item");
    });
  };

  const onBulkAdd = (formData: FormData) => {
    setError(null);
    setBulkMessage(null);
    startTransition(async () => {
      const result = await bulkAddPantryItemsFromText(formData);
      if (!result.success) {
        setError(result.error ?? "Bulk add failed");
        return;
      }
      const created = "created" in result ? result.created : [];
      const invalid = "invalid" in result ? result.invalid : [];
      setBulkMessage(`Added ${created.length} item(s). ${invalid.length ? `${invalid.length} skipped.` : ""}`.trim());
    });
  };

  const onDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deletePantryItem(id);
      if (!result.success) setError(result.error ?? "Failed to delete pantry item");
    });
  };

  return (
    <div className="space-y-8">
      {!dbConfigured && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100 reveal-on-mount">
          Database is not configured yet. Pantry actions require a running Postgres database and `DATABASE_URL`.
        </div>
      )}

      <Reveal y={12}>
        <section className="surface-panel rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Quick Add Pantry Item</h2>
          <p className="text-sm text-zinc-400">Add one item at a time with quantity and category for planning and shopping calculations.</p>
        </div>
        <form action={onAdd} className="grid gap-3 md:grid-cols-6">
          <Input name="name" placeholder="Garlic" className="md:col-span-2" required />
          <Input name="quantity" type="number" step="0.01" min="0" placeholder="2" />
          <Input name="unit" placeholder="pcs / cup / lb" />
          <Input name="category" placeholder="produce" defaultValue="produce" />
          <Input name="expiresAt" type="date" />
          <Input name="lowStockThreshold" type="number" step="0.01" min="0" placeholder="1" />
          <Input name="note" placeholder="Optional note" className="md:col-span-4" />
          <div className="md:col-span-2 flex items-center">
            <Button type="submit" disabled={isPending || !dbConfigured} className="w-full">
              {isPending ? "Saving..." : "Add Item"}
            </Button>
          </div>
        </form>
        </section>
      </Reveal>

      <Reveal y={12} delay={0.03}>
        <section className="surface-panel rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">Bulk Add (one item per line)</h2>
        <form action={onBulkAdd} className="space-y-3">
          <textarea
            aria-label="Bulk pantry items"
            name="bulkText"
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/30"
            placeholder={"onion\nrice\ngarlic"}
          />
          <Button type="submit" variant="outline" disabled={isPending || !dbConfigured}>
            {isPending ? "Adding..." : "Bulk Add Items"}
          </Button>
        </form>
        {bulkMessage ? <p className="text-sm text-emerald-300">{bulkMessage}</p> : null}
        </section>
      </Reveal>

      {error ? (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Pantry Inventory</h2>
          <p className="text-sm text-zinc-500">{items.length} item{items.length === 1 ? "" : "s"}</p>
        </div>

        {items.length === 0 ? (
          <EmptyState
            heading="No pantry items yet"
            message="Start by adding staples like rice, onions, garlic, or oils. These items will be reused in planning and grocery list generation."
          />
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="surface-subtle rounded-2xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between reveal-on-mount"
                style={{ ["--reveal-delay" as string]: `${Math.min(index, 10) * 35}ms` }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-zinc-100">{item.name}</p>
                    <StatusBadge status={item.status} />
                    <span className="text-[11px] uppercase tracking-[0.1em] text-zinc-500">{item.category}</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {item.quantity ?? "?"} {item.unit ?? ""} {item.expiresAt ? `· Expires ${new Date(item.expiresAt).toLocaleDateString()}` : ""}
                  </p>
                  {item.note ? <p className="text-xs text-zinc-500">{item.note}</p> : null}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  disabled={isPending || !dbConfigured}
                  className="self-start md:self-auto text-rose-300 hover:text-rose-200"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: PantryItemRecord["status"] }) {
  const classes =
    status === "expired"
      ? "border-rose-300/30 bg-rose-400/10 text-rose-200"
      : status === "low_stock"
        ? "border-amber-300/30 bg-amber-400/10 text-amber-200"
        : "border-emerald-300/30 bg-emerald-400/10 text-emerald-200";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${classes}`}>
      {status.replace("_", " ")}
    </span>
  );
}
