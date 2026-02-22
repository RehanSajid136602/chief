import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecipeHub - Discover Delicious Recipes",
  description:
    "Explore our curated collection of amazing recipes. Find exactly what you're looking for with our smart ingredient matcher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
