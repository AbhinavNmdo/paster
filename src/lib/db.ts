// This is a simple in-memory database for demonstration purposes.
// In a real application, you would use a persistent database like MongoDB.

import { randomBytes } from 'crypto';

export interface Paste {
  id: string;
  content: string;
  language: string;
  createdAt: Date;
}

const pastes = new Map<string, Paste>();

export async function savePaste(content: string, language: string): Promise<string> {
  const id = randomBytes(4).toString('hex');
  const newPaste: Paste = {
    id,
    content,
    language,
    createdAt: new Date(),
  };
  pastes.set(id, newPaste);
  return id;
}

export async function getPaste(id: string): Promise<Paste | undefined> {
  return pastes.get(id);
}
