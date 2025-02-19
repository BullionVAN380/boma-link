export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function serializeDocument<T>(doc: any): T {
  const serialized = JSON.parse(JSON.stringify(doc));
  
  // Convert MongoDB ObjectId to string
  if (serialized._id && typeof serialized._id === 'object') {
    serialized._id = serialized._id.toString();
  }
  
  // Handle nested objects with ObjectIds (like references)
  Object.keys(serialized).forEach(key => {
    if (serialized[key] && typeof serialized[key] === 'object') {
      if (serialized[key]._id && typeof serialized[key]._id === 'object') {
        serialized[key]._id = serialized[key]._id.toString();
      }
    }
  });
  
  return serialized;
}

export function serializeDocuments<T>(docs: any[]): T[] {
  return docs.map(doc => serializeDocument<T>(doc));
}
