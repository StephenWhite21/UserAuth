import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    checkProtected: () => Promise<string | null>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Call the login API, store returned user info.
    const login = async (email: string, password: string) => {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Login successful:", data);
            setUser(data.user);
        } else {
            throw new Error(data.error || "Login failed");
        }
    };

    // Call the registration API, store returned user info.
    const register = async (email: string, password: string) => {
        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.ok) {
            console.log("Registration successful:", data);
            setUser(data.user);
        } else {
            throw new Error(data.error || "Registration failed");
        }
    };

    // Logout clears the session on the server and resets user data.
    const logout = async () => {
        await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    // Try to refresh the access token. Return true if successful; if not, clear user.
    const refreshToken = async () => {
        const response = await fetch("http://localhost:5000/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });
        if (response.ok) {
            return true;
        }
        setUser(null);
        return false;
    };

    // Make a protected API call. If the access token is expired, try to refresh it.
    const checkProtected = async (): Promise<string | null> => {
        let response = await fetch("http://localhost:5000/api/protected", {
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            return data.message;
        } else if (response.status === 401 || response.status === 403) {
            // Attempt a token refresh if unauthorized.
            const refreshed = await refreshToken();
            if (refreshed) {
                response = await fetch("http://localhost:5000/api/protected", {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    return data.message;
                }
            }
            setUser(null);
            return null;
        } else {
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                refreshToken,
                checkProtected,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
