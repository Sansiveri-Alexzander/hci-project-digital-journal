// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on location change
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    return (
        <div className="min-h-screen bg-background">
            <Header
                onMenuToggle={() => setIsSidebarOpen(true)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="pt-16 min-h-[calc(100vh-4rem)]">
                <div className="h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;