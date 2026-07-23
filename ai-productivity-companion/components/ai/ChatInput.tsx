"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { sendMessage } from "@/services/aiService";

export default function ChatInput({
    messages,
    setMessages
}: any) {

    const [text, setText] = useState("");

    async function handleSend() {

        if (!text.trim()) return;

        const userMessage = {
            role: "user",
            content: text
        };

        setMessages([
            ...messages,
            userMessage
        ]);

        setText("");

        try {

            const { data } = await sendMessage(text);

            setMessages((prev: any) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply
                }
            ]);

        }
        catch {

            setMessages((prev: any) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Unable to generate response."
                }
            ]);

        }

    }

    return (

        <div className="mt-6 flex gap-3">

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask AI..."
                className="flex-1 h-12 rounded-xl border px-4"
            />

            <button
                onClick={handleSend}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white"
            >

                <Send size={18} />

            </button>

        </div>

    );

}