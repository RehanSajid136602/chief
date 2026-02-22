"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/ai", label: "AI Matcher" },
    ...(session ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];


  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-black/80 backdrop-blur-xl border-white/5 py-3 shadow-2xl" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <span className="text-black font-black text-xs">RH</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Recipe<span className="text-emerald-400">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-all hover:text-emerald-400 relative py-1",
                    pathname === link.href
                      ? "text-emerald-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-emerald-400"
                      : "text-zinc-400"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="h-4 w-px bg-white/10 mx-2" />

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-zinc-300 hover:text-white hover:bg-white/5 rounded-full px-4"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-300 hover:text-white hover:bg-white/5 rounded-full px-4"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full px-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#050505] border-white/10">
              <div className="flex flex-col space-y-6 mt-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-2xl font-bold tracking-tight transition-colors hover:text-emerald-400",
                      pathname === link.href
                        ? "text-emerald-400"
                        : "text-zinc-100"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-6 border-t border-white/10">
                  {session ? (
                    <div className="flex flex-col space-y-6">
                      <p className="text-sm text-zinc-500">
                        {session.user?.name || session.user?.email}
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => signOut()}
                        className="justify-start text-xl font-bold p-0 hover:bg-transparent hover:text-emerald-400"
                      >
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-xl font-bold p-0 hover:bg-transparent hover:text-emerald-400"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 rounded-xl">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

