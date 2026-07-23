import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

export default function StatsCard({ title, value, icon: Icon }: Props) {
    return (
        <div className="rounded-2xl border bg-white p-5 flex items-center justify-between shadow-sm hover:shadow-md transition">
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
            <div className="rounded-xl bg-gray-100 p-3 text-black">
                <Icon size={22} />
            </div>
        </div>
    );
}
