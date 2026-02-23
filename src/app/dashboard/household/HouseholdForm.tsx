"use client";

import { useState, useTransition } from "react";
import { createOrUpdateHouseholdProfile } from "@/app/actions/household";
import type { HouseholdProfile } from "@/lib/types/household";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

interface HouseholdFormProps {
  initialProfile: HouseholdProfile | null;
}

export function HouseholdForm({ initialProfile }: HouseholdFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const defaults = initialProfile ?? {
    householdName: "",
    adultCount: 1,
    kidCount: 0,
    dietaryPreferences: [],
    allergies: [],
    dislikedIngredients: [],
    weeklyBudget: null,
    maxWeekdayCookTime: null,
    maxWeekendCookTime: null,
    mealsPerWeek: null,
    prefersLeftovers: false,
  };

  const submit = (formData: FormData) => {
    setError(null);
    setSaved(false);
    setFieldErrors({});

    startTransition(async () => {
      const result = await createOrUpdateHouseholdProfile(formData);
      if (!result.success) {
        setError(result.error ?? "Failed to save household profile");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <form action={submit} className="space-y-6">
      <Reveal y={10}>
        <div className="grid gap-4 md:grid-cols-2">
        <Field label="Household Name" name="householdName" error={fieldErrors.householdName}>
          <Input name="householdName" defaultValue={defaults.householdName} placeholder="The Khan Family" />
        </Field>
        <Field label="Weekly Budget (optional)" name="weeklyBudget" error={fieldErrors.weeklyBudget}>
          <Input
            name="weeklyBudget"
            type="number"
            min={0}
            defaultValue={defaults.weeklyBudget ?? ""}
            placeholder="150"
          />
        </Field>
        <Field label="Adults" name="adultCount" error={fieldErrors.adultCount}>
          <Input name="adultCount" type="number" min={1} max={20} defaultValue={defaults.adultCount} required />
        </Field>
        <Field label="Kids" name="kidCount" error={fieldErrors.kidCount}>
          <Input name="kidCount" type="number" min={0} max={20} defaultValue={defaults.kidCount} required />
        </Field>
        <Field
          label="Max Weekday Cook Time (min)"
          name="maxWeekdayCookTime"
          error={fieldErrors.maxWeekdayCookTime}
        >
          <Input
            name="maxWeekdayCookTime"
            type="number"
            min={5}
            max={600}
            defaultValue={defaults.maxWeekdayCookTime ?? ""}
            placeholder="30"
          />
        </Field>
        <Field
          label="Max Weekend Cook Time (min)"
          name="maxWeekendCookTime"
          error={fieldErrors.maxWeekendCookTime}
        >
          <Input
            name="maxWeekendCookTime"
            type="number"
            min={5}
            max={600}
            defaultValue={defaults.maxWeekendCookTime ?? ""}
            placeholder="60"
          />
        </Field>
        <Field label="Meals Per Week" name="mealsPerWeek" error={fieldErrors.mealsPerWeek}>
          <Input
            name="mealsPerWeek"
            type="number"
            min={1}
            max={21}
            defaultValue={defaults.mealsPerWeek ?? ""}
            placeholder="14"
          />
        </Field>
        </div>
      </Reveal>

      <Reveal y={10} delay={0.02}>
        <Field
          label="Dietary Preferences (comma-separated)"
          name="dietaryPreferences"
          error={fieldErrors.dietaryPreferences}
        >
          <Input
            name="dietaryPreferences"
            defaultValue={defaults.dietaryPreferences.join(", ")}
            placeholder="halal, vegetarian"
          />
        </Field>
      </Reveal>

      <Reveal y={10} delay={0.03}>
        <Field label="Allergies / Intolerances" name="allergies" error={fieldErrors.allergies}>
          <Input
            name="allergies"
            defaultValue={defaults.allergies.join(", ")}
            placeholder="peanuts, shellfish"
          />
        </Field>
      </Reveal>

      <Reveal y={10} delay={0.04}>
        <Field
          label="Disliked Ingredients"
          name="dislikedIngredients"
          error={fieldErrors.dislikedIngredients}
        >
          <Input
            name="dislikedIngredients"
            defaultValue={defaults.dislikedIngredients.join(", ")}
            placeholder="mushrooms, olives"
          />
        </Field>
      </Reveal>

      <Reveal y={10} delay={0.05}>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-200">
          <input
            type="checkbox"
            name="prefersLeftovers"
            defaultChecked={defaults.prefersLeftovers}
            className="h-4 w-4 rounded border-white/20 bg-transparent accent-emerald-400"
          />
          Prefer planning leftovers / repeat meals
        </label>
      </Reveal>

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <Reveal y={10} delay={0.06}>
        <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} className="h-11 px-5">
          {isPending ? "Saving..." : saved ? "Saved" : "Save Household Preferences"}
        </Button>
        <p className="text-xs text-zinc-500">
          These preferences will be used to prefill planner and AI meal planning defaults.
        </p>
        </div>
      </Reveal>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="ml-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </label>
      {children}
      {error ? <p className="ml-1 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
