"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, LogOut, LayoutDashboard, SquareCheckBig, Target, Flame, CalendarDays, Bot, Bell, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

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

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: Props) {

    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        toast.success("Logged out successfully");
        router.push("/login");
    }

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40"
                onClick={onClose}
            />

            {/* Drawer */}
            <aside className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-6">

                    <div>
                        <h1 className="text-2xl font-bold">AI Productivity</h1>
                        <p className="text-sm text-gray-500 mt-1">Companion</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">

                    {menus.map((menu) => {

                        const Icon = menu.icon;
                        const active = pathname === menu.href;

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                onClick={onClose}
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

                {/* Footer */}
                <div className="border-t p-4 space-y-2">

                    {user && (
                        <div className="rounded-xl bg-gray-50 p-3 mb-2">
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
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
        </>
    );

}
