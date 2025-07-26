'use server';

import { getPaste, isPastePasswordProtected, Paste } from "@/lib/db";

export async function getPasteData(id: string): Promise<Paste | undefined> {
  return await getPaste(id);
}

// Return boolean or null if not found
export async function isPasteProtected(id: string): Promise<boolean | null> {
    const paste = await getPaste(id);
    if (!paste) {
        return null;
    }
    return !!paste.hasPassword;
}
