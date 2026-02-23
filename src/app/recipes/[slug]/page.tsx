import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAllRecipes, getRecipeBySlug } from "@/lib/recipes";
import { ImageGallery } from "@/components/recipe/ImageGallery";
import { getYouTubeVideoId, VideoEmbed } from "@/components/recipe/VideoEmbed";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/ui/Navbar";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/users";
import { FavoriteButton } from "@/components/recipe/FavoriteButton";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const recipes = getAllRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  return {
    title: `${recipe.title} - RecipeHub`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: [recipe.images[0]],
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  const session = await auth();

  if (!recipe) {
    notFound();
  }

  let isFavorite = false;
  if (session?.user?.email) {
    const user = await findUserByEmail(session.user.email);
    isFavorite = user?.favorites?.includes(slug) || false;
  }
  const recipeVideoId = getYouTubeVideoId(recipe.youtubeVideoUrl);

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pb-20">
        {/* Editorial Hero Section */}
        <section className="relative h-[56vh] md:h-[68vh] w-full overflow-hidden">
          <ImageGallery images={recipe.images} title={recipe.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-12">
            <Container className="max-w-5xl">
              <Reveal y={14}>
                <div className="flex items-center justify-between mb-6">
                  <Link href="/#recipes">
                    <Button
                      variant="ghost"
                      size="sm"
                        className="text-zinc-300 hover:text-white bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-full px-5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Back to collection
                    </Button>
                  </Link>

                  <FavoriteButton 
                    recipeSlug={slug}
                    initialIsFavorite={isFavorite}
                    className="bg-white/10 backdrop-blur-md"
                  />
                </div>

                
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 bg-white/[0.06] border border-white/[0.08] text-zinc-200 rounded-md reveal-on-mount">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-6xl font-semibold text-white leading-tight mb-3 tracking-tight">
                  {recipe.title}
                </h1>
                
                <p className="text-base md:text-lg text-zinc-300 max-w-3xl leading-7">
                  {recipe.description}
                </p>
              </Reveal>
            </Container>
          </div>
        </section>

        <Container className="max-w-5xl mt-10">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Left Column: Info & Ingredients */}
            <Reveal className="lg:col-span-2 space-y-12" y={16}>
              <div className="grid sm:grid-cols-2 gap-8 md:gap-10">
                <section className="reveal-on-mount">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                    <span className="w-6 h-px bg-white/20 rounded-full" />
                    Ingredients
                  </h2>
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-start text-zinc-300 pb-3 border-b border-white/[0.05] last:border-0 group cursor-default"
                      >
                        <span className="mr-3 w-5 h-5 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                        </span>
                        <span className="font-medium leading-6">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="reveal-on-mount" style={{ ["--reveal-delay" as string]: "50ms" }}>
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                    <span className="w-6 h-px bg-white/20 rounded-full" />
                    Instructions
                  </h2>
                  <ol className="space-y-6">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-6 group">
                        <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-200 flex items-center justify-center font-semibold transition-colors">
                          {index + 1}
                        </span>
                        <p className="text-zinc-300 pt-1 leading-7">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
              
              {recipeVideoId && (
                <section className="reveal-on-mount" style={{ ["--reveal-delay" as string]: "90ms" }}>
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                    <span className="w-6 h-px bg-white/20 rounded-full" />
                    Watch it being made
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_16px_32px_rgba(0,0,0,0.28)]">
                    <VideoEmbed
                      youtubeUrl={recipe.youtubeVideoUrl}
                      title={recipe.title}
                    />
                  </div>
                </section>
              )}
            </Reveal>

            {/* Right Column: Recipe Sidebar */}
            <Reveal className="space-y-8" y={16} delay={0.03}>
              <aside className="surface-panel rounded-2xl p-6 sticky top-28">
                <h3 className="text-lg font-semibold text-white mb-6 tracking-tight">Recipe Details</h3>
                <div className="space-y-6">
                  {[
                    { label: "Servings", value: recipe.servings, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
                    { label: "Prep Time", value: `${recipe.prepTime} min`, icon: "M12 8v4l3 3" },
                    { label: "Cook Time", value: `${recipe.cookTime} min`, icon: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" },
                    { label: "Total Time", value: `${recipe.totalTime} min`, icon: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" },
                    { label: "Calories", value: `${recipe.caloriesPerServing} kcal`, icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center group/item hover:bg-white/[0.03] p-2.5 -m-2.5 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover/item:text-white transition-colors">
                          <svg
                             xmlns="http://www.w3.org/2000/svg"
                             width="16"
                             height="16"
                             viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor"
                             strokeWidth="2.5"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           >
                             <path d={item.icon} />
                           </svg>
                        </div>
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.1em]">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                {recipe.sourceUrl && (
                  <div className="mt-8 pt-6 border-t border-white/[0.06]">
                    <Link href="/dashboard/planner" className="mb-3 block">
                      <Button className="h-11 w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold">
                        Add to Planner
                      </Button>
                    </Link>
                    <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-3 h-11 w-full bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-colors"
                    >
                      Original Recipe
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  </div>
                )}
              </aside>
            </Reveal>
          </div>
        </Container>
      </main>
    </>
  );
}
