"use client";

import { useEffect, useState } from "react";

import {
    getDashboardSummary,
    getUpcomingDeadlines,
    getProductivity,
    getTodayData,
} from "@/services/dashboardService";

import type {
    DashboardSummary,
    UpcomingDeadlines,
    ProductivityData,
    TodayData,
} from "@/types";

interface DashboardState {
    summary: DashboardSummary | null;
    upcoming: UpcomingDeadlines | null;
    productivity: ProductivityData | null;
    today: TodayData | null;
    loading: boolean;
    error: string | null;
}

export default function useDashboard() {

    const [state, setState] = useState<DashboardState>({
        summary: null,
        upcoming: null,
        productivity: null,
        today: null,
        loading: true,
        error: null,
    });

    async function load() {

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {

            const [summaryRes, upcomingRes, productivityRes, todayRes] =
                await Promise.all([
                    getDashboardSummary(),
                    getUpcomingDeadlines(7),
                    getProductivity(7),
                    getTodayData(),
                ]);

            setState({
                summary: summaryRes.data.data,
                upcoming: upcomingRes.data.data,
                productivity: productivityRes.data.data,
                today: todayRes.data.data,
                loading: false,
                error: null,
            });

        } catch {

            setState((prev) => ({
                ...prev,
                loading: false,
                error: "Failed to load dashboard data.",
            }));

        }

    }

    useEffect(() => {
        load();
    }, []);

    return { ...state, refresh: load };

}