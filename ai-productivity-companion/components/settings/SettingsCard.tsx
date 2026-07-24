import Link from "next/link";
import {
    Lock,
    SlidersHorizontal,
} from "lucide-react";

export default function SettingsCard() {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

            <Link
                href="/settings/password"
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 text-zinc-950 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 font-semibold"
            >
                <div className="flex items-center gap-3">

                    <Lock size={18} className="text-zinc-500" />

                    <span>Change Password</span>

                </div>

            </Link>

            <Link
                href="/settings/preferences"
                className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 text-zinc-950 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 font-semibold"
            >
                <div className="flex items-center gap-3">

                    <SlidersHorizontal size={18} className="text-zinc-500" />

                    <span>Preferences</span>

                </div>

            </Link>

        </div>
    );
}