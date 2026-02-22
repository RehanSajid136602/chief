import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { auth } from "@/auth";
import { AIClientPage } from "./AIClientPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Ingredient Matcher - RecipeHub",
  description:
    "Find recipes based on ingredients you have with our smart ingredient matcher.",
};

export default async function AIPage() {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <AIClientPage />
    </>
  );
}
