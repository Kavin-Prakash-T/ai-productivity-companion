import Link from "next/link";
import {
    Lock,
    SlidersHorizontal,
} from "lucide-react";

export default function SettingsCard() {
    return (
        <div className="rounded-2xl border bg-white p-6">

            <Link
                href="/settings/password"
                className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
            >
                <div className="flex items-center gap-3">

                    <Lock size={20} />

                    <span>Change Password</span>

                </div>

            </Link>

            <Link
                href="/settings/preferences"
                className="mt-4 flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
            >
                <div className="flex items-center gap-3">

                    <SlidersHorizontal size={20} />

                    <span>Preferences</span>

                </div>

            </Link>

        </div>
    );
}