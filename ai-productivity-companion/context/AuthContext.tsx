"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
        } else if (!token || !savedUser) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!user) return;

        const registerPush = async () => {
            try {
                if (typeof window === "undefined" || !("Notification" in window)) return;
                
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    console.log("Push notifications permission denied");
                    return;
                }

                const { getFcmToken } = await import("@/lib/firebase");
                const token = await getFcmToken();
                if (token) {
                    const { registerDevice } = await import("@/services/notificationService");
                    await registerDevice(token);
                    console.log("Push notifications registered successfully with token:", token);
                }
            } catch (error) {
                console.error("Error setting up push notifications:", error);
            }
        };

        const timer = setTimeout(registerPush, 2000);
        return () => clearTimeout(timer);
    }, [user]);

    function login(token: string, user: User) {
        if (!token || !user) {
            throw new Error("Invalid auth session data");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () =>
    useContext(AuthContext);