import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Protected from "../pages/Protected";
import { ReactNode } from "react";
import { useAuth } from "../AuthContext";

interface Props {
    children: ReactNode;
}

const RequireAuth = ({ children }: Props) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/protected"
                element={
                    <RequireAuth>
                        <Protected />
                    </RequireAuth>
                }
            />
        </Routes>
    );
}

export default AppRoutes;
