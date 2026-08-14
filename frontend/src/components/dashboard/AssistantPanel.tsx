import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import api from "../../services/api";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AssistantPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello 👋 I'm InvestIQ AI. Ask me anything about your portfolio.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * Reference to the scrolling chat container
   */
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Analyze my portfolio",
    "Should I diversify?",
    "Which stock is riskiest?",
  ];

  async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /*
   * Automatically keep the AI chat at the bottom
   * while the response is being generated.
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendQuestion(text?: string) {
    const q = text ?? question;

    if (!q.trim() || loading) return;

    /*
     * Add user's question
     */
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: q,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      let answer = "";
      let success = false;

      /*
       * Retry up to 3 times
       */
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await api.post("/assistant/", {
            question: q,
          });

          answer = res.data?.answer || "";

          /*
           * Check if backend returned Gemini 503
           */
          const isGeminiUnavailable =
            answer.includes("503") ||
            answer.includes("UNAVAILABLE") ||
            answer.includes("currently experiencing high demand") ||
            answer.includes("Gemini Error");

          if (!isGeminiUnavailable) {
            success = true;
            break;
          }

          /*
           * Wait before retrying
           */
          if (attempt < 3) {
            await wait(attempt * 1500);
          }
        } catch (error: any) {
          console.error(
            `AI request attempt ${attempt} failed:`,
            error
          );

          if (attempt < 3) {
            await wait(attempt * 1500);
          }
        }
      }

      if (success) {
        /*
         * Add an empty assistant message first.
         *
         * We will fill it progressively below.
         */
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "",
          },
        ]);

        /*
         * Generate the answer progressively.
         */
        let currentText = "";

        for (let i = 0; i < answer.length; i++) {
          currentText += answer[i];

          setMessages((prev) => {
            const updated = [...prev];

            updated[updated.length - 1] = {
              role: "assistant",
              text: currentText,
            };

            return updated;
          });

          /*
           * Small delay between characters.
           *
           * Increase this number for slower generation.
           * Decrease it for faster generation.
           */
          await wait(12);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              "🤖 The AI service is temporarily busy. Please try again in a moment.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        flex
        h-[600px]
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-[#0B1222]/80
        backdrop-blur-xl
        scrollbar-thumb-indigo-100
      "
    >
      {/* ================= HEADER ================= */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-4
          border-b
          border-white/10
          p-5
        "
      >
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-blue-500
            to-violet-600
          "
        >
          <Bot size={25} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            InvestIQ AI
          </h2>

          <p className="text-sm text-slate-400">
            Your AI Investment Copilot - Powered by Google Gemini
          </p>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}

      <div
        ref={chatContainerRef}
        className="
          min-h-0
          flex-1
          space-y-4
          overflow-y-auto
          px-5
          py-5
        "
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`w-fit max-w-[90%] break-words rounded-2xl px-4 py-3 text-sm ${
              msg.role === "assistant"
                ? "bg-white/5 text-slate-200"
                : "ml-auto bg-blue-600 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Loading indicator */}

        {loading && (
          <div
            className="
              w-fit
              rounded-2xl
              bg-white/5
              px-4
              py-3
              text-sm
              text-slate-400
            "
          >
            <span className="animate-pulse">
              Thinking...
            </span>
          </div>
        )}
      </div>

      {/* ================= SUGGESTIONS ================= */}

      <div
        className="
          mb-4
          flex
          shrink-0
          flex-wrap
          gap-2
          px-4
        "
      >
        {suggestions.map((item) => (
          <button
            key={item}
            disabled={loading}
            onClick={() => sendQuestion(item)}
            className="
              flex
              w-fit
              items-center
              gap-1
              rounded-full
              border
              border-white/10
              bg-white/5
              px-3
              py-2
              text-xs
              text-slate-300
              transition
              hover:bg-blue-600
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Sparkles size={14} />
            {item}
          </button>
        ))}
      </div>

      {/* ================= INPUT ================= */}

      <div
        className="
          flex
          shrink-0
          gap-3
          border-t
          border-white/10
          p-4
        "
      >
        <input
          value={question}
          disabled={loading}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendQuestion();
            }
          }}
          placeholder={
            loading
              ? "AI is thinking..."
              : "Ask InvestIQ AI..."
          }
          className="
            min-w-0
            flex-1
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            text-white
            outline-none
            placeholder:text-slate-500
            focus:border-blue-500/50
            disabled:opacity-50
          "
        />

        <button
          onClick={() => sendQuestion()}
          disabled={loading || !question.trim()}
          className="
            shrink-0
            rounded-xl
            bg-blue-600
            px-4
            transition
            hover:bg-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}