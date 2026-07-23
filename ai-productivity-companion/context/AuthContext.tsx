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
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    }, []);

    function login(token: string, user: User) {
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