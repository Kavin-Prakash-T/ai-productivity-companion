import { Sparkles } from "lucide-react";

export default function Logo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-sm border border-zinc-800">
                <Sparkles size={20} className="text-amber-400" />
            </div>
            <div>
                <h1 className="text-base font-bold text-[#0A0A0A] leading-tight">
                    AI Productivity
                </h1>
                <p className="text-[10px] text-[#6B7280] font-semibold tracking-wider uppercase">Companion</p>
            </div>
        </div>
    );
}
