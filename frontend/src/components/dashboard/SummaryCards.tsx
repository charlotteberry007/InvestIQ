import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  change?: string;
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  color = "text-blue-400",
  change = "",
}: SummaryCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.25 }}
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-gradient-to-br
        from-[#0B1222]/85
        to-[#09111F]/70
        backdrop-blur-xl
        p-7
        h-[220px]
        flex
        flex-col
        justify-between
        shadow-xl
        shadow-black/20
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -right-8
          -top-8
          h-32
          w-32
          rounded-full
          bg-blue-500/10
          blur-3xl
        "
      />

      {/* Header */}

      <div className="relative z-10 flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-400 tracking-wide">
            {title}
          </p>

        </div>

        <div
          className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/5
            border
            border-white/10
            ${color}
          `}
        >
          <Icon size={24} />
        </div>

      </div>

      {/* Value */}

      <div className="relative z-10">

        <h2 className="text-5xl font-black tracking-tight">
          {value}
        </h2>

        {change && (
          <p className="mt-3 text-sm font-medium text-emerald-400">
            {change}
          </p>
        )}

        <div className="mt-5 h-px w-full bg-white/5" />

        <p className="mt-4 text-xs tracking-wide text-slate-500 uppercase">
          Live Portfolio Data
        </p>

      </div>

    </motion.div>
  );
}