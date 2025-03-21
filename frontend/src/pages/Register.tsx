import { Link } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";

const Register = () => {
    const handleRegister = async (formData: {
        email: string;
        password: string;
    }) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            if (response.ok) {
                console.log("Registration successful:", data);
                // Redirect or show success message
            } else {
                console.error("Registration error:", data.error);
                // Show error message to user
            }
        } catch (error) {
            console.error("Error registering:", error);
            // Handle error
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
