// src/components/base/Button.tsx
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'default',
                                           size = 'default',
                                           className = '',
                                           ...props
                                       }) => {
    return (
        <ShadcnButton
            className={`font-medium ${className}`}
            {...props}
        >
            {children}
        </ShadcnButton>
    );
};

export default Button;