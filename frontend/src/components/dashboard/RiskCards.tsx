import { useEffect, useState } from "react";
import api from "../../services/api";
import RiskCard from "./RiskCard";

type RiskData = {
  annual_return: number;
  annual_volatility: number;
  sharpe_ratio: number;
  value_at_risk_95: number;
  maximum_drawdown: number;
};

type Props = {
  refreshKey: string;
};

export default function RiskCards({ refreshKey }: Props) {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadRisk() {
    try {
      setLoading(true);

      const response = await api.get("/risk/portfolio");

      console.log("Risk data:", response.data);

      setRisk(response.data);
    } catch (error) {
      console.error("Risk loading failed:", error);
      setRisk(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRisk();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6">
        <RiskCard title="Sharpe Ratio" value="..." definition="..." />
        <RiskCard title="Volatility" value="..." definition="..." />
        <RiskCard title="VaR (95%)" value="..." definition="..."/>
        <RiskCard title="Max Drawdown" value="..." definition="..."/>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <RiskCard
        title="Sharpe Ratio"
        value={
          risk
            ? risk.sharpe_ratio.toFixed(2)
            : "--"
        }
        definition="Measures the excess return generated per unit of portfolio risk."
      />

      <RiskCard
        title="Volatility"
        value={
          risk
            ? `${(risk.annual_volatility * 100).toFixed(2)}%`
            : "--"
        }
        definition="Measures the dispersion or variability of portfolio returns."
      />

      <RiskCard
        title="VaR (95%)"
        value={
          risk
            ? `${(risk.value_at_risk_95 * 100).toFixed(2)}%`
            : "--"
        }
        definition="Estimates the potential portfolio loss at a 95% confidence level over a specified time horizon."
      />

      <RiskCard
        title="Max Drawdown"
        value={
          risk
            ? `${(risk.maximum_drawdown * 100).toFixed(2)}%`
            : "--"
        }
        definition="Measures the largest peak-to-trough decline in portfolio value during a specified period."
      />
    </div>
  );
}