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
                <Loader2 size={32} className="animate-spin text-[#0A0A0A]" />
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
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#0A0A0A]">Profile</h1>
                <Link
                    href="/profile/edit"
                    className="flex items-center gap-2 rounded-xl bg-[#0A0A0A] text-white hover:bg-black/90 px-5 py-3 hover:shadow-sm active:scale-[0.98] transition-all duration-200 text-sm font-semibold shadow-sm"
                >
                    <Pencil size={16} />
                    Edit
                </Link>
            </div>

            {/* Profile Info */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">

                <div className="flex flex-col md:flex-row gap-8 items-center">

                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 border border-[#E5E7EB] text-[#0A0A0A] shrink-0 shadow-sm">
                        <User size={54} />
                    </div>

                    <div className="space-y-3.5 min-w-0">

                        <h2 className="text-3xl font-bold text-[#0A0A0A] truncate">{profile.name}</h2>

                        <div className="flex items-center gap-3 text-[#6B7280] font-semibold text-sm">
                            <Mail size={16} className="shrink-0 text-[#9CA3AF]" />
                            <span className="truncate">{profile.email}</span>
                        </div>

                        <div className="flex items-center gap-3 text-[#6B7280] font-semibold text-sm">
                            <Calendar size={16} className="shrink-0 text-[#9CA3AF]" />
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