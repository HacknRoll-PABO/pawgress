import React from "react";

export const AuroraBackground = ({ children }) => {
  return (
    <div className="h-full w-full bg-white dark:bg-neutral-950 relative flex flex-col items-center justify-center">
      {/* Aurora background with gradients */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(255, 237, 213, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 237, 213, 0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-aurora"
          style={{
            maskImage: "radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}; 