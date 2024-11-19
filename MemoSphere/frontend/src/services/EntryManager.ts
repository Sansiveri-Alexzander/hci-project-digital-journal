import { Entry, ContentType, Feeling, Activity, EntryContent, BinaryContent } from '@/types/Entry';
import { EntryStorage } from './storage/EntryStorage';

export class EntryManager {
  private storage: EntryStorage;

  constructor() {
    this.storage = EntryStorage.getInstance();
  }

  private async convertContentForStorage(content: EntryContent, contentType: ContentType): Promise<string> {
    if (contentType === 'text') {
      return content as string;
    }

    // Check if content is binary (Blob or File)
    const isBinaryContent = (value: unknown): value is BinaryContent => {
      return value instanceof Blob || value instanceof File;
    };

    if (isBinaryContent(content)) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(content);
      });
    }

    return content as string;
  }

  async createEntry(
    contentType: ContentType,
    content: EntryContent,
    title: string,
    feelings: Feeling[],
    activities: Activity[],
    isReflection: boolean = false,
    linkedEntryId?: string
  ): Promise<Entry> {
    // Convert content to storable format based on type
    const storedContent = await this.convertContentForStorage(content, contentType);

    const entryData: Omit<Entry, 'id' | 'date'> = {
      contentType,
      content: storedContent,
      title,
      feelings,
      activities,
      isReflection,
      linkedEntryId
    };

    return this.storage.saveEntry(entryData);
  }

  async getAllEntries(): Promise<Entry[]> {
    const entries = await this.storage.getAllEntries();
    return entries.map(entry => this.processEntryContent(entry));
  }

  async getEntryById(id: string): Promise<Entry | undefined> {
    const entry = await this.storage.getEntryById(id);
    return entry ? this.processEntryContent(entry) : undefined;
  }

  private processEntryContent(entry: Entry): Entry {
    // Process content based on type if needed
    // For now, just return the entry as is since base64 strings work directly
    return entry;
  }

  async getReflectionChain(entryId: string): Promise<Entry[]> {
    const chain = await this.storage.getReflectionChain(entryId);
    return chain.map(entry => this.processEntryContent(entry));
  }

  async deleteEntry(id: string): Promise<void> {
    return this.storage.deleteEntry(id);
  }
}