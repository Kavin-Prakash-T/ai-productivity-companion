"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { productivityInsights } from "@/services/aiService";

export default function AIRecommendation() {

    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInsight();
    }, []);

    async function loadInsight() {

        setLoading(true);

        try {
            const { data } = await productivityInsights();
            setInsight(data?.data?.insight || data?.data?.message || null);
        } catch {
            setInsight(null);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="rounded-2xl border bg-white p-6">

            <div className="mb-4 flex items-center gap-2">
                <Sparkles size={22} />
                <h2 className="text-xl font-semibold">AI Recommendation</h2>
            </div>

            {loading ? (
                <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                </div>
            ) : insight ? (
                <p className="text-gray-600 leading-7">{insight}</p>
            ) : (
                <p className="text-gray-400 text-sm">
                    Add tasks and habits to get personalised AI recommendations.
                </p>
            )}

        </div>
    );

}