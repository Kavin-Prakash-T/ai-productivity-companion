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
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 shadow-sm relative overflow-hidden group">
            
            <div className="flex items-start justify-between relative z-10">

                <div className="flex-1 min-w-0">

                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        {title}
                    </p>

                    <h2 className="mt-2.5 text-3xl font-extrabold text-[#0A0A0A] tracking-tight">
                        {value}
                    </h2>

                    {subtitle && (
                        <p className="mt-1.5 text-[11px] text-[#9CA3AF] font-medium tracking-normal">
                            {subtitle}
                        </p>
                    )}

                </div>

                <div className="ml-4 shrink-0 rounded-xl bg-gray-50 border border-[#E5E7EB] p-3 text-[#6B7280] group-hover:text-[#0A0A0A] group-hover:bg-gray-100 transition-all duration-300 shadow-sm">
                    <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                </div>

            </div>

        </div>
    );

}