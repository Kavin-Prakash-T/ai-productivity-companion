"use client";

interface Props {
    text: string;
    onClick: () => void;
}

export default function SuggestionCard({ text, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-xs font-medium text-[#6B7280] hover:bg-gray-50 hover:text-[#0A0A0A] hover:border-gray-300 active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
            {text}
        </button>
    );
}
