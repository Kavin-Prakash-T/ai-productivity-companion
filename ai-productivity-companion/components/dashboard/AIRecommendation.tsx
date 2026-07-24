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
        <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50 p-6 shadow-sm relative overflow-hidden">
            
            <div className="mb-4 flex items-center gap-2 text-[#0A0A0A] relative z-10">
                <Sparkles size={18} className="animate-pulse-glow" />
                <h2 className="text-base font-bold text-[#0A0A0A]">AI Recommendations</h2>
            </div>

            <div className="relative z-10">
                {loading ? (
                    <div className="space-y-2.5">
                        <div className="h-3.5 w-full animate-pulse rounded-lg bg-[#E5E7EB]" />
                        <div className="h-3.5 w-3/4 animate-pulse rounded-lg bg-[#E5E7EB]" />
                        <div className="h-3.5 w-5/6 animate-pulse rounded-lg bg-[#E5E7EB]" />
                    </div>
                ) : insight ? (
                    <p className="text-sm text-[#6B7280] leading-relaxed font-medium">{insight}</p>
                ) : (
                    <p className="text-xs text-[#9CA3AF] font-medium">
                        Add tasks and habits to get personalised AI recommendations.
                    </p>
                )}
            </div>

        </div>
    );

}