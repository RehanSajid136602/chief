"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 1, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
            AI-Powered Culinary Magic
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 1, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8"
        >
          Master the Art of <br />
          <span className="text-gradient-emerald">Perfect Cooking</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Transform your kitchen ingredients into gourmet masterpieces with our 
          intelligent recipe engine. Professional taste, matched to your pantry.
        </motion.p>

        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link href="/ai">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-14 px-10 text-lg rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:scale-105 transition-all"
            >
              Try AI Matcher
            </Button>
          </Link>
          <Link href="/#recipes">
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 h-14 px-10 text-lg rounded-2xl transition-all"
            >
              Explore Recipes
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Hero Visual Element */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050505] to-transparent z-10" />
    </section>
  );
}
