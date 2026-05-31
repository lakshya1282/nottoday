"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-[var(--card)] p-6 neo-border neo-shadow",
          className
        )}
        style={{
          boxShadow: "8px 8px 0px var(--border)",
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
