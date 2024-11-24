// First, define the basic content types
export type ContentType = 'text' | 'audio' | 'image';

// Define specific content types
export type EntryContent = string | BinaryContent | ImageContent;

export type BinaryContent = Blob | File;
export type ImageContent = {
  image: File;
  caption: string;
};

// Base interface for all entries
export interface BaseEntry {
  id: string;
  contentType: ContentType;
  content: EntryContent;
  date: string;
  title: string;
  feelings: Feeling[];
  activities: Activity[];
  isReflection: boolean;
  linkedEntryId?: string; // Optional reference to another entry if this is a reflection
  prompt?: string;
}

// No need for separate interfaces since the only difference is the optional linkedEntryId
export type Entry = BaseEntry;

export interface Feeling {
  id: string;
  name: string;
  intensity: number; // 1-5 scale
}

export interface Activity {
  id: string;
  name: string;
}