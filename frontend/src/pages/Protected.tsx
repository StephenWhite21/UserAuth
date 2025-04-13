import { useState } from "react";
import { useAuth } from "../AuthContext";

const ProtectedPage = () => {
    const { checkProtected, logout, user } = useAuth();
    const [message, setMessage] = useState<string>("");

    const handleCheck = async () => {
        const msg = await checkProtected();
        setMessage(
            msg || "No message retrieved – check your token or refresh logic."
        );
    };

    return (
        <div className="mt-5">
            <h1>Protected Page</h1>
            <p>Welcome, {user?.email}!</p>
            <button onClick={handleCheck} className="btn btn-primary me-3">
                Test Protected API
            </button>
            <button onClick={logout} className="btn btn-danger">
                Logout
            </button>
            {message && (
                <div className="alert alert-info mt-3" role="alert">
                    {message}
                </div>
            )}
        </div>
    );
};

export default ProtectedPage;
