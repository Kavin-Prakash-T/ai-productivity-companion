"use client";

import { useState } from "react";
import { Bot, User, Copy, Check, RefreshCw } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types";

interface Props {
    message: ChatMessageType;
    isLast?: boolean;
    onRegenerate?: () => void;
}

function renderMarkdown(text: string) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br />");
}

function formatTime(date?: Date) {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function ChatMessage({ message, isLast, onRegenerate }: Props) {

    const [copied, setCopied] = useState(false);

    const isUser = message.role === "user";

    async function handleCopy() {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>

            {/* Avatar */}
            <div
                className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center border ${isUser ? "bg-[#0A0A0A] border-[#0A0A0A] text-white shadow-sm" : "bg-white border-[#E5E7EB] text-[#0A0A0A] shadow-sm"
                    }`}
            >
                {isUser ? <User size={15} /> : <Bot size={15} />}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>

                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                        ? "bg-[#0A0A0A] text-white border border-[#0A0A0A] rounded-tr-sm shadow-sm"
                        : "bg-white border border-[#E5E7EB] text-[#0A0A0A] rounded-tl-sm shadow-sm"
                        }`}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                />

                {/* Timestamp + actions */}
                <div className={`flex items-center gap-2 ${isUser ? "flex-row-reverse" : ""}`}>

                    {message.timestamp && (
                        <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">
                            {formatTime(message.timestamp)}
                        </span>
                    )}

                    {!isUser && (
                        <div className="flex items-center gap-1">

                            <button
                                onClick={handleCopy}
                                title="Copy message"
                                className="rounded-lg p-1 hover:bg-gray-100 transition text-[#9CA3AF] hover:text-[#0A0A0A]"
                            >
                                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                            </button>

                            {isLast && onRegenerate && (
                                <button
                                    onClick={onRegenerate}
                                    title="Regenerate"
                                    className="rounded-lg p-1 hover:bg-gray-100 transition text-[#9CA3AF] hover:text-[#0A0A0A]"
                                >
                                    <RefreshCw size={12} />
                                </button>
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );

}