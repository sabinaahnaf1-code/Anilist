import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 border-4 border-brand-primary/30 border-t-brand-primary rounded-full shadow-lg shadow-brand-primary/20"
      />
      <p className="text-slate-400 font-medium animate-pulse">Summoning anime data...</p>
    </div>
  );
}
