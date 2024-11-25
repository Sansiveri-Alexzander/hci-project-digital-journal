// src/components/layout/Sidebar.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Book,
    RefreshCw,
    Search,
    X,
    PenLine,
    Mic,
    Camera
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/MemosphereLogo.svg";
import '../../animations.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/' },
        { icon: <Book className="h-5 w-5" />, label: 'All Entries', path: '/entries' },
        { icon: <RefreshCw className="h-5 w-5" />, label: 'Reflect', path: '/reflect' },
        { icon: <Search className="h-5 w-5" />, label: 'Search', path: '/search' },
    ];

    const quickEntryButtons = [
        {
            icon: <PenLine className="h-4 w-4" />,
            label: 'Text',
            path: '/create/text',
            description: 'Write your thoughts',
            className: 'text-entry'
        },
        {
            icon: <Mic className="h-4 w-4" />,
            label: 'Audio',
            path: '/create/audio',
            description: 'Record your voice',
            className: 'audio-entry'
        },
        {
            icon: <Camera className="h-4 w-4" />,
            label: 'Image',
            path: '/create/image',
            description: 'Capture a moment',
            className: 'image-entry'
        },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 w-64 bg-background border-r border-border",
                    "transform transition-transform duration-200 ease-in-out z-50",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="h-16 border-b border-border px-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">MemoSphere</h2>
                    <img src={logo} className="h-full max-h-8 w-auto" alt="MemoSphere Logo" />
                    <Button onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <div className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            className={cn(
                                "w-full justify-start gap-3 text-base font-medium",
                                location.pathname === item.path && "bg-muted"
                            )}
                            onClick={() => handleNavigation(item.path)}
                        >
                            {item.icon}
                            {item.label}
                        </Button>
                    ))}
                </div>

                {/* Quick Entry Section */}
                <div className="p-4 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Entry</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {quickEntryButtons.map((button) => (
                            <Button
                                key={button.path}
                                className={`animated-button ${button.className} flex flex-col items-center py-4 gap-2 h-auto`}
                                onClick={() => handleNavigation(button.path)}
                                title={button.description}
                            >
                                {button.icon}
                                <span className="text-xs">{button.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <Button
                        className="w-full justify-center"
                        onClick={() => {
                            // Handle sign in/out
                            console.log('Toggle auth');
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