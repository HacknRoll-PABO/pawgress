import { motion } from "framer-motion";

export function HeroHighlight({ children }) {
  return (
    <div className="relative w-full">
      <div className="relative">{children}</div>
    </div>
  );
}

export function Highlight({ children, className = "" }) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`relative inline-block bg-gradient-to-r from-orange-500/20 to-orange-400/20 bg-no-repeat rounded-md px-1 ${className}`}
      style={{ backgroundPosition: "0 100%" }}
    >
      {children}
    </motion.span>
  );
} 