import { messages, documents, type Message, type InsertMessage, type Document, type InsertDocument } from "@shared/schema";

export interface IStorage {
  // Message operations
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Document operations
  getDocuments(cdp: string): Promise<Document[]>;
  searchDocuments(cdp: string, query: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private documents: Map<number, Document>;
  private currentMessageId: number;
  private currentDocumentId: number;

  constructor() {
    this.messages = new Map();
    this.documents = new Map();
    this.currentMessageId = 1;
    this.currentDocumentId = 1;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      id,
      createdAt: new Date(),
      question: insertMessage.question,
      answer: insertMessage.answer,
      cdp: insertMessage.cdp,
      sources: insertMessage.sources || null,
    };
    this.messages.set(id, message);
    return message;
  }

  async getDocuments(cdp: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.cdp === cdp);
  }

  async searchDocuments(cdp: string, query: string): Promise<Document[]> {
    const lowercaseQuery = query.toLowerCase();
    const keywords = lowercaseQuery
      .split(' ')
      .filter(word => !['how', 'to', 'do', 'i', 'can', 'you', 'the', 'in'].includes(word));

    return Array.from(this.documents.values())
      .filter(doc => {
        if (doc.cdp !== cdp) return false;

        // Check for exact matches in title
        if (doc.title.toLowerCase().includes(lowercaseQuery)) return true;

        // Check for keyword matches in content
        return keywords.some(keyword => 
          doc.content.toLowerCase().includes(keyword) ||
          doc.title.toLowerCase().includes(keyword)
        );
      });
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = {
      ...insertDoc,
      id,
      createdAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }
}

export const storage = new MemStorage();