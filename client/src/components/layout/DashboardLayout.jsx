import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DashboardLayout = ({ children, onPreview, openFolder }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar  = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen overflow-hidden w-full
            bg-gradient-to-br from-blue-50 via-white to-cyan-50">

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
                <Navbar
                    onPreview={onPreview}
                    openFolder={openFolder}
                    onMenuClick={toggleSidebar}
                />

                <main className="flex-1 overflow-y-auto p-6 relative z-0">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;