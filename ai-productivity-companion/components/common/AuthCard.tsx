import { ReactNode } from "react";

interface Props {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export default function AuthCard({
    title,
    subtitle,
    children,
}: Props) {
    return (
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

            <h1 className="text-3xl font-bold">
                {title}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
                {subtitle}
            </p>

            <div className="mt-8">
                {children}
            </div>

        </div>
    );
}