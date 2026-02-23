import { describe, expect, it, vi } from "vitest";
import { filterKnownAiSuggestions } from "@/lib/ai/schemas";

describe("ai planner helpers", () => {
  it("filters unknown recipe suggestions", () => {
    const filtered = filterKnownAiSuggestions(
      [
        { dayOfWeek: 0, slot: "DINNER", recipeSlug: "known" },
        { dayOfWeek: 1, slot: "LUNCH", recipeSlug: "unknown" },
      ],
      new Set(["known"])
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].recipeSlug).toBe("known");
  });

  it("throws when GROQ_API_KEY is missing", async () => {
    vi.resetModules();
    const prior = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;
    const { groqChatJson } = await import("@/lib/ai/groq");
    await expect(groqChatJson({ system: "s", user: "u" })).rejects.toThrow(/GROQ_API_KEY/i);
    if (prior) process.env.GROQ_API_KEY = prior;
  });
});
