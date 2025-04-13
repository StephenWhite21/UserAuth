import { Link, useNavigate } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";
import { useAuth } from "../AuthContext";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (formData: {
        email: string;
        password: string;
    }) => {
        try {
            await register(formData.email, formData.password);
            console.log("Registration successful");
            navigate("/protected");
        } catch (err) {
            console.error("Registration error:", err);
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
                <h2 className="mb-3">Create an Account</h2>
                <RegistrationForm onSubmit={handleRegister} />
                <div className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link
                        className="fw-semibold link-underline link-underline-opacity-0"
                        to="/login"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
