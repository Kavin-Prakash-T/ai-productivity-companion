"use client";

import {
    Search,
    Bell,
    UserCircle,
} from "lucide-react";

export default function Navbar() {
    return (
        <header className="flex h-20 items-center justify-between border-b bg-white px-8">

            <div className="relative">

                <Search
                    size={18}
                    className="absolute left-4 top-3 text-gray-400"
                />

                <input
                    placeholder="Search..."
                    className="h-11 w-80 rounded-xl border pl-11 pr-4"
                />

            </div>

            <div className="flex items-center gap-6">

                <button className="rounded-full p-2 hover:bg-gray-100">

                    <Bell size={22} />

                </button>

                <button className="rounded-full p-2 hover:bg-gray-100">

                    <UserCircle size={30} />

                </button>

            </div>

        </header>
    );
}