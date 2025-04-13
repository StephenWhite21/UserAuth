import { AuthProvider } from "./AuthContext";
import AppRoutes from "./routes/Routes";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <div className="container mt-4">
                <AppRoutes />
            </div>
        </AuthProvider>
    );
}

export default App;
