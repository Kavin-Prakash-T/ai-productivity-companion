type CompletionLog = {
    date: string;
};

function parseDateKey(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
}

function getPreviousDateKey(date: string): string {
    const currentDate = parseDateKey(date);
    currentDate.setUTCDate(currentDate.getUTCDate() - 1);

    return currentDate.toISOString().split("T")[0];
}

export function calculateHabitStreak(
    completionLogs: CompletionLog[]
): number {
    if (completionLogs.length === 0) {
        return 0;
    }

    const uniqueDates = [
        ...new Set(completionLogs.map((log) => log.date)),
    ].sort((a, b) => b.localeCompare(a));

    let streak = 1;
    let currentDate = uniqueDates[0];

    for (let index = 1; index < uniqueDates.length; index++) {
        const expectedPreviousDate =
            getPreviousDateKey(currentDate);

        if (uniqueDates[index] !== expectedPreviousDate) {
            break;
        }

        streak++;
        currentDate = uniqueDates[index];
    }

    return streak;
}