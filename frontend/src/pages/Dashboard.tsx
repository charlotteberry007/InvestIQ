import { useEffect, useState } from "react";

import api from "../services/api";

import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";

import RecommendationCard from "../components/dashboard/RecommendationCard";
import Hero from "../components/dashboard/Hero";
import AddInvestment from "../components/dashboard/AddInvestment";
import AllocationChart from "../components/dashboard/AllocationChart";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import PortfolioTable from "../components/dashboard/PortfolioTable";
import AssistantPanel from "../components/dashboard/AssistantPanel";
import RiskCards from "../components/dashboard/RiskCards";

type Holding = {
  id: number;
  ticker: string;
  company: string;
  currency: string;
  shares: number;
  current_price: number;
  market_value: number;
};

type Summary = {
  total_portfolio_value: number;
  total_holdings: number;
  largest_holding: string | null;
  largest_value: number;
  daily_gain: number;
};

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

async function loadDashboard() {
  try {
    setLoading(true);

    const [
      portfolioResponse,
      summaryResponse,
    ] = await Promise.all([
      api.get("/portfolio/"),
      api.get("/portfolio/summary"),
    ]);

    setPortfolio(portfolioResponse.data);
    setSummary(summaryResponse.data);

  } catch (error) {
    console.error(
      "Dashboard loading failed:",
      error
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
   * This changes whenever the portfolio changes.
   * Components such as RiskCards, PerformanceChart
   * and RecommendationCard use it to refresh themselves.
   */
  const refreshKey = portfolio
    .map(
      (stock) =>
        `${stock.id}-${stock.shares}-${stock.market_value}`
    )
    .join("|");

  return (
    <>
      <Background />

      <Navbar />

      <main
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1800px]
          px-5
          md:px-8
          xl:px-14
          2xl:px-10
          py-12
        "
      >
        {/* HERO */}

        <Hero summary={summary} />

        {/* ADD INVESTMENT */}
        <section
          id="add-investment"
          className="mt-16"
        >
          <AddInvestment
            onAdded={loadDashboard}
          />
        </section>

        {/* ANALYTICS */}

        <section
          id="analytics"
          className="
            mt-12
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-8
          "
        >
          <AllocationChart
            data={portfolio}
          />

          <PerformanceChart
            refreshKey={refreshKey}
          />
        </section>

        {/* PORTFOLIO */}

        <section
          id="portfolio"
          className="mt-16"
        >
          <PortfolioTable
            data={portfolio}
            onDelete={loadDashboard}
          />
        </section>

        {/* RISK + AI */}

        <section
          id="ai-assistant"
          className="
            mt-16
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-8
          "
        >
          <RiskCards
            refreshKey={refreshKey}
          />

          <AssistantPanel />
        </section>

        {/* AI RECOMMENDATION */}

        <section
          className="
            mt-8
            pb-5
          "
        >
          <RecommendationCard
            refreshKey={refreshKey}
          />
        </section>
      </main>
    </>
  );
}