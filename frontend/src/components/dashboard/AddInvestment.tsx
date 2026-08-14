import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import api from "../../services/api";

type Stock = {
  ticker: string;
  company: string;
};

type Props = {
  onAdded: () => void;
};

export default function AddInvestment({
  onAdded,
}: Props) {
  const [query, setQuery] = useState("");
  const [shares, setShares] = useState("");

  const [results, setResults] = useState<Stock[]>([]);
  const [selected, setSelected] = useState<Stock | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2 || selected) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get("/stocks/search", {
          params: {
            q: query,
          },
        });

        setResults(res.data);

      } catch (err) {
        console.error(err);
      }

    }, 300);

    return () => clearTimeout(timer);

  }, [query, selected]);

  async function addInvestment() {

  if (!selected) {
    alert("Please select a stock.");
    return;
  }

  if (!shares || Number(shares) <= 0) {
    alert("Enter a valid number of shares.");
    return;
  }

  try {

    setLoading(true);

    const payload = {
      ticker: selected.ticker.trim().toUpperCase(),
      shares: Number(shares),
    };

    console.log("POST Payload:", payload);

    const res = await api.post("/portfolio/", payload);

    console.log("Portfolio Added:", res.data);

    setQuery("");
    setShares("");
    setSelected(null);
    setResults([]);

    await onAdded();

  } catch (err: any) {

    console.error(err);

    if (err.response) {

      alert(
        `Backend Error (${err.response.status})\n\n${JSON.stringify(
          err.response.data,
          null,
          2
        )}`
      );

    } else {

      alert(err.message);

    }

  } finally {

    setLoading(false);

  }

}

  return (

    <section
      className="
        rounded-[30px]
        border
        border-white/10
        bg-[#0B1222]/75
        backdrop-blur-xl
        p-8
      "
    >

      <h2 className="text-3xl font-bold">
        Add Investment
      </h2>

      <p className="text-slate-400 mt-2 mb-8">
        Search a company and add it to your portfolio.
      </p>

      <div className="grid xl:grid-cols-3 gap-6">

        {/* Search */}

        <div className="xl:col-span-2 relative">

          <div
            className="
              h-14
              rounded-2xl
              border
              border-white/10
              bg-white/5
              flex
              items-center
              px-5
            "
          >

            <Search
              size={20}
              className="text-slate-400"
            />

            <input
              value={query}
              onChange={(e) => {
                setSelected(null);
                setQuery(e.target.value);
              }}
              placeholder="Apple, Tesla, Microsoft..."
              className="
                ml-4
                bg-transparent
                outline-none
                w-full
              "
            />

          </div>

          {results.length > 0 && (

            <div
              className="
                absolute
                top-16
                left-0
                right-0
                rounded-2xl
                border
                border-white/10
                bg-[#09111F]
                overflow-hidden
                z-50
              "
            >

              {results.map((stock) => (

                <button
                  key={stock.ticker}
                  onClick={() => {

                    setSelected({
  ticker: stock.ticker,
  company: stock.company,
});

setQuery(stock.company);
                    setResults([]);

                  }}
                  className="
                    w-full
                    px-5
                    py-4
                    text-left
                    hover:bg-blue-500/10
                    border-b
                    border-white/5
                    last:border-none
                  "
                >

                  <p className="font-semibold">
                    {stock.company}
                  </p>

                  <p className="text-sm text-slate-400">
                    {stock.ticker}
                  </p>

                </button>

              ))}

            </div>

          )}

        </div>

        {/* Shares */}

        <input
          type="number"
          placeholder="Shares"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          className="
            h-14
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-5
            outline-none
          "
        />

      </div>

      <button
        onClick={addInvestment}
        disabled={loading}
        className="
          mt-8
          h-14
          px-8
          rounded-2xl
          bg-blue-600
          hover:bg-blue-500
          transition
          font-semibold
          flex
          items-center
          gap-3
        "
      >

        <Plus size={18} />

        {loading
          ? "Adding..."
          : "Add Investment"}

      </button>

    </section>

  );
}