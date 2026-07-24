"use client";

import Link from "next/link";
import { Search, Bell, UserCircle, Menu } from "lucide-react";

interface Props {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: Props) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 md:px-8 relative z-10">

            {/* Left: hamburger + search */}
            <div className="flex items-center gap-3">

                <button
                    onClick={onMenuClick}
                    className="rounded-xl p-2 text-[#6B7280] hover:bg-gray-100 hover:text-[#0A0A0A] md:hidden transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <div className="relative hidden sm:block">

                    <Search
                        size={16}
                        className="absolute left-4 top-3 text-[#9CA3AF]"
                    />

                    <input
                        placeholder="Search..."
                        className="h-10 w-64 rounded-xl border border-[#E5E7EB] bg-white pl-11 pr-4 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-250 shadow-sm"
                    />

                </div>

            </div>

            {/* Right: notifications + profile */}
            <div className="flex items-center gap-3">

                <Link
                    href="/notifications"
                    className="rounded-xl p-2 text-[#6B7280] hover:bg-gray-100 hover:text-[#0A0A0A] transition-all"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                </Link>

                <Link
                    href="/profile"
                    className="rounded-full text-[#6B7280] hover:text-[#0A0A0A] transition-all"
                    aria-label="Profile"
                >
                    <UserCircle size={28} />
                </Link>

            </div>

        </header>
    );

}