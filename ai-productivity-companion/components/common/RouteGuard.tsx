"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "./PageLoader";

export default function RouteGuard({
    children,
}: {
    children: React.ReactNode;
}) {

    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {

        if (!loading && !user) {
            router.replace("/login");
        }

    }, [user, loading, router]);

    if (loading) {
        return <PageLoader />;
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;

}
