"use client";

import { useState, useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import QuickActions from "./QuickActions";

const INITIAL_MESSAGE: ChatMessageType = {
    role: "assistant",
    content: "Hello! I'm your AI Productivity Companion. I can help you prioritize tasks, build habits, plan your day, and boost your productivity. How can I help you today?",
    timestamp: new Date(),
};

export default function ChatBox() {

    const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_MESSAGE]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    function handleSend(content: string) {

        const userMsg: ChatMessageType = {
            role: "user",
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);

    }

    function handleResponse(content: string) {

        const assistantMsg: ChatMessageType = {
            role: "assistant",
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

    }

    function handleQuickAction(prompt: string) {

        const userMsg: ChatMessageType = {
            role: "user",
            content: prompt,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);

    }

    const lastAssistantIndex = messages
        .map((m, i) => (m.role === "assistant" ? i : -1))
        .filter((i) => i !== -1)
        .pop();

    return (
        <div className="mx-auto max-w-4xl space-y-4 relative z-10">

            {/* Title */}
            <div className="flex items-center gap-3">

                <div className="rounded-2xl bg-[#0A0A0A] border border-[#0A0A0A] p-2.5 text-white shadow-sm">
                    <Bot size={22} />
                </div>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A]">AI Assistant</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Plan, prioritize and organize your work.</p>
                </div>

            </div>

            {/* Quick actions */}
            <QuickActions onAction={handleQuickAction} />

            {/* Chat area */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">

                {/* Messages */}
                <div
                    ref={containerRef}
                    className="h-[460px] overflow-y-auto p-5 space-y-4"
                >

                    {messages.map((message, index) => (
                        <ChatMessage
                            key={index}
                            message={message}
                            isLast={index === lastAssistantIndex}
                            onRegenerate={
                                index === lastAssistantIndex
                                    ? () => {
                                        // Remove last assistant message and resend last user message
                                        const userMessages = messages.filter((m) => m.role === "user");
                                        const lastUser = userMessages[userMessages.length - 1];
                                        if (lastUser) {
                                            setMessages((prev) => prev.slice(0, -1));
                                        }
                                    }
                                    : undefined
                            }
                        />
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl bg-gray-100 px-4 py-3 flex items-center gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />

                </div>

                {/* Input */}
                <div className="border-t border-[#E5E7EB] p-4">
                    <ChatInput
                        onSend={handleSend}
                        onResponse={handleResponse}
                        onLoadingChange={setLoading}
                        loading={loading}
                    />
                </div>

            </div>

        </div>
    );

}