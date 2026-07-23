"use client";

import Link from "next/link";

import {
    User,
    Mail,
    Calendar,
    Pencil
} from "lucide-react";

export default function ProfileCard() {

    const user = {

        name: "Kavin",
        email: "kavin@gmail.com",
        joined: "July 2026",
        avatar: ""

    };

    return (

        <div className="max-w-4xl mx-auto space-y-8">

            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold">
                    Profile
                </h1>

                <Link
                    href="/profile/edit"
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
                >

                    <Pencil size={18} />

                    Edit

                </Link>

            </div>

            <div className="rounded-2xl border bg-white p-8">

                <div className="flex flex-col md:flex-row gap-8 items-center">

                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-black text-white">

                        <User size={60} />

                    </div>

                    <div className="space-y-4">

                        <h2 className="text-3xl font-bold">

                            {user.name}

                        </h2>

                        <div className="flex items-center gap-3">

                            <Mail size={18} />

                            {user.email}

                        </div>

                        <div className="flex items-center gap-3">

                            <Calendar size={18} />

                            Joined {user.joined}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}