export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus =
    | "pending"
    | "in-progress"
    | "completed"
    | "missed"
    | "cancelled";

export interface Subtask {
    _id?: string;
    title: string;
    completed: boolean;
}

export interface Task {
    _id: string;
    user: string;
    title: string;
    description?: string;
    category: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: string;
    estimatedMinutes?: number;
    subtasks: Subtask[];
    aiGenerated: boolean;
    priorityScore?: number;
    reminderEnabled: boolean;
    reminderTime?: string;
    reminderSent: boolean;
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

// ──────────────────────────────────────────
// Goal
// ──────────────────────────────────────────

export type GoalStatus =
    | "not-started"
    | "in-progress"
    | "completed"
    | "cancelled";

export interface Goal {
    _id: string;
    user: string;
    title: string;
    description?: string;
    category: string;
    targetDate?: string;
    progress: number;
    status: GoalStatus;
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

// ──────────────────────────────────────────
// Habit
// ──────────────────────────────────────────

export type HabitFrequency = "daily" | "weekly";

export interface HabitLog {
    date: string;
    completedAt: string;
}

export interface Habit {
    _id: string;
    user: string;
    title: string;
    description?: string;
    category: string;
    frequency: HabitFrequency;
    targetDays: number[];
    reminderEnabled: boolean;
    reminderTime?: string;
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    completionLogs: HabitLog[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ──────────────────────────────────────────
// Calendar Event
// ──────────────────────────────────────────

export type CalendarEventType =
    | "meeting"
    | "interview"
    | "class"
    | "appointment"
    | "personal"
    | "other";

export interface CalendarEvent {
    _id: string;
    user: string;
    title: string;
    description?: string;
    type: CalendarEventType;
    startTime: string;
    endTime: string;
    location?: string;
    allDay: boolean;
    reminderEnabled: boolean;
    reminderMinutesBefore?: number;
    createdAt?: string;
    updatedAt?: string;
}

// ──────────────────────────────────────────
// Notification
// ──────────────────────────────────────────

export type NotificationType =
    | "task-reminder"
    | "calendar-reminder"
    | "habit-reminder"
    | "goal-update"
    | "ai-recommendation"
    | "system";

export interface Notification {
    _id: string;
    user: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedTask?: string;
    relatedGoal?: string;
    relatedHabit?: string;
    relatedCalendarEvent?: string;
    actionUrl?: string;
    isRead: boolean;
    pushSent: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ──────────────────────────────────────────
// Profile
// ──────────────────────────────────────────

export interface Profile {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt?: string;
}

// ──────────────────────────────────────────
// Dashboard
// ──────────────────────────────────────────

export interface DashboardSummary {
    tasks: {
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
        overdue: number;
        dueToday: number;
        completionRate: number;
    };
    goals: {
        total: number;
        completed: number;
        active: number;
        completionRate: number;
    };
    habits: {
        total: number;
        active: number;
    };
}

export interface DailyStats {
    date: string;
    completedTasks: number;
    completedHabits: number;
}

export interface ProductivityData {
    period: {
        days: number;
        startDate: string;
        endDate: string;
    };
    statistics: {
        completedTasks: number;
        missedTasks: number;
        completedWorkMinutes: number;
        averageGoalProgress: number;
        habitCompletionRate: number;
        productivityScore: number;
    };
    dailyStats: DailyStats[];
}

export interface UpcomingDeadlines {
    tasks: Task[];
    goals: Goal[];
    rangeInDays: number;
}

export interface TodayData {
    date: string;
    tasks: Task[];
    habits: {
        id: string;
        title: string;
        category: string;
        reminderTime?: string;
        currentStreak: number;
        completedToday: boolean;
    }[];
    summary: {
        totalTasks: number;
        totalHabits: number;
        completedHabits: number;
        estimatedWorkMinutes: number;
    };
}

// ──────────────────────────────────────────
// AI
// ──────────────────────────────────────────

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
}

// ──────────────────────────────────────────
// API Response
// ──────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}
