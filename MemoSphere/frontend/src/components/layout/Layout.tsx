// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onMenuToggle={() => setIsSidebarOpen(true)}
                onSearchToggle={() => setIsSearchOpen(true)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main content */}
            <main className="pt-16 min-h-[calc(100vh-4rem)]">
                <div className="container mx-auto px-4 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;