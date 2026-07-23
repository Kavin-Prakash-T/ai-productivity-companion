"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../common/Button";

import { changePassword } from "@/services/settingsService";

export default function ChangePasswordForm() {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        currentPassword: "",
        newPassword: "",
        confirmPassword: ""

    });

    function handleChange(e: any) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit() {

        if (form.newPassword !== form.confirmPassword) {

            return toast.error("Passwords do not match");

        }

        try {

            setLoading(true);

            const { data } = await changePassword(form);

            toast.success(data.message);

        }
        catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                "Unable to change password"
            );

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-2xl mx-auto">

            <h1 className="mb-8 text-3xl font-bold">
                Change Password
            </h1>

            <div className="rounded-2xl border bg-white p-8 space-y-5">

                <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={form.currentPassword}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border px-4"
                />

                <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border px-4"
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border px-4"
                />

                <Button
                    title={
                        loading
                            ? "Updating..."
                            : "Update Password"
                    }
                    onClick={handleSubmit}
                />

            </div>

        </div>

    );

}