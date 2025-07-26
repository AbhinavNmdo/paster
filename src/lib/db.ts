import { MongoClient, WithId, Document } from 'mongodb';
import { randomBytes } from 'crypto';

export interface Paste {
  id: string;
  content: string;
  language: string;
  createdAt: Date;
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClient(): Promise<MongoClient> {
  if (client && clientPromise) {
    return clientPromise;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
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
    return db.collection<Paste>('pastes');
}

function fromMongo<T extends Document>(doc: WithId<T> | null): T | undefined {
    if (!doc) {
        return undefined;
    }
    const { _id, ...rest } = doc;
    return rest as T;
}

export async function savePaste(content: string, language: string): Promise<string> {
  const id = randomBytes(4).toString('hex');
  const newPaste: Paste = {
    id,
    content,
    language,
    createdAt: new Date(),
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
