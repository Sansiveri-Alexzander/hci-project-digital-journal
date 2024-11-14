// src/components/layout/Header.tsx
import React from 'react';
import { Menu, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    onMenuToggle: () => void;
    onSearchToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onSearchToggle }) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="container mx-auto h-full px-4">
                <div className="flex items-center justify-between h-full">
                    {/* Left side */}
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2"
                            onClick={onMenuToggle}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900">MemoSphere</h1>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onSearchToggle}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button size="icon">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;