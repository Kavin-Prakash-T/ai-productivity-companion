"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Desktop sidebar */}
            <Sidebar />

            {/* Mobile sidebar */}
            <MobileSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex flex-1 flex-col min-w-0">

                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>

            </div>

        </div>
    );

}