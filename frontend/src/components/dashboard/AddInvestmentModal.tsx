import { useState } from "react";
import { X, Plus } from "lucide-react";

/*import type StockSearch from "./StockSearch";*/
import api from "../../services/api";

type Stock = {
  ticker: string;
  company: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddInvestmentModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function addInvestment() {
    if (!selectedStock) {
      alert("Please select a stock.");
      return;
    }

    if (!shares || Number(shares) <= 0) {
      alert("Enter valid shares.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/portfolio/", {
        ticker: selectedStock.ticker,
        shares: Number(shares),
      });

      setSelectedStock(null);
      setShares("");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to add investment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="glass glow w-full max-w-xl rounded-3xl p-8">

        {/* Header */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl font-bold">
              Add Investment
            </h2>

            <p className="text-slate-400 mt-1">
              Search a stock and add it to your portfolio.
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* Search */}

      

        {/* Selected */}

        {selectedStock && (

          <div className="mt-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4">

            <p className="font-semibold">

              {selectedStock.company}

            </p>

            <p className="text-sm text-blue-300">

              {selectedStock.ticker}

            </p>

          </div>

        )}

        {/* Shares */}

        <div className="mt-6">

          <label className="text-sm text-slate-400">

            Number of Shares

          </label>

          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="10"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#101827]
              px-4
              py-3
              outline-none
            "
          />

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-white/10"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={addInvestment}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-500
              transition
              flex
              items-center
              gap-2
            "
          >
            <Plus size={18} />

            {loading ? "Adding..." : "Add Investment"}

          </button>

        </div>

      </div>

    </div>
  );
}