"use client";

import { type AnimationProps, type MotionProps, motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

const animationProps = {
  animate: { "--x": "-100%", scale: 1 },
  initial: { "--x": "100%", scale: 0.8 },
  transition: {
    damping: 15,
    mass: 2,
    repeat: Number.POSITIVE_INFINITY,
    repeatDelay: 1,
    repeatType: "loop",
    scale: {
      damping: 5,
      mass: 0.5,
      stiffness: 200,
      type: "spring",
    },
    stiffness: 20,
    type: "spring",
  },
  whileTap: { scale: 0.95 },
} as AnimationProps;

interface ShinyButtonProps
  extends MotionProps,
    Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative rounded-lg px-2 py-1 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]",
          className
        )}
        {...animationProps}
        {...props}
      >
        <span
          className="relative block size-full text-[rgb(0,0,0,65%)] text-sm uppercase tracking-wide dark:font-light dark:text-[rgb(255,255,255,90%)]"
          style={{
            maskImage:
              "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
          }}
        >
          {children}
        </span>
        <span
          className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
          style={{
            mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
            maskComposite: "exclude",
          }}
        />
      </motion.button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";
