// src/components/layout/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-40">
            <div className="container mx-auto h-full px-4">
                <div className="flex items-center justify-between h-full">
                    {/* Left side */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuToggle}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="font-semibold text-lg"
                            onClick={() => navigate('/')}
                        >
                            MemoSphere
                        </Button>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/search')}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={() => navigate('/create/text')}
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;