"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import Button from "../common/Button";
import { getProfile, updateProfile } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileForm() {

    const router = useRouter();
    const { login } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: ""
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data } = await getProfile();
                const user = data.data?.user ?? data.user;
                setForm({
                    name: user.name || "",
                    email: user.email || ""
                });
            } catch {
                toast.error("Failed to load profile details");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit() {

        if (!form.name.trim() || !form.email.trim()) {
            return toast.error("All fields are required");
        }

        try {
            setSaving(true);
            const { data } = await updateProfile(form);
            const updatedUser = data.data?.user ?? data.user;

            // Update user in context/localStorage
            const token = localStorage.getItem("token") || "";
            login(token, updatedUser);

            toast.success(data.message || "Profile updated successfully");
            router.push("/profile");
            router.refresh();
        }
        catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Update failed"
            );
        }
        finally {
            setSaving(false);
        }

    }

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    href="/profile"
                    className="rounded-xl border p-2 hover:bg-gray-100 transition"
                >
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-3xl font-bold">Edit Profile</h1>
            </div>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                    />
                </div>

                <Button
                    title={saving ? "Updating..." : "Update Profile"}
                    onClick={handleSubmit}
                    disabled={saving}
                />

            </div>

        </div>
    );

}