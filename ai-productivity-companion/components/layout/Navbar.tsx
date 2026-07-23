"use client";

import Link from "next/link";
import { Search, Bell, UserCircle, Menu } from "lucide-react";

interface Props {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: Props) {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">

            {/* Left: hamburger + search */}
            <div className="flex items-center gap-3">

                <button
                    onClick={onMenuClick}
                    className="rounded-xl p-2 hover:bg-gray-100 md:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div className="relative hidden sm:block">

                    <Search
                        size={18}
                        className="absolute left-4 top-3 text-gray-400"
                    />

                    <input
                        placeholder="Search..."
                        className="h-11 w-64 rounded-xl border pl-11 pr-4 text-sm focus:border-black focus:ring-1 focus:ring-black transition"
                    />

                </div>

            </div>

            {/* Right: notifications + profile */}
            <div className="flex items-center gap-3">

                <Link
                    href="/notifications"
                    className="rounded-full p-2 hover:bg-gray-100 transition"
                    aria-label="Notifications"
                >
                    <Bell size={22} />
                </Link>

                <Link
                    href="/profile"
                    className="rounded-full p-2 hover:bg-gray-100 transition"
                    aria-label="Profile"
                >
                    <UserCircle size={30} />
                </Link>

            </div>

        </header>
    );

}