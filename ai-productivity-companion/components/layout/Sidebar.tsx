"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

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
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Tasks", href: "/tasks", icon: SquareCheckBig },
    { title: "Goals", href: "/goals", icon: Target },
    { title: "Habits", href: "/habits", icon: Flame },
    { title: "Calendar", href: "/calendar", icon: CalendarDays },
    { title: "AI Assistant", href: "/ai", icon: Bot },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Profile", href: "/profile", icon: User },
    { title: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        toast.success("Logged out successfully");
        router.push("/login");
    }

    return (
        <aside className="hidden md:flex w-72 flex-col border-r bg-white">

            <div className="border-b p-6">
                <h1 className="text-2xl font-bold">AI Productivity</h1>
                <p className="text-sm text-gray-500 mt-1">Companion</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">

                {menus.map((menu) => {

                    const Icon = menu.icon;
                    const active = pathname === menu.href ||
                        (menu.href !== "/dashboard" && pathname.startsWith(menu.href));

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`flex items-center gap-3 rounded-xl p-3 transition ${active
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

            <div className="border-t p-4 space-y-2">

                {user && (
                    <div className="rounded-xl bg-gray-50 p-3">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-red-600 hover:bg-red-50 transition"
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </div>

        </aside>
    );

}