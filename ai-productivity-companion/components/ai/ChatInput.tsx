"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "@/services/aiService";

interface Props {
    onSend: (content: string) => void;
    onResponse: (content: string) => void;
    onLoadingChange: (loading: boolean) => void;
    loading: boolean;
}

export default function ChatInput({ onSend, onResponse, onLoadingChange, loading }: Props) {

    const [text, setText] = useState("");

    async function handleSend() {

        const trimmed = text.trim();
        if (!trimmed || loading) return;

        setText("");
        onSend(trimmed);
        onLoadingChange(true);

        try {
            const { data } = await sendMessage(trimmed);
            onResponse(data.data?.reply ?? data.reply ?? "I'm unable to respond right now.");
        } catch {
            onResponse("Sorry, I couldn't connect to the AI. Please try again.");
        } finally {
            onLoadingChange(false);
        }

    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex items-end gap-3 p-4 bg-white border-t border-[#E5E7EB]">

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI anything... (Enter to send, Shift+Enter for new line)"
                rows={1}
                disabled={loading}
                className="flex-1 resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-250 disabled:opacity-50 max-h-32 shadow-sm"
                style={{ minHeight: "48px" }}
            />

            <button
                onClick={handleSend}
                disabled={!text.trim() || loading}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A0A0A] text-white hover:bg-black/90 hover:shadow-sm active:scale-[0.97] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
                aria-label="Send message"
            >
                {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <Send size={16} />
                )}
            </button>

        </div>
    );

}