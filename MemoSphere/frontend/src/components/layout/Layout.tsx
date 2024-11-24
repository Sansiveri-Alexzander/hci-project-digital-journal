// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { type } = useParams<{ type: string }>();
    const location = useLocation();

    // Close sidebar on location change
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    // Add styling for different entry types
    const renderStyling = () => {
        switch (type) {
            case 'text':
                return ' bg-text_entry';
            case 'audio':
                return ' bg-audio_entry';
            case 'image':
                return ' bg-image_entry';
            default:
                return ' bg-background';
        }
    };

    return (
        <div className={"min-h-screen" + renderStyling()}>
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