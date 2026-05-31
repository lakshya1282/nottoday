"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--accent)] text-black",
    secondary: "bg-white text-black",
    danger: "bg-red-400 text-black",
    success: "bg-[var(--success)] text-black",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
    xl: "px-10 py-6 text-3xl w-full",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95, y: 4, x: 4, boxShadow: "0px 0px 0px var(--border)" }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        "neo-border neo-shadow",
        className
      )}
      style={{
        boxShadow: "8px 8px 0px var(--border)",
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
