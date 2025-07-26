import { MongoClient, WithId, Document } from 'mongodb';
import { randomBytes } from 'crypto';

export interface Paste {
  id: string;
  content: string;
  language: string;
  hasPassword?: boolean;
  createdAt: Date;
  expiresAt?: Date | null;
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClient(): Promise<MongoClient> {
  if (client && clientPromise) {
    return clientPromise;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    // This will now throw a more explicit error if the URI is missing.
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }

  client = new MongoClient(MONGODB_URI, {});
  clientPromise = client.connect();
  
  return clientPromise;
}

const dbName = 'text-sharer';

async function getPastesCollection() {
    const client = await getClient();
    const db = client.db(dbName);
    const collection = db.collection<Paste>('pastes');
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    return collection;
}

function fromMongo<T extends Document>(doc: WithId<T> | null): T | undefined {
    if (!doc) {
        return undefined;
    }
    const { _id, ...rest } = doc;
    return rest as T;
}

const expirationMap: Record<string, number | null> = {
  'never': null,
  '10m': 10 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
}

export async function savePaste(content: string, language: string, hasPassword?: boolean, expires?: string): Promise<string> {
  const id = randomBytes(4).toString('hex');
  
  const now = new Date();
  let expiresAt: Date | null = null;

  if (expires && expirationMap[expires]) {
    expiresAt = new Date(now.getTime() + expirationMap[expires]!);
  }
  
  const newPaste: Paste = {
    id,
    content,
    language,
    hasPassword: !!hasPassword,
    createdAt: now,
    expiresAt,
  };
  
  const pastes = await getPastesCollection();
  await pastes.insertOne(newPaste);
  return id;
}

export async function getPaste(id: string): Promise<Paste | undefined> {
  const pastes = await getPastesCollection();
  const pasteDoc = await pastes.findOne({ id });
  return fromMongo(pasteDoc);
}

export async function isPastePasswordProtected(id: string): Promise<boolean> {
  const paste = await getPaste(id);
  return !!paste?.hasPassword;
}
