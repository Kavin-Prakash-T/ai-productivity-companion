"use client";

interface Props {
    text: string;
    onClick: () => void;
}

export default function SuggestionCard({ text, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="rounded-full border px-3.5 py-1.5 text-sm text-gray-600 hover:bg-black hover:text-white hover:border-black transition"
        >
            {text}
        </button>
    );
}
