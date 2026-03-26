import { Toaster } from "react-hot-toast";

const AppToaster = () => {
    return (
        <Toaster 
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(37, 99, 235, 0.15",
                    borderRadius: "12px",
                    color: "#334155",
                    fontSize: "13.5px",
                    fontWeight: "500",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.12)",
                    padding: "12px 16px",
                },
                success: {
                    iconTheme: {
                        primary: "#2563eb",
                        secondary: "white",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "white",
                    },
                },
                loading: {
                    iconTheme: {
                        primary: "#2563eb",
                        secondary: "rgba(37, 99, 236, 0.15)",
                    },
                },
            }}
        />
    );
};

export default AppToaster;