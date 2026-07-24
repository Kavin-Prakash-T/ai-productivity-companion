import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

export default function StatsCard({ title, value, icon: Icon }: Props) {
    return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 flex items-center justify-between shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-300 group">
            <div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{title}</p>
                <p className="mt-2 text-3xl font-extrabold text-[#0A0A0A] tracking-tight">{value}</p>
            </div>
            <div className="rounded-xl bg-gray-100 border border-[#E5E7EB] p-3 text-[#6B7280] group-hover:text-[#0A0A0A] group-hover:bg-gray-200 group-hover:border-gray-300 transition-all duration-300 shadow-sm">
                <Icon size={18} className="transition-transform duration-300 group-hover:scale-115" />
            </div>
        </div>
    );
}
