export type HabitFrequency = "daily" | "weekly" | "monthly" | "yearly";

type CompletionLog = {
    date: string;
};

function parseDateKey(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
}

export function getPeriodKey(dateStr: string, frequency: HabitFrequency = "daily"): string {
    if (!dateStr) return "";
    if (frequency === "daily") {
        return dateStr;
    }
    if (frequency === "weekly") {
        const d = parseDateKey(dateStr);
        const day = d.getUTCDay();
        const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
        return monday.toISOString().split("T")[0];
    }
    if (frequency === "monthly") {
        return dateStr.substring(0, 7);
    }
    if (frequency === "yearly") {
        return dateStr.substring(0, 4);
    }
    return dateStr;
}

export function getPreviousPeriodKey(periodKey: string, frequency: HabitFrequency = "daily"): string {
    if (!periodKey) return "";
    if (frequency === "daily") {
        const currentDate = parseDateKey(periodKey);
        currentDate.setUTCDate(currentDate.getUTCDate() - 1);
        return currentDate.toISOString().split("T")[0];
    }
    if (frequency === "weekly") {
        const currentDate = parseDateKey(periodKey);
        currentDate.setUTCDate(currentDate.getUTCDate() - 7);
        return currentDate.toISOString().split("T")[0];
    }
    if (frequency === "monthly") {
        const [yearStr, monthStr] = periodKey.split("-");
        let year = Number(yearStr);
        let month = Number(monthStr) - 1;
        if (month < 1) {
            month = 12;
            year -= 1;
        }
        return `${year}-${String(month).padStart(2, "0")}`;
    }
    if (frequency === "yearly") {
        const year = Number(periodKey);
        return String(year - 1);
    }
    return periodKey;
}

export function getNextPeriodKey(periodKey: string, frequency: HabitFrequency = "daily"): string {
    if (!periodKey) return "";
    if (frequency === "daily") {
        const currentDate = parseDateKey(periodKey);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        return currentDate.toISOString().split("T")[0];
    }
    if (frequency === "weekly") {
        const currentDate = parseDateKey(periodKey);
        currentDate.setUTCDate(currentDate.getUTCDate() + 7);
        return currentDate.toISOString().split("T")[0];
    }
    if (frequency === "monthly") {
        const [yearStr, monthStr] = periodKey.split("-");
        let year = Number(yearStr);
        let month = Number(monthStr) + 1;
        if (month > 12) {
            month = 1;
            year += 1;
        }
        return `${year}-${String(month).padStart(2, "0")}`;
    }
    if (frequency === "yearly") {
        const year = Number(periodKey);
        return String(year + 1);
    }
    return periodKey;
}

export function isHabitCompletedInCurrentPeriod(
    completionLogs: CompletionLog[],
    frequency: HabitFrequency = "daily",
    referenceDateKey?: string
): boolean {
    if (!completionLogs || completionLogs.length === 0) return false;
    const todayKey = referenceDateKey || new Date().toISOString().split("T")[0];
    const currentPeriodKey = getPeriodKey(todayKey, frequency);
    return completionLogs.some(
        (log) => getPeriodKey(log.date, frequency) === currentPeriodKey
    );
}

export function calculateHabitStreak(
    completionLogs: CompletionLog[],
    frequency: HabitFrequency = "daily",
    referenceDateKey?: string
): number {
    if (!completionLogs || completionLogs.length === 0) {
        return 0;
    }

    const todayKey = referenceDateKey || new Date().toISOString().split("T")[0];
    const currentPeriodKey = getPeriodKey(todayKey, frequency);
    const previousPeriodKey = getPreviousPeriodKey(currentPeriodKey, frequency);

    const uniquePeriodKeys = [
        ...new Set(completionLogs.map((log) => getPeriodKey(log.date, frequency))),
    ].sort((a, b) => b.localeCompare(a));

    const latestPeriodKey = uniquePeriodKeys[0];

    if (latestPeriodKey !== currentPeriodKey && latestPeriodKey !== previousPeriodKey) {
        return 0;
    }

    let streak = 1;
    let currentKey = latestPeriodKey;

    for (let index = 1; index < uniquePeriodKeys.length; index++) {
        const expectedPreviousKey = getPreviousPeriodKey(currentKey, frequency);

        if (uniquePeriodKeys[index] !== expectedPreviousKey) {
            break;
        }

        streak++;
        currentKey = uniquePeriodKeys[index];
    }

    return streak;
}

export function calculateLongestHabitStreak(
    completionLogs: CompletionLog[],
    frequency: HabitFrequency = "daily"
): number {
    if (!completionLogs || completionLogs.length === 0) {
        return 0;
    }

    const uniquePeriodKeys = [
        ...new Set(completionLogs.map((log) => getPeriodKey(log.date, frequency))),
    ].sort((a, b) => a.localeCompare(b));

    let maxStreak = 1;
    let currentStreak = 1;

    for (let index = 1; index < uniquePeriodKeys.length; index++) {
        const prevKey = uniquePeriodKeys[index - 1];
        const currKey = uniquePeriodKeys[index];

        const expectedNextKey = getNextPeriodKey(prevKey, frequency);

        if (currKey === expectedNextKey) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
    }

    return maxStreak;
}
