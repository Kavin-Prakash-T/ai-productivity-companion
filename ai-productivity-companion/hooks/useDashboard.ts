"use client";

import { useEffect, useState } from "react";

import { getDashboard } from "@/services/dashboardService";

export default function useDashboard() {

    const [dashboard, setDashboard] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    async function loadDashboard() {

        try {

            const { data } = await getDashboard();

            setDashboard(data);

        }
        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadDashboard();

    }, []);

    return {

        dashboard,
        loading,
        refresh: loadDashboard

    };

}