import { Entry, ContentType, Feeling, Activity } from '@/types/Entry';

const STORAGE_KEY = 'memosphere_entries';

export class EntryStorage {
  private static instance: EntryStorage;

  private constructor() {}

  static getInstance(): EntryStorage {
    if (!EntryStorage.instance) {
      EntryStorage.instance = new EntryStorage();
    }
    return EntryStorage.instance;
  }

  getAllEntries(): Entry[] {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  }

  saveEntry(entry: Omit<Entry, 'id' | 'date'>): Entry {
    const entries = this.getAllEntries();
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    entries.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    
    return newEntry;
  }

  getEntryById(id: string): Entry | undefined {
    return this.getAllEntries().find(entry => entry.id === id);
  }

  deleteEntry(id: string): void {
    const entries = this.getAllEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    
    // Also delete any reflections linked to this entry
    const filteredEntries = updatedEntries.filter(entry => entry.linkedEntryId !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  }

  saveReflection(reflection: Omit<Entry, 'id' | 'date'>): Entry {
    if (!reflection.linkedEntryId) {
        throw new Error('Reflection must have a linkedEntryId');
    }

    const originalEntry = this.getEntryById(reflection.linkedEntryId);
    if (!originalEntry) {
        throw new Error('Original entry not found');
    }

    const newReflection: Entry = {
        ...reflection,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        isReflection: true
    };

    const entries = this.getAllEntries();
    entries.unshift(newReflection);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

    return newReflection;
  }

  getReflectionChain(entryId: string): Entry[] {
      const entries = this.getAllEntries();
      const chain: Entry[] = [];
      let currentId = entryId;

      while (currentId) {
          const entry = entries.find(e => e.id === currentId);
          if (!entry) break;
          
          chain.push(entry);
          currentId = entry.linkedEntryId || '';
      }
      
      return chain;
  }
}