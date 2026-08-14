import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

type Props = {
  title: string;
  value: string;
  definition: string;
};

export default function RiskCard({
  title,
  value,
  definition
}: Props) {
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
        from-[#0B1222]/80
        to-[#09111F]/70
        backdrop-blur-xl
        p-8
        min-h-[190px]
        shadow-xl
        shadow-black/20
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -top-10
          -right-10
          h-40
          w-40
          rounded-full
          bg-blue-500/10
          blur-[90px]
        "
      />

      {/* Header */}

      <div className="relative z-10 flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {title}
          </p>

        </div>

        <div
          className="
            h-12
            w-12
            rounded-2xl
            border
            border-blue-500/20
            bg-blue-500/10
            flex
            items-center
            justify-center
            text-blue-400
          "
        >
          <ShieldCheck size={20} />
        </div>

      </div>

      {/* Value */}

      <div className="relative z-10 mt-8">

        <h2
          className="
            text-5xl
            font-black
            tracking-tight
            text-white
          "
        >
          {value}
        </h2>

        <div className="mt-6 h-px bg-white/10" />

      <p className="mt-4 text-sm text-slate-500">
          {definition}
        </p>

      </div>

    </motion.div>
  );
}