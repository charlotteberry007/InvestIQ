import { Trash2 } from "lucide-react";
import api from "../../services/api";

type Holding = {
  id: number;
  ticker: string;
  company: string;
  shares: number;
  current_price: number;
  market_value: number;
  currency: string;
};

type Props = {
  data: Holding[];
  onDelete: () => Promise<void> | void;
};

export default function PortfolioTable({
  data,
  onDelete,
}: Props) {

  async function deleteHolding(id: number) {

    const confirmDelete = window.confirm(
      "Delete this investment?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/portfolio/${id}`);

      await onDelete();

    } catch (err) {

      console.error(err);

      alert("Unable to delete investment.");

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
        md:p-10
      "
    >

      {/* Header */}

      <div className="mb-10 flex items-end justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            Portfolio Holdings
          </h2>

          <p className="mt-2 text-slate-400">
            Live holdings from your portfolio
          </p>

        </div>

        <div
          className="
            rounded-full
            bg-blue-500/10
            px-4
            py-2
            text-sm
            text-blue-300
          "
        >
          {data.length} Holdings
        </div>

      </div>

      {data.length === 0 ? (

        <div
          className="
            flex
            h-56
            items-center
            justify-center
            rounded-3xl
            border
            border-dashed
            border-white/10
            text-slate-500
          "
        >
          No investments found.
        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-white/10">

                <th className="pb-5 text-left text-sm text-slate-400 pl-4">
                  Company
                </th>

                <th className="pb-5 text-center text-sm text-slate-400">
                  Shares
                </th>

                <th className="pb-5 text-center text-sm text-slate-400">
                  Price
                </th>

                <th className="pb-5 text-center text-sm text-slate-400">
                  Market Value
                </th>

                <th className="pb-5 text-center text-sm text-slate-400">
                  Delete
                </th>

              </tr>

            </thead>

            <tbody>

              {data.map((stock) => (

                <tr
                  key={stock.id}
                  className="
                    border-b
                    border-white/5
                    hover:bg-white/5
                    transition
                  "
                >

                  <td className="py-6 pl-3">

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          h-12
                          w-12
                          rounded-2xl
                          bg-blue-500/10
                          text-blue-400
                          flex
                          items-center
                          justify-center
                          font-bold
                        "
                      >
                        {stock.ticker[0]}
                      </div>

                      <div>

                        <p className="font-semibold">
                          {stock.company}
                        </p>

                        <p className="text-sm text-slate-500">
                          {stock.ticker}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="text-center">
                    {stock.shares}
                  </td>

                  <td className="text-center">
                    {stock.currency}{" "}
                    {stock.current_price.toFixed(2)}
                  </td>

                  <td className="text-center font-semibold text-blue-300">
                    {stock.currency}{" "}
                    {stock.market_value.toLocaleString()}
                  </td>

                  <td className="text-center">

                    <button
                      onClick={() => deleteHolding(stock.id)}
                      className="
                        h-10
                        w-10
                        rounded-xl
                        bg-red-500/10
                        hover:bg-red-500/20
                        text-red-400
                        transition
                        inline-flex
                        items-center
                        justify-center
                      "
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}