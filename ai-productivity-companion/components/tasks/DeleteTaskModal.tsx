"use client";

import { Trash2 } from "lucide-react";

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    taskTitle?: string;
}

export default function DeleteTaskModal({
    onConfirm,
    onCancel,
    loading,
    taskTitle,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white border border-[#E5E7EB] p-8 shadow-2xl">

                <div className="flex items-center justify-center mb-6">
                    <div className="rounded-2xl bg-red-50 p-4 border border-red-100 shadow-sm">
                        <Trash2 size={28} className="text-red-500" />
                    </div>
                </div>

                <h2 className="text-center text-xl font-bold text-[#0A0A0A]">Delete Task</h2>

                <p className="mt-3 text-center text-sm text-[#6B7280] font-medium">
                    Are you sure you want to delete
                    {taskTitle ? ` "${taskTitle}"` : " this task"}?
                    This action cannot be undone.
                </p>

                <div className="mt-8 flex gap-3">

                    <button
                        onClick={onCancel}
                        className="flex-1 h-11 rounded-xl border border-[#E5E7EB] font-medium text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );

}
