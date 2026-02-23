"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { REVEAL_VIEWPORT, fadeInVariants, fadeUpVariants } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  variant?: "fade" | "fade-up";
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  variant = "fade-up",
}: RevealProps) {
  const reducedMotion = useReducedMotion() ?? false;

  const variants =
    variant === "fade"
      ? fadeInVariants(reducedMotion, { delay })
      : fadeUpVariants(reducedMotion, { distance: y, delay });

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
