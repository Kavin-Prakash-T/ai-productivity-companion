import { Sparkles } from "lucide-react";

const actions = [
    "Prioritize My Tasks",
    "Generate Today's Schedule",
    "Productivity Tips",
    "Break Down a Task",
];

export default function QuickActions() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {actions.map((action) => (
                <button
                    key={action}
                    className="rounded-xl border bg-white p-4 text-left transition hover:bg-black hover:text-white"
                >
                    <div className="mb-2">
                        <Sparkles size={20} />
                    </div>
                    <p className="font-medium">{action}</p>
                </button>
            ))}
        </div>
    );
}