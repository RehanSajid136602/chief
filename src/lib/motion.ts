import type { Transition, Variants } from "framer-motion";

export const MOTION_EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATIONS = {
  fast: 0.22,
  base: 0.38,
  slow: 0.55,
} as const;

export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.15,
} as const;

export function revealTransition(delay = 0): Transition {
  return {
    duration: MOTION_DURATIONS.slow,
    ease: MOTION_EASE_OUT,
    delay,
  };
}

export function fadeUpVariants(
  reducedMotion: boolean,
  options?: { distance?: number; delay?: number }
): Variants {
  const distance = reducedMotion ? 0 : (options?.distance ?? 16);
  const delay = reducedMotion ? 0 : (options?.delay ?? 0);

  return {
    hidden: {
      opacity: reducedMotion ? 1 : 0,
      y: distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: revealTransition(delay),
    },
  };
}

export function fadeInVariants(
  reducedMotion: boolean,
  options?: { delay?: number }
): Variants {
  const delay = reducedMotion ? 0 : (options?.delay ?? 0);

  return {
    hidden: {
      opacity: reducedMotion ? 1 : 0,
    },
    visible: {
      opacity: 1,
      transition: revealTransition(delay),
    },
  };
}

export function staggerParentVariants(
  reducedMotion: boolean,
  options?: { stagger?: number; delayChildren?: number }
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : (options?.stagger ?? 0.08),
        delayChildren: reducedMotion ? 0 : (options?.delayChildren ?? 0),
      },
    },
  };
}
