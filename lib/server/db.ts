import mongoose from 'mongoose';
import 'server-only';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

declare global {
  var _mongooseClientPromise: Promise<typeof mongoose> | undefined;
}

let clientPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongooseClientPromise) {
    global._mongooseClientPromise = mongoose.connect(MONGODB_URI);
  }
  clientPromise = global._mongooseClientPromise;
} else {
  clientPromise = mongoose.connect(MONGODB_URI);
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    return client;
  } catch (e) {
    console.error('Error connecting to database:', e);
    throw e;
  }
}
