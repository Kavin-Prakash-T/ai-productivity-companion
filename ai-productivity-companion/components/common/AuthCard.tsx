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
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300">

            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
                {title}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
                {subtitle}
            </p>

            <div className="mt-8">
                {children}
            </div>

        </div>
    );
}