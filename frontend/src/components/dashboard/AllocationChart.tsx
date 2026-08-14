import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type Holding = {
  id: number;
  ticker: string;
  shares: number;
  current_price: number;
  market_value: number;
};

type Props = {
  data: Holding[];
};

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];

export default function AllocationChart({ data }: Props) {
  const totalValue = data.reduce(
    (total, stock) => total + stock.market_value,
    0
  );

  const chartData = data.map((stock) => ({
    name: stock.ticker,
    value: stock.market_value,
    percentage:
      totalValue > 0
        ? (stock.market_value / totalValue) * 100
        : 0,
  }));

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Portfolio Allocation
        </h2>

        <p className="mt-2 text-slate-400">
          Distribution of your portfolio by market value
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-slate-500">
          No investments added yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={115}
              innerRadius={65}
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#09111F",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "16px",
                color: "#fff",
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={40}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}