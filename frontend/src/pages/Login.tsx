import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (formData: {
        email: string;
        password: string;
    }) => {
        try {
            await login(formData.email, formData.password);
            console.log("Login successful");
            navigate("/protected");
        } catch (err) {
            console.error("Login error:", err);
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
