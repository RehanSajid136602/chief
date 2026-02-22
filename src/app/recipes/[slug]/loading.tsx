import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/ui/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeLoading() {
  return (
    <>
      <Navbar session={null} />
      <main className="min-h-screen pt-20 pb-12">
        <Container className="max-w-4xl">
          {/* Back Button Skeleton */}
          <Skeleton className="h-9 w-32 mb-6 bg-zinc-800" />

          {/* Title and Description Skeleton */}
          <Skeleton className="h-10 w-3/4 md:w-1/2 mb-4 bg-zinc-800" />
          <Skeleton className="h-6 w-full max-w-2xl mb-6 bg-zinc-800" />

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-6 w-16 rounded-full bg-zinc-800" />
            <Skeleton className="h-6 w-20 rounded-full bg-zinc-800" />
            <Skeleton className="h-6 w-24 rounded-full bg-zinc-800" />
          </div>

          {/* Main Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image Skeleton */}
            <div className="w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden relative">
               <Skeleton className="absolute inset-0 w-full h-full bg-zinc-800" />
            </div>

            {/* Recipe Info Skeleton */}
            <div className="space-y-6">
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <Skeleton className="h-7 w-32 mb-4 bg-zinc-800" />
                <dl className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-5 w-24 bg-zinc-800" />
                      <Skeleton className="h-5 w-16 bg-zinc-800" />
                    </div>
                  ))}
                </dl>
              </div>
              
              {/* Optional Video Skeleton */}
              <div>
                 <Skeleton className="h-7 w-32 mb-4 bg-zinc-800" />
                 <Skeleton className="w-full aspect-video rounded-lg bg-zinc-800" />
              </div>
            </div>
          </div>

          {/* Lists Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <Skeleton className="h-7 w-32 mb-4 bg-zinc-800" />
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-5 w-full bg-zinc-800" />
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <Skeleton className="h-7 w-32 mb-4 bg-zinc-800" />
              <ol className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-800" />
                    <Skeleton className="h-16 w-full bg-zinc-800" />
                  </div>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
