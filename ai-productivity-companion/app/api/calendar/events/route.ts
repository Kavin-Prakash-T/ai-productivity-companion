type BusySlot = {
    startTime: Date;
    endTime: Date;
};

export type FreeSlot = {
    startTime: Date;
    endTime: Date;
    durationMinutes: number;
};

export function calculateFreeSlots(
    date: string,
    workStart: string,
    workEnd: string,
    busySlots: BusySlot[],
    minimumSlotMinutes = 30
): FreeSlot[] {
    const workStartDate = new Date(`${date}T${workStart}:00`);
    const workEndDate = new Date(`${date}T${workEnd}:00`);

    const sortedBusySlots = busySlots
        .map((slot) => ({
            startTime:
                slot.startTime < workStartDate
                    ? workStartDate
                    : slot.startTime,
            endTime:
                slot.endTime > workEndDate
                    ? workEndDate
                    : slot.endTime,
        }))
        .filter(
            (slot) =>
                slot.startTime < workEndDate &&
                slot.endTime > workStartDate
        )
        .sort(
            (first, second) =>
                first.startTime.getTime() -
                second.startTime.getTime()
        );

    const freeSlots: FreeSlot[] = [];
    let currentTime = workStartDate;

    for (const busySlot of sortedBusySlots) {
        if (busySlot.startTime > currentTime) {
            const durationMinutes = Math.floor(
                (busySlot.startTime.getTime() -
                    currentTime.getTime()) /
                60000
            );

            if (durationMinutes >= minimumSlotMinutes) {
                freeSlots.push({
                    startTime: new Date(currentTime),
                    endTime: new Date(busySlot.startTime),
                    durationMinutes,
                });
            }
        }

        if (busySlot.endTime > currentTime) {
            currentTime = busySlot.endTime;
        }
    }

    if (currentTime < workEndDate) {
        const durationMinutes = Math.floor(
            (workEndDate.getTime() -
                currentTime.getTime()) /
            60000
        );

        if (durationMinutes >= minimumSlotMinutes) {
            freeSlots.push({
                startTime: new Date(currentTime),
                endTime: workEndDate,
                durationMinutes,
            });
        }
    }

    return freeSlots;
}