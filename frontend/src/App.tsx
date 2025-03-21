import { useState } from "react";
import AppRoutes from "./routes/Routes";
import "./App.css";

function App() {
    return (
        <>
            <div className="container mt-4">
                <AppRoutes />
            </div>
        </>
    );
}

export default App;
