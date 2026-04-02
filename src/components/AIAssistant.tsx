import { useState, useRef, useEffect } from "react";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { MessageSquare, Send, X, Sparkles, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  calories: number;
  protein: number;
  image: string;
}

interface Message {
  role: "user" | "model";
  text: string;
}

interface AIAssistantProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function AIAssistant({ menuItems, onAddToCart }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "您好！我是阿爸的家園 AI 營養小助手。我可以根據您的健康需求，為您推薦最適合的營養便當。請問您今天有什麼樣的飲食目標呢？（例如：增肌、減脂、調整腸胃等）" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addToCartTool: FunctionDeclaration = {
    name: "addToCart",
    description: "將指定的便當加入購物車",
    parameters: {
      type: Type.OBJECT,
      properties: {
        itemId: {
          type: Type.STRING,
          description: "便當的 ID (1-6)",
        },
      },
      required: ["itemId"],
    },
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `你是一位專業的營養師，代表「阿爸的家園 - 健康營養便當」。
你的目標是根據使用者的需求推薦適合的便當，並在使用者決定要購買時，使用工具將便當加入購物車。
我們的菜單包含：
${menuItems.map(item => `${item.id}. ${item.name} ($${item.price}, ${item.calories}kcal, ${item.protein}g蛋白質) - ${item.description}`).join("\n")}

請用親切、專業的語氣回答。如果使用者說「我想吃這個」或「幫我訂這個」，請調用 addToCart 工具。
調用工具後，請告知使用者已將該便當加入購物車。

使用者說：${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "你是一位親切的營養顧問，專門為「阿爸的家園」客戶提供建議。你可以幫客戶把便當加入購物車。",
          tools: [{ functionDeclarations: [addToCartTool] }],
        }
      });

      // Check for function calls
      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === "addToCart") {
            const itemId = (call.args as any).itemId;
            const item = menuItems.find(i => i.id === itemId);
            if (item) {
              onAddToCart(item);
              setMessages(prev => [...prev, { role: "model", text: `沒問題！我已經幫您將「${item.name}」加入購物車了。還有其他我可以幫您的嗎？` }]);
            } else {
              setMessages(prev => [...prev, { role: "model", text: "抱歉，我找不到該項餐點，請再試一次。" }]);
            }
          }
        }
      } else {
        const aiText = response.text || "抱歉，我現在無法回答，請稍後再試。";
        setMessages(prev => [...prev, { role: "model", text: aiText }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "model", text: "抱歉，連線發生一點問題，請檢查您的網路或稍後再試。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#FF6321] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-12 right-0 bg-white text-[#FF6321] px-3 py-1 rounded-lg text-xs font-bold shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          AI 營養顧問
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-full max-w-[400px] h-[600px] bg-white rounded-[32px] shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="p-6 bg-[#FF6321] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI 營養小助手</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FDFCF8]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#FF6321] text-white rounded-tr-none"
                        : "bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-[#FF6321]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="輸入您的健康需求..."
                  className="w-full py-4 pl-6 pr-14 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF6321] transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 w-10 h-10 bg-[#FF6321] text-white rounded-xl flex items-center justify-center hover:bg-[#E5591D] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-3">
                AI 建議僅供參考，具體飲食計畫請諮詢專業醫師。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
