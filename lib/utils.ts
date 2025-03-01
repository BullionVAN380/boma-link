import { Types } from 'mongoose';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function isObjectId(value: any): value is Types.ObjectId {
  return value instanceof Types.ObjectId;
}

function serializeValue(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  // Handle ObjectId
  if (isObjectId(value)) {
    return value.toString();
  }

  // Handle Date
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Handle Buffer/Uint8Array
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return value.toString('hex');
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => serializeValue(item));
  }

  // Handle plain objects
  if (typeof value === 'object') {
    const serialized: any = {};
    for (const [key, val] of Object.entries(value)) {
      // Skip internal Mongoose properties
      if (key.startsWith('_') && key !== '_id') {
        continue;
      }
      serialized[key] = serializeValue(val);
    }
    return serialized;
  }

  return value;
}

export function serializeDocument<T>(doc: any): T {
  if (!doc) {
    return doc;
  }

  // If the document has a toObject method (Mongoose document), use it
  const obj = doc.toObject ? doc.toObject() : doc;
  return serializeValue(obj);
}

export function serializeDocuments<T>(docs: any[]): T[] {
  return docs.map(doc => serializeDocument<T>(doc));
}
