import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
}

export default function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
}: Props) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-start justify-between">

                <div className="flex-1 min-w-0">

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>

                    {subtitle && (
                        <p className="mt-1 text-xs text-gray-400">
                            {subtitle}
                        </p>
                    )}

                </div>

                <div className="ml-4 shrink-0 rounded-xl bg-black p-3 text-white">
                    <Icon size={24} />
                </div>

            </div>

        </div>
    );

}