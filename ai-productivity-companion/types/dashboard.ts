export interface DashboardStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    totalGoals: number;
    completedGoals: number;
    totalHabits: number;
    activeHabits: number;
    productivityScore: number;
    currentStreak: number;
}

export interface RecentTask {
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
}

export interface DashboardData {
    stats: DashboardStats;
    recentTasks: RecentTask[];
    aiSuggestion: string;
}