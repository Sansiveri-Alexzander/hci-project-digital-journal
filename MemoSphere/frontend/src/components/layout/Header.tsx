// src/components/layout/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import logo from "@/assets/MemosphereLogo.svg";

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
                    <div className="flex items-center gap-2 h-16 max-h-16 overflow-hidden">
                        <Button
                            onClick={onMenuToggle}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Button
                            className="font-semibold text-lg"
                            onClick={() => navigate('/')}
                        >
                            MemoSphere
                        </Button>
                        <img src={logo} className="h-full max-h-8 w-auto" alt="MemoSphere Logo" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;