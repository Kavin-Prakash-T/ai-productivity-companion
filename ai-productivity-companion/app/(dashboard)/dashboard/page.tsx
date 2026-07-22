import {
    SquareCheckBig,
    Target,
    Flame,
    TrendingUp,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentTasks from "@/components/dashboard/RecentTasks";
import GoalProgress from "@/components/dashboard/GoalProgress";
import AIRecommendation from "@/components/dashboard/AIRecommendation";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";

export default function DashboardPage() {
    return (
        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Welcome back! Here's your productivity overview.
                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatsCard
                    title="Tasks"
                    value={18}
                    icon={SquareCheckBig}
                />

                <StatsCard
                    title="Goals"
                    value={5}
                    icon={Target}
                />

                <StatsCard
                    title="Habit Streak"
                    value={24}
                    icon={Flame}
                />

                <StatsCard
                    title="Productivity"
                    value="92%"
                    icon={TrendingUp}
                />

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <RecentTasks />

                <GoalProgress />

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <AIRecommendation />

                <UpcomingDeadlines />

            </div>

        </div>
    );
}