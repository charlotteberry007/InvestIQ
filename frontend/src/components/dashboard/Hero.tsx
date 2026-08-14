import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import stars from "../../assets/stars.png";
type Summary = {
  total_portfolio_value: number;
  total_holdings: number;
  largest_holding: string | null;
  largest_value: number;
  daily_gain: number;
};

type Props = {
  summary: Summary | null;
};

export default function Hero({ summary }: Props) {
  const portfolioValue =
    summary?.total_portfolio_value ?? 0;

  const dailyGain =
    summary?.daily_gain ?? 0;

  const holdings =
    summary?.total_holdings ?? 0;

  const largestHolding =
    summary?.largest_holding ?? "--";

  return (
    <section
      className="
        grid
        grid-cols-1
        xl:grid-cols-12
        gap-6
      "
    >
      
      {/* LEFT */}

      <div
        className="
          xl:col-span-8
          relative
          overflow-hidden
          rounded-[34px]
          border
          border-white/10
          bg-gradient-to-br
          from-[#0B1222]/85
          to-[#090F1C]/70
          backdrop-blur-2xl
          px-10
          md:px-14
          xl:px-16
          py-14
          min-h-[460px]
          pl-20
        "
      >
        {/* Glow */}

        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[160px]" />
        <img
          src={stars}
          alt=""
          className="
            absolute
            opacity-80
            pointer-events-none
            right-0
            top-100
            rotate-310
          "
        />
        <img
          src={stars}
          alt=""
          className="
            absolute
            opacity-80
            pointer-events-none
            right-0
          "
        />

        <div className="relative z-10 flex h-full flex-col justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              uppercase
              tracking-[0.45em]
              text-blue-400
              font-semibold
              text-sm 
            "
          >
            INVESTIQ
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              mt-6
              max-w-3xl
              text-5xl
              md:text-6xl
              xl:text-7xl
              font-black
              leading-[1.02]
              tracking-tight
            "
          >
            Smart Portfolio
            <br />
            Tracker
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="
              mt-8
              max-w-2xl
              text-lg
              md:text-xl
              leading-9
              text-slate-300
            "
          >
            Track, analyze and optimize your investments using AI-powered portfolio 
            analytics, risk assessment and uncover market value  real-time.

          </motion.p>

          <div className="mt-12 flex flex-wrap gap-5">
            <button
            onClick={() => {
    document
      .getElementById("add-investment")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
              className="
                h-14
                px-8
                rounded-2xl
                bg-blue-600
                hover:bg-blue-500
                shadow-xl
                shadow-blue-600/30
                transition-all
                font-semibold
                text-lg
                flex
                items-center
                gap-3
              "
            >
              <Plus size={20} />
              Add Investment
            </button>

            <button
            onClick={() => {
    document
      .getElementById("ai-assistant")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
              className="
                h-14
                px-8
                rounded-2xl
                border
                border-white/10
                bg-white/5
                hover:bg-white/10
                transition-all
                font-semibold
                text-lg
                flex
                items-center
                gap-3
              "
            >
              Ask AI
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SUMMARY CARDS */}

      <div className="xl:col-span-4 grid grid-cols-2 gap-6">
        {/* Portfolio Value */}

        <SummaryBox
          title="Portfolio Value"
          value={`$${portfolioValue.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
        />

        {/* Today's Gain */}

        <SummaryBox
          title="Today's Gain"
          value={`$${dailyGain.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          valueClass={
            dailyGain >= 0
              ? "text-green-400"
              : "text-red-400"
          }
        />

        {/* Holdings */}

        <SummaryBox
          title="Holdings"
          value={holdings.toString()}
        />

        {/* Largest Holding */}

        <SummaryBox
          title="Largest Holding"
          value={largestHolding}
          subtitle={
            summary
              ? `$${summary.largest_value.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`
              : "Live portfolio data"
          }
        />
      </div>
    </section>
  );
}

/* SUMMARY CARD */

type SummaryBoxProps = {
  title: string;
  value: string;
  subtitle?: string;
  valueClass?: string;
};

function SummaryBox({
  title,
  value,
  subtitle = "Live portfolio data",
  valueClass = "text-white",
}: SummaryBoxProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-[28px]
        border
        border-white/10
        bg-[#0B1222]/70
        backdrop-blur-xl
        p-7
        h-[220px]
        flex
        flex-col
        justify-between
        overflow-hidden
      "
    >
      <div>
        <p className="text-slate-400 text-sm">
          {title}
        </p>

        <h2
          className={`
            mt-4
            text-3xl
            xl:text-4xl
            font-bold
            break-words
            ${valueClass}
          `}
        >
          {value}
        </h2>
      </div>

      <p className="text-sm text-slate-500">
        {subtitle}
      </p>
    </motion.div>
  );
}