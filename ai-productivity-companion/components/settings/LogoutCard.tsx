"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { LogOut } from "lucide-react";

import { logout } from "@/services/settingsService";

export default function LogoutCard() {

    const router = useRouter();

    async function handleLogout() {

        try {

            await logout();

            localStorage.removeItem("token");

            toast.success("Logged out");

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
                className="flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3 text-white"
            >

                <LogOut size={20} />

                Logout

            </button>

        </div>

    );

}