"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

import Button from "../common/Button";
import { updatePreferences } from "@/services/settingsService";

export default function PreferenceForm() {

    const [loading, setLoading] = useState(false);
    const [emailAlerts, setEmailAlerts] = useState(true);

    useEffect(() => {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
    }, []);

    async function handleSubmit() {
        setLoading(true);
        try {
            await updatePreferences({ theme: "light", emailAlerts });
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");

            toast.success("Preferences saved successfully");
        } catch {
            toast.error("Failed to save preferences");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    href="/settings"
                    className="rounded-xl border p-2 hover:bg-gray-100 transition"
                >
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-3xl font-bold">Preferences</h1>
            </div>

            <div className="rounded-2xl border bg-white p-6 sm:p-8 space-y-6">

                {/* Theme Preference */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interface Theme
                    </label>
                    <div className="flex items-center justify-between h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-800">
                        <span>Light Mode</span>
                        <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">Active</span>
                    </div>
                </div>

                {/* Toggle switch for notifications */}
                <div className="flex items-center justify-between border-t pt-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                        <p className="text-xs text-gray-400 mt-1">Receive daily summary and goal deadline warnings.</p>
                    </div>
                    <button
                        onClick={() => setEmailAlerts(!emailAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailAlerts ? "bg-black" : "bg-gray-200"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailAlerts ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                <Button
                    title={loading ? "Saving..." : "Save Preferences"}
                    onClick={handleSubmit}
                    disabled={loading}
                />

            </div>

        </div>
    );

}
