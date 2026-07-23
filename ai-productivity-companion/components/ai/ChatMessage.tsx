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
                className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${isUser ? "bg-black text-white" : "bg-gray-100"
                    }`}
            >
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>

                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                        ? "bg-black text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                        }`}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                />

                {/* Timestamp + actions */}
                <div className={`flex items-center gap-2 ${isUser ? "flex-row-reverse" : ""}`}>

                    {message.timestamp && (
                        <span className="text-xs text-gray-400">
                            {formatTime(message.timestamp)}
                        </span>
                    )}

                    {!isUser && (
                        <div className="flex items-center gap-1">

                            <button
                                onClick={handleCopy}
                                title="Copy message"
                                className="rounded-lg p-1 hover:bg-gray-100 transition text-gray-400"
                            >
                                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                            </button>

                            {isLast && onRegenerate && (
                                <button
                                    onClick={onRegenerate}
                                    title="Regenerate"
                                    className="rounded-lg p-1 hover:bg-gray-100 transition text-gray-400"
                                >
                                    <RefreshCw size={13} />
                                </button>
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );

}