import type { TaskPriority } from "@/types";

interface Props {
    priority: string;
}

const styles: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
};

export default function PriorityBadge({ priority }: Props) {

    const key = priority?.toLowerCase() as TaskPriority;
    const style = styles[key] ?? "bg-gray-100 text-gray-600 border-gray-200";

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
        >
            {priority}
        </span>
    );

}