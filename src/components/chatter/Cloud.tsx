
import { cn } from "@/lib/utils";
import * as React from "react";
import { motion } from "framer-motion";

interface CloudProps {
  style: React.CSSProperties;
  className?: string;
}

export function Cloud({ style, className }: CloudProps) {
  return (
    <motion.div
      className={cn("absolute w-48 h-24 bg-white/50 rounded-full blur-md", className)}
      style={style}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.5 } }}
    >
      <div className="absolute w-24 h-24 bg-white/50 rounded-full -top-8 left-12" />
      <div className="absolute w-32 h-32 bg-white/50 rounded-full -bottom-8 right-8" />
    </motion.div>
  );
}
