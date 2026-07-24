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
        <aside className="hidden md:flex w-72 flex-col border-r border-[#E5E7EB] bg-white relative z-20">

            <div className="border-b border-[#E5E7EB] p-6">
                <h1 className="text-xl font-bold text-[#0A0A0A]">
                    AI Productivity
                </h1>
                <p className="text-xs text-[#6B7280] font-medium tracking-wider uppercase mt-1">Companion</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">

                {menus.map((menu) => {

                    const Icon = menu.icon;
                    const active = pathname === menu.href ||
                        (menu.href !== "/dashboard" && pathname.startsWith(menu.href));

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 group ${active
                                ? "bg-gray-100 text-[#0A0A0A]"
                                : "text-[#6B7280] hover:text-[#0A0A0A] hover:bg-gray-50"
                                }`}
                        >
                            <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${active ? "text-[#0A0A0A]" : "text-[#9CA3AF] group-hover:text-[#0A0A0A]"}`} />
                            {menu.title}
                        </Link>
                    );

                })}

            </nav>

            <div className="border-t border-[#E5E7EB] p-4 space-y-3">

                {user && (
                    <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-3.5">
                        <p className="font-semibold text-xs text-[#0A0A0A] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#6B7280] mt-0.5 truncate">{user.email}</p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-transparent"
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </aside>
    );

}