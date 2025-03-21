import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const Login = () => {
    const handleLogin = async (formData: {
        email: string;
        password: string;
    }) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                    credentials: "include", // if you're using cookies for tokens
                }
            );

            const data = await response.json();
            if (response.ok) {
                console.log("Login successful:", data);
                // Possibly store tokens in localStorage or handle them in cookies
                // redirect user, etc.
            } else {
                console.error("Login error:", data.error);
            }
        } catch (err) {
            console.error("Error logging in:", err);
        }
    };

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >
            <div
                className="card p-4"
                style={{ maxWidth: "400px", width: "100%" }}
            >
                <h2 className="mb-3">Login</h2>
                <LoginForm onSubmit={handleLogin} />
                <div className="mt-3 text-center">
                    Don’t have an account?{" "}
                    <Link
                        className="fw-semibold link-underline link-underline-opacity-0"
                        to="/register"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
