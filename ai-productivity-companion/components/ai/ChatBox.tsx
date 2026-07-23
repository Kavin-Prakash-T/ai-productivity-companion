"use client";

import { useState } from "react";
import { Bot } from "lucide-react";

import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import QuickActions from "./QuickActions";

export default function ChatBox() {

    const [messages, setMessages] = useState<any[]>([
        {
            role: "assistant",
            content: "Hello! I'm your AI Productivity Companion. How can I help you today?"
        }
    ]);

    return (

        <div className="mx-auto max-w-5xl">

            <div className="mb-6 flex items-center gap-3">

                <Bot size={34} />

                <div>

                    <h1 className="text-3xl font-bold">
                        AI Assistant
                    </h1>

                    <p className="text-gray-500">
                        Plan, prioritize and organize your work.
                    </p>

                </div>

            </div>

            <QuickActions />

            <div className="mt-6 rounded-2xl border bg-white p-6">

                <div className="space-y-5 h-[500px] overflow-y-auto">

                    {messages.map((message, index) =>

                        <ChatMessage
                            key={index}
                            message={message}
                        />

                    )}

                </div>

                <ChatInput
                    messages={messages}
                    setMessages={setMessages}
                />

            </div>

        </div>

    );

}