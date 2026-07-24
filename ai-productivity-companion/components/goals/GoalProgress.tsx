"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateProgress } from "@/services/goalService";

interface Props {
    goalId: string;
    currentProgress: number;
    onUpdated: (newProgress: number) => void;
}

export default function GoalProgress({ goalId, currentProgress, onUpdated }: Props) {

    const [value, setValue] = useState(currentProgress);
    const [loading, setLoading] = useState(false);

    async function handleUpdate() {

        if (value === currentProgress) return;

        setLoading(true);

        try {
            const { data } = await updateProgress(goalId, value);
            toast.success(data.message ?? "Progress updated");
            onUpdated(value);
        } catch {
            toast.error("Failed to update progress");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <h3 className="font-bold text-[#0A0A0A] mb-4">Update Progress</h3>

            <div className="space-y-4">

                <div className="flex items-center gap-4">

                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="flex-1 h-2 accent-[#0A0A0A]"
                    />

                    <span className="w-12 text-right font-bold text-lg text-[#0A0A0A]">
                        {value}%
                    </span>

                </div>

                <div className="h-2.5 rounded-full bg-[#E5E7EB]">
                    <div
                        className="h-2.5 rounded-full bg-[#0A0A0A] transition-all"
                        style={{ width: `${value}%` }}
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={loading || value === currentProgress}
                    className="h-10 w-full rounded-xl bg-[#0A0A0A] text-white text-sm font-medium hover:bg-black/90 transition shadow-sm disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Progress"}
                </button>

            </div>

        </div>
    );

}
