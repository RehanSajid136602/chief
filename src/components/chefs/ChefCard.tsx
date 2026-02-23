import Link from "next/link";
import type { ChefProfile } from "@/lib/types/chef";

export function ChefCard({ chef }: { chef: ChefProfile }) {
  const initials = chef.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="surface-panel rounded-2xl p-5 md:p-6 h-full flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-emerald-300/10 to-cyan-400/10 border border-emerald-300/20 flex items-center justify-center text-emerald-200 font-semibold">
          {initials}
        </div>
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-zinc-500">
            {chef.region} • {chef.country}
          </p>
          <h3 className="text-lg font-semibold text-zinc-100 leading-tight">{chef.name}</h3>
          <p className="text-sm text-zinc-400">{chef.specialty}</p>
        </div>
      </div>

      <p className="text-sm leading-6 text-zinc-300">{chef.shortBio}</p>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-zinc-500 mb-1">Notable For</p>
        <p className="text-sm text-zinc-200 leading-6">{chef.notableFor}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {chef.links.official ? (
          <Link
            href={chef.links.official}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Official
          </Link>
        ) : null}
        {chef.links.wikipedia ? (
          <Link
            href={chef.links.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Profile
          </Link>
        ) : null}
        {chef.links.instagram ? (
          <Link
            href={chef.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Instagram
          </Link>
        ) : null}
      </div>
    </article>
  );
}
