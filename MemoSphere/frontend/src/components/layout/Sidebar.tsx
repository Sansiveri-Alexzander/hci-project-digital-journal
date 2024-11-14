// src/components/layout/Sidebar.tsx
import React from 'react';
import { X, Home, Book, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const menuItems = [
        { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/' },
        { icon: <Book className="h-5 w-5" />, label: 'All Entries', path: '/entries' },
        { icon: <RefreshCw className="h-5 w-5" />, label: 'Reflect', path: '/reflect' },
        { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
                    <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Button
                                key={item.path}
                                variant="ghost"
                                className="w-full justify-start text-base font-medium"
                                onClick={() => {
                                    // Handle navigation
                                    onClose();
                                }}
                            >
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                            </Button>
                        ))}
                    </div>
                </nav>

                {/* User section at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <Button
                        variant="outline"
                        className="w-full justify-center"
                        onClick={() => {
                            // Handle sign in/out
                            onClose();
                        }}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;