import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);