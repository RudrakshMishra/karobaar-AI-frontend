import { useState, useRef, useEffect } from "react";
import { X, Send, BrainCircuit, Bot, User, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function AiChatModal({ onClose }: { onClose: () => void }) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hello! I am your Karobaar AI assistant. How can I help you grow your e-commerce business today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const token = await getToken() || "";

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error("Failed to connect to AI");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunkStr = decoder.decode(value);
          const lines = chunkStr.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') break;
              try {
                const data = JSON.parse(dataStr);
                if (data.chunk) {
                  assistantMessage += data.chunk;
                  setMessages(prev => [
                    ...prev.slice(0, -1),
                    { role: 'assistant', content: assistantMessage }
                  ]);
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to my neural network. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-[#050505]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#FAF9F6] border-l border-[#D6D3CB] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#D6D3CB] bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(212,163,115,0.1)] border border-[rgba(212,163,115,0.3)] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-[#050505]" />
            </div>
            <div>
              <h3 className="font-bold text-[#050505]">Karobaar AI</h3>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[rgba(0,0,0,0.4)] hover:text-[#050505] transition-colors rounded-lg hover:bg-[rgba(0,0,0,0.05)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#050505]' : 'bg-[rgba(212,163,115,0.1)] border border-[rgba(212,163,115,0.3)]'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[#050505]" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#050505] text-[#F2F0EA] rounded-tr-sm' : 'bg-[#FFFFFF] border border-[#D6D3CB] text-[#050505] shadow-sm rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgba(212,163,115,0.1)] border border-[rgba(212,163,115,0.3)] flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[#050505] animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#D6D3CB] bg-[#FFFFFF]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your store..."
              className="w-full bg-[#F2F0EA] border border-[#D6D3CB] text-[#050505] rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-[#050505] focus:ring-1 focus:ring-[#050505] transition-all placeholder:text-[rgba(0,0,0,0.4)]"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#050505] transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-center mt-3">
             <span className="text-[10px] text-[rgba(0,0,0,0.4)] font-medium">Karobaar AI can make mistakes. Verify critical business decisions.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
