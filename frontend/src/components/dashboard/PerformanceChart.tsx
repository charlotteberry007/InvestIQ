import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../services/api";

type HistoryPoint = {
  date: string;
  close: number;
};

type Props = {
  refreshKey?: string;
};

export default function PerformanceChart({
  refreshKey = "",
}: Props) {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      setLoading(true);

      const response = await api.get(
        "/market/portfolio/history"
      );

      console.log("Portfolio history:", response.data);

      setData(response.data);
    } catch (error) {
      console.error(
        "Portfolio history loading failed:",
        error
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, [refreshKey]);

  return (
    <div
      className="
        rounded-[30px]
        border
        border-white/10
        bg-[#0B1222]/75
        backdrop-blur-xl
        p-8
      "
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Portfolio Performance
        </h2>

        <p className="mt-2 text-slate-400">
          Historical portfolio value
        </p>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center text-slate-500">
          Loading performance...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-slate-500">
          No historical data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.5}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="rgba(255,255,255,.06)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />

            <YAxis
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `$${Number(value).toLocaleString()}`
              }
            />

            <Tooltip
              formatter={(value) =>
                `$${Number(value).toLocaleString()}`
              }
              contentStyle={{
                background: "#09111F",
                border:
                  "1px solid rgba(255,255,255,.08)",
                borderRadius: "16px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="close"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}