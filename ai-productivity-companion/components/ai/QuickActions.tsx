"use client";

import SuggestionCard from "./SuggestionCard";

const QUICK_PROMPTS = [
    "What should I focus on today?",
    "Help me prioritize my tasks",
    "How can I improve my habit streak?",
    "Suggest a plan for this week",
    "Give me productivity tips",
    "Review my goals progress",
];

interface Props {
    onAction: (prompt: string) => void;
}

export default function QuickActions({ onAction }: Props) {
    return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3">Quick Prompts</p>

            <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                    <SuggestionCard
                        key={prompt}
                        text={prompt}
                        onClick={() => onAction(prompt)}
                    />
                ))}
            </div>

        </div>
    );

}