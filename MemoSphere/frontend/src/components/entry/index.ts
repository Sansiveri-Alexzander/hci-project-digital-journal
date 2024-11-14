// src/components/entry/index.ts
export { default as TextEntry } from './TextEntry';
export { default as AudioEntry } from './AudioEntry';
export { default as ImageEntry } from './ImageEntry';

export type EntryType = 'text' | 'audio' | 'image';