"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "../common/Button";
import { updateProfile } from "@/services/profileService";

export default function ProfileForm() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        name: "",
        email: ""

    });

    function handleChange(e: any) {

        setForm({

            ...form,
            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit() {

        try {

            setLoading(true);

            const { data } = await updateProfile(form);

            toast.success(data.message);

            router.push("/profile");

        }
        catch (error: any) {

            toast.error(

                error.response?.data?.message ||
                "Update failed"

            );

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-3xl mx-auto">

            <h1 className="mb-8 text-3xl font-bold">
                Edit Profile
            </h1>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border px-4"
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border px-4"
                />

                <Button
                    title={
                        loading
                            ? "Updating..."
                            : "Update Profile"
                    }
                    onClick={handleSubmit}
                />

            </div>

        </div>

    );

}