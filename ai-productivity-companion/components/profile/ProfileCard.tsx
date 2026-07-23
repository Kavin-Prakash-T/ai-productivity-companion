"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Calendar, Pencil, Loader2, SquareCheckBig, Target, Flame } from "lucide-react";
import { getProfile } from "@/services/profileService";
import { getDashboardSummary } from "@/services/dashboardService";
import ErrorState from "@/components/common/ErrorState";
import StatsCard from "./StatsCard";

interface UserProfile {
    name: string;
    email: string;
    createdAt?: string;
}

interface UserStats {
    tasksCompleted: number;
    goalsCompleted: number;
    habitsActive: number;
}

export default function ProfileCard() {

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const [profileRes, summaryRes] = await Promise.all([
                getProfile(),
                getDashboardSummary(),
            ]);

            setProfile(profileRes.data.data?.user ?? profileRes.data.user);

            const summary = summaryRes.data.data;
            setStats({
                tasksCompleted: summary?.tasks?.completed ?? 0,
                goalsCompleted: summary?.goals?.completed ?? 0,
                habitsActive: summary?.habits?.active ?? 0,
            });

        } catch {
            setError("Failed to load profile details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !profile) {
        return <ErrorState message={error ?? "Profile not found."} onRetry={load} />;
    }

    const joinedDate = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        })
        : "N/A";

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Link
                    href="/profile/edit"
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white hover:bg-neutral-800 transition"
                >
                    <Pencil size={18} />
                    Edit
                </Link>
            </div>

            {/* Profile Info */}
            <div className="rounded-2xl border bg-white p-8">

                <div className="flex flex-col md:flex-row gap-8 items-center">

                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-black text-white shrink-0">
                        <User size={60} />
                    </div>

                    <div className="space-y-4 min-w-0">

                        <h2 className="text-3xl font-bold truncate">{profile.name}</h2>

                        <div className="flex items-center gap-3 text-gray-600">
                            <Mail size={18} className="shrink-0" />
                            <span className="truncate">{profile.email}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                            <Calendar size={18} className="shrink-0" />
                            <span>Joined {joinedDate}</span>
                        </div>

                    </div>

                </div>

            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatsCard
                        title="Completed Tasks"
                        value={stats.tasksCompleted}
                        icon={SquareCheckBig}
                    />
                    <StatsCard
                        title="Goals Achieved"
                        value={stats.goalsCompleted}
                        icon={Target}
                    />
                    <StatsCard
                        title="Active Habits"
                        value={stats.habitsActive}
                        icon={Flame}
                    />
                </div>
            )}

        </div>
    );

}