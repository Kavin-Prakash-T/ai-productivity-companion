"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    SquareCheckBig,
    Target,
    Flame,
    CalendarDays,
    Bot,
    Bell,
    User,
    Settings,
    LogOut,
} from "lucide-react";

const menus = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Tasks",
        href: "/tasks",
        icon: SquareCheckBig,
    },
    {
        title: "Goals",
        href: "/goals",
        icon: Target,
    },
    {
        title: "Habits",
        href: "/habits",
        icon: Flame,
    },
    {
        title: "Calendar",
        href: "/calendar",
        icon: CalendarDays,
    },
    {
        title: "AI Assistant",
        href: "/ai",
        icon: Bot,
    },
    {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-72 flex-col border-r bg-white">

            <div className="border-b p-6">

                <h1 className="text-2xl font-bold">
                    AI Productivity
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Companion
                </p>

            </div>

            <nav className="flex-1 p-4 space-y-2">

                {menus.map((menu) => {

                    const Icon = menu.icon;

                    const active =
                        pathname === menu.href;

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`flex items-center gap-3 rounded-xl p-3 transition

              ${active
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            <Icon size={20} />

                            {menu.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t p-4">

                <button className="flex w-full items-center gap-3 rounded-xl p-3 hover:bg-red-50">

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>
    );
}