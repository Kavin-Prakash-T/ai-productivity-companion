"use client";

import { Trash2 } from "lucide-react";

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    goalTitle?: string;
}

export default function DeleteGoalModal({ onConfirm, onCancel, loading, goalTitle }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">

                <div className="flex items-center justify-center mb-6">
                    <div className="rounded-2xl bg-red-50 p-4">
                        <Trash2 size={28} className="text-red-500" />
                    </div>
                </div>

                <h2 className="text-center text-xl font-bold">Delete Goal</h2>

                <p className="mt-3 text-center text-sm text-gray-500">
                    Are you sure you want to delete
                    {goalTitle ? ` "${goalTitle}"` : " this goal"}?
                    This action cannot be undone.
                </p>

                <div className="mt-8 flex gap-3">

                    <button
                        onClick={onCancel}
                        className="flex-1 h-11 rounded-xl border font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );

}
