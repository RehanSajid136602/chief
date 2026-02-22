import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAllRecipes, getRecipeBySlug } from "@/lib/recipes";
import { ImageGallery } from "@/components/recipe/ImageGallery";
import { VideoEmbed } from "@/components/recipe/VideoEmbed";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/ui/Navbar";
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

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen pb-20">
        {/* Editorial Hero Section */}
        <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
          <ImageGallery images={recipe.images} title={recipe.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-12">
            <Container className="max-w-5xl">
              <div className="flex items-center justify-between mb-8">
                <Link href="/#recipes">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white bg-white/5 backdrop-blur-md rounded-full px-6"
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

              
              <div className="flex flex-wrap gap-3 mb-6">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="text-xs font-black uppercase tracking-[0.2em] px-3 py-1 bg-emerald-500 text-black rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-4 tracking-tighter">
                {recipe.title}
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-300 max-w-3xl leading-relaxed font-medium">
                {recipe.description}
              </p>
            </Container>
          </div>
        </section>

        <Container className="max-w-5xl mt-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column: Info & Ingredients */}
            <div className="lg:col-span-2 space-y-12">
              <div className="grid sm:grid-cols-2 gap-12">
                <section>
                  <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                    Ingredients
                  </h2>
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-start text-zinc-300 pb-4 border-b border-white/5 last:border-0 group cursor-default"
                      >
                        <span className="mr-4 w-5 h-5 rounded-full border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="font-medium">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                    Instructions
                  </h2>
                  <ol className="space-y-8">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-6 group">
                        <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 flex items-center justify-center font-black italic shadow-xl group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                          {index + 1}
                        </span>
                        <p className="text-zinc-300 pt-1 leading-relaxed font-medium">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
              
              {recipe.youtubeVideoUrl && (
                <section>
                  <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                    Watch it being made
                  </h2>
                  <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <VideoEmbed
                      youtubeUrl={recipe.youtubeVideoUrl}
                      title={recipe.title}
                    />
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Recipe Sidebar */}
            <div className="space-y-8">
              <aside className="premium-card rounded-[2rem] p-8 sticky top-28">
                <h3 className="text-xl font-black text-white mb-8 tracking-tight">Recipe Details</h3>
                <div className="space-y-6">
                  {[
                    { label: "Servings", value: recipe.servings, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
                    { label: "Prep Time", value: `${recipe.prepTime} min`, icon: "M12 8v4l3 3" },
                    { label: "Cook Time", value: `${recipe.cookTime} min`, icon: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" },
                    { label: "Total Time", value: `${recipe.totalTime} min`, icon: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" },
                    { label: "Calories", value: `${recipe.caloriesPerServing} kcal`, icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center group/item hover:bg-white/5 p-3 -m-3 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover/item:bg-emerald-500 group-hover/item:text-black transition-colors">
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
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-sm font-black text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                {recipe.sourceUrl && (
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-3 h-14 w-full bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-xl"
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
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

