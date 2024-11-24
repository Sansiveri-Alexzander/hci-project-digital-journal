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

  async getAllEntries(): Promise<Entry[]> {
    return new Promise((resolve) => {
      const entries = localStorage.getItem(STORAGE_KEY);
      resolve(entries ? JSON.parse(entries) : []);
    });
  }

  async saveEntry(entry: Omit<Entry, 'id' | 'date'>): Promise<Entry> {
    const entries = await this.getAllEntries();
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    entries.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    
    return newEntry;
  }

  async getEntryById(id: string): Promise<Entry | undefined> {
    const entries = await this.getAllEntries();
    return entries.find(entry => entry.id === id);
  }

  async getReflectionChain(entryId: string): Promise<Entry[]> {
    const entries = await this.getAllEntries();
    const chain: Entry[] = [];
    let currentId = entryId;

    while (currentId) {
      const entry = entries.find(e => e.id === currentId);
      if (!entry || !entry.isReflection) break;
      
      chain.push(entry);
      currentId = entry.linkedEntryId || '';
    }

    return chain;
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = await this.getAllEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    
    // Also delete any reflections linked to this entry
    const filteredEntries = updatedEntries.filter(entry => entry.linkedEntryId !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  }
}