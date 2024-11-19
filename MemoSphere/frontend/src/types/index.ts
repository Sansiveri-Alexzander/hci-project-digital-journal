// src/types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
}

export type Screen =
    | 'home'
    | 'text-entry'
    | 'audio-entry'
    | 'image-entry'
    | 'entries'
    | 'reflect'
    | 'settings';

export interface FeelingOption {
    id: string;
    label: string;
    icon: React.ReactNode;
}

export interface ActivityOption {
    id: string;
    label: string;
    icon: React.ReactNode;
}

export * from './Entry';