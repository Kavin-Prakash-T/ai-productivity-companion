interface Props {
    priority: string;
}

export default function PriorityBadge({
    priority,
}: Props) {

    return (
        <span className="rounded-full border px-3 py-1 text-xs font-medium">

            {priority}

        </span>
    );
}