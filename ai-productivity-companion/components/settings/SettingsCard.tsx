import Link from "next/link";
import {
    Lock,
    SlidersHorizontal,
} from "lucide-react";

export default function SettingsCard() {
    return (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/10 p-6 backdrop-blur-md shadow-lg">

            <Link
                href="/settings/password"
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/10 p-4 text-zinc-200 hover:bg-zinc-850/40 hover:border-zinc-700/60 transition-all duration-200 font-semibold"
            >
                <div className="flex items-center gap-3">

                    <Lock size={18} className="text-zinc-400" />

                    <span>Change Password</span>

                </div>

            </Link>

            <Link
                href="/settings/preferences"
                className="mt-4 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/10 p-4 text-zinc-200 hover:bg-zinc-850/40 hover:border-zinc-700/60 transition-all duration-200 font-semibold"
            >
                <div className="flex items-center gap-3">

                    <SlidersHorizontal size={18} className="text-zinc-400" />

                    <span>Preferences</span>

                </div>

            </Link>

        </div>
    );
}