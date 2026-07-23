"use client";

import { useRouter } from "next/navigation";
import { SquareCheckBig } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";

export default function EmptyTask() {

    const router = useRouter();

    return (
        <div className="col-span-full">
            <EmptyState
                icon={SquareCheckBig}
                title="No Tasks Found"
                description="You don't have any tasks matching your filters. Create a new task to get started."
                action={{
                    label: "Create Task",
                    onClick: () => router.push("/tasks/create"),
                }}
            />
        </div>
    );

}
