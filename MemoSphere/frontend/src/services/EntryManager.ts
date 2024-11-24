import { Entry, ContentType, Feeling, Activity, EntryContent, BinaryContent, ImageContent } from '@/types/Entry';
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

    if (contentType === 'image') {
      const imageContent = content as ImageContent;
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
              // Store both the image data and caption
              const storedContent = {
                  imageData: reader.result as string,
                  caption: imageContent.caption
              };
              resolve(JSON.stringify(storedContent));
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageContent.image);
      });
    }

    // Handle audio content
    if (contentType === 'audio' && (content instanceof Blob || content instanceof File)) {
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
    linkedEntryId?: string,
    prompt?: string
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
      linkedEntryId,
      prompt
    };

    return this.storage.saveEntry(entryData);
  }

  async getAllEntries(): Promise<Entry[]> {
    const entries = await this.storage.getAllEntries();
    return Promise.all(entries.map(entry => this.processEntryContent(entry)));
  }

  async getEntryById(id: string): Promise<Entry | undefined> {
    const entry = await this.storage.getEntryById(id);
    return entry ? this.processEntryContent(entry) : undefined;
  }

  private async processEntryContent(entry: Entry): Promise<Entry> {
    if (entry.contentType === 'image') {
        try {
            // Parse the stored JSON string back into an object
            const parsedContent = JSON.parse(entry.content as string);
            return {
                ...entry,
                content: parsedContent
            };
        } catch (error) {
            console.error('Error processing image content:', error);
            return entry;
        }
    }
    return entry;
}

  async getReflectionChain(entryId: string): Promise<Entry[]> {
    const chain = await this.storage.getReflectionChain(entryId);
    return Promise.all(chain.map(entry => this.processEntryContent(entry)));
  }

  async deleteEntry(id: string): Promise<void> {
    return this.storage.deleteEntry(id);
  }
}