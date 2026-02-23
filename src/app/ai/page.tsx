import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { auth } from "@/auth";
import { AIClientPage } from "./AIClientPage";
import { findUserByEmail } from "@/lib/users";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Ingredient Matcher - RecipeHub",
  description:
    "Find recipes based on ingredients you have with our smart ingredient matcher.",
};

export default async function AIPage() {
  const session = await auth();
  let favorites: string[] = [];
  if (session?.user?.email) {
    const user = await findUserByEmail(session.user.email);
    favorites = user?.favorites || [];
  }

  return (
    <>
      <Navbar session={session} />
      <AIClientPage favorites={favorites} />
    </>
  );
}
