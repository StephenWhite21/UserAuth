import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

export interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    checkProtected: () => Promise<string | null>;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

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
            setAccessToken(data.accessToken);
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
            setAccessToken(data.accessToken);
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
        setAccessToken(null);
    };

    // Try to refresh the access token. Return true if successful; if not, clear user.
    const refreshToken = async () => {
        const response = await fetch("http://localhost:5000/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            if (data.user) {
                setUser(data.user);
            }
            console.log(data.user);
            if (data.accessToken) {
                setAccessToken(data.accessToken);
            }
            console.log(data.accessToken);
            return true;
        }
        setUser(null);
        setAccessToken(null);
        return false;
    };

    // Make a protected API call. If the access token is expired, try to refresh it.
    const checkProtected = async (): Promise<string | null> => {
        // Attach the Bearer token if available
        let response = await fetch("http://localhost:5000/api/protected", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data.message;
        } else if (response.status === 401 || response.status === 403) {
            // Attempt a token refresh if unauthorized.
            const refreshed = await refreshToken();
            if (refreshed) {
                // Retry the request with the new token.
                response = await fetch("http://localhost:5000/api/protected", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: accessToken
                            ? `Bearer ${accessToken}`
                            : "",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    return data.message;
                }
            }
            setUser(null);
            setAccessToken(null);
            return null;
        } else {
            return null;
        }
    };

    // Silent refresh on mount
    useEffect(() => {
        const initializeAuth = async () => {
            // Try to refresh first to ensure you have the latest access token.
            const refreshed = await refreshToken();

            if (refreshed && accessToken) {
                // Now use the accessToken from the state to call /api/auth/me
                const response = await fetch(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            }
        };

        initializeAuth();
    }, [accessToken]); // Run this effect when accessToken is updated// Empty dependency ensures this runs only once when the AuthProvider mounts.

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                register,
                logout,
                refreshToken,
                checkProtected,
                setUser,
                setAccessToken,
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
