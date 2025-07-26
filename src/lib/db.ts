import { MongoClient, WithId, Document } from 'mongodb';
import { randomBytes } from 'crypto';

export interface Paste {
  id: string;
  content: string;
  language: string;
  createdAt: Date;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, {});
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, {});
  clientPromise = client.connect();
}

const dbName = 'text-sharer';

async function getPastesCollection() {
    const client = await clientPromise;
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
