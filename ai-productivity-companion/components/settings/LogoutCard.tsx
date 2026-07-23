"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutCard() {

    const router = useRouter();
    const { logout } = useAuth();

    async function handleLogout() {
        try {
            logout();
            toast.success("Logged out successfully");
            router.push("/login");
        }
        catch {
            toast.error("Logout failed");
        }
    }

    return (
        <div className="rounded-2xl border bg-white p-6">
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition"
            >
                <LogOut size={20} />
                Logout
            </button>
        </div>
    );

}