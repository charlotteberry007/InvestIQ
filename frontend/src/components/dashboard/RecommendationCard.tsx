import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import api from "../../services/api";

type Props = {
  refreshKey?: string;
};

export default function RecommendationCard({
  refreshKey = "",
}: Props) {
  const [recommendation, setRecommendation] =
    useState("");

  const [loading, setLoading] = useState(true);

  async function loadRecommendation() {
    try {
      setLoading(true);

      const response = await api.get(
        "/recommendation/"
      );

      console.log(
        "Recommendation:",
        response.data
      );

      setRecommendation(
        response.data.recommendation ?? 
        "No recommendation available."
      );
    } catch (error) {
      console.error(
        "Recommendation loading failed:",
        error
      );

      setRecommendation(
        "Unable to generate a recommendation right now."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecommendation();
  }, [refreshKey]);

  return (
    <div
      className="
        rounded-[30px]
        border
        border-white/10
        bg-gradient-to-br
        from-[#0B1222]/90
        to-[#10152A]/80
        backdrop-blur-xl
        p-8
      "
    >
      {/* Header */}

      <div className="flex items-center gap-4">

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-blue-500/10
            text-blue-400
          "
        >
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Quick Suggestion
          </h2>

          <p className="text-sm text-slate-400">
            Personalized portfolio insight
          </p>
        </div>

      </div>

      {/* Recommendation */}

      <div className="mt-6 rounded-2xl bg-white/5 p-6">

        {loading ? (

          <div className="flex items-center gap-3 text-slate-400">

            <div
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-blue-400
                border-t-transparent
              "
            />

            Analyzing your portfolio...

          </div>

        ) : (

          <p className="leading-7 text-slate-300">
            {recommendation}
          </p>

        )}

      </div>

    </div>
  );
}