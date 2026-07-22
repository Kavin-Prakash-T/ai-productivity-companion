import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
}: Props) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                        {value}
                    </h2>

                </div>

                <div className="rounded-xl bg-black p-3 text-white">

                    <Icon size={24} />

                </div>

            </div>

        </div>
    );
}