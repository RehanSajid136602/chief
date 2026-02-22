import { Navbar } from "@/components/ui/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/Container";
import { RecipeGridSkeleton } from "@/components/recipe/RecipeGrid";

export default function Loading() {
  return (
    <>
      <Navbar session={null} />
      <main className="min-h-screen pt-16">
        <section className="h-[60vh] min-h-[500px] flex items-center justify-center relative overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 z-0">
            <Skeleton className="w-full h-full object-cover opacity-60 rounded-none" />
          </div>
          <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto px-4 w-full">
            <Skeleton className="h-16 w-3/4 max-w-2xl mx-auto bg-white/10" />
            <Skeleton className="h-6 w-2/3 max-w-xl mx-auto bg-white/10" />
            <div className="flex justify-center gap-4 pt-4">
              <Skeleton className="h-12 w-32 bg-emerald-500/20" />
              <Skeleton className="h-12 w-32 bg-white/10" />
            </div>
          </div>
        </section>

        <Container className="py-12">
          <Skeleton className="h-8 w-48 mb-8 bg-zinc-800" />
          <RecipeGridSkeleton count={6} />
        </Container>
      </main>
    </>
  );
}
