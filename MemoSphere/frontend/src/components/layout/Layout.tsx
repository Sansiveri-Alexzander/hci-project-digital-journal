// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchToggle = () => {
        if (location.pathname !== '/search') {
            navigate('/search');
        }
        setIsSearchOpen(!isSearchOpen);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header
                onMenuToggle={() => setIsSidebarOpen(true)}
                onSearchToggle={handleSearchToggle}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNavigate={(path) => {
                    navigate(path);
                    setIsSidebarOpen(false);
                }}
            />

            <main className="pt-16 min-h-[calc(100vh-4rem)]">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;