"use client";

import {
    SquareCheckBig,
    Target,
    Flame,
    TrendingUp,
    RefreshCw,
} from "lucide-react";

import useDashboard from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentTasks from "@/components/dashboard/RecentTasks";
import GoalProgress from "@/components/dashboard/GoalProgress";
import AIRecommendation from "@/components/dashboard/AIRecommendation";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import ProductivityChart from "@/components/dashboard/ProductivityChart";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonCard } from "@/components/common/Skeleton";

export default function DashboardPage() {

    const { user } = useAuth();

    const {
        summary,
        upcoming,
        productivity,
        today,
        loading,
        error,
        refresh,
    } = useDashboard();

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader user={user} onRefresh={refresh} />
                <ErrorState message={error} onRetry={refresh} />
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:space-y-8">

            <div className="flex items-start justify-between gap-4">

                <PageHeader user={user} onRefresh={refresh} />

                <button
                    onClick={refresh}
                    className="shrink-0 rounded-xl border p-2.5 hover:bg-gray-100 transition"
                    title="Refresh dashboard"
                    aria-label="Refresh dashboard"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>

            </div>

            {/* Stats Row */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    <>
                        <StatsCard
                            title="Total Tasks"
                            value={summary?.tasks.total ?? 0}
                            subtitle={`${summary?.tasks.completed ?? 0} completed`}
                            icon={SquareCheckBig}
                        />
                        <StatsCard
                            title="Active Goals"
                            value={summary?.goals.active ?? 0}
                            subtitle={`${summary?.goals.completionRate ?? 0}% completion rate`}
                            icon={Target}
                        />
                        <StatsCard
                            title="Active Habits"
                            value={summary?.habits.active ?? 0}
                            subtitle={`${summary?.habits.total ?? 0} total`}
                            icon={Flame}
                        />
                        <StatsCard
                            title="Productivity"
                            value={`${productivity?.statistics.productivityScore ?? 0}%`}
                            subtitle={`${productivity?.statistics.completedTasks ?? 0} tasks this week`}
                            icon={TrendingUp}
                        />
                    </>
                )}

            </div>

            {/* Chart + Today's Tasks */}
            <div className="grid gap-6 lg:grid-cols-2">

                {productivity && (
                    <ProductivityChart data={productivity.dailyStats} />
                )}

                <RecentTasks
                    tasks={today?.tasks ?? []}
                    loading={loading}
                />

            </div>

            {/* Goal Progress + Upcoming Deadlines */}
            <div className="grid gap-6 lg:grid-cols-2">

                <GoalProgress
                    goals={[]}
                    loading={loading}
                />

                <UpcomingDeadlines
                    tasks={upcoming?.tasks ?? []}
                    goals={upcoming?.goals ?? []}
                    loading={loading}
                />

            </div>

            {/* AI Recommendation */}
            <AIRecommendation />

        </div>
    );

}

function PageHeader({
    user,
    onRefresh,
}: {
    user: { name: string } | null;
    onRefresh: () => void;
}) {
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
                {user ? `Welcome back, ${user.name}! ` : ""}
                Here&apos;s your productivity overview.
            </p>
        </div>
    );
}