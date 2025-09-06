/**
 * Utility functions for handling BigInt and Date serialization
 */

/**
 * Converts BigInt values and Date objects to appropriate types in an object recursively
 * For Date objects, converts to ISO string
 * For timestamps (very large BigInt values), converts to ISO string dates
 * For other BigInt values, converts to string
 */
export function serialize<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString() as T;
  }
  
  if (typeof obj === 'bigint') {
    // Check if this looks like a timestamp (microseconds since epoch)
    // PostgreSQL timestamps are typically very large numbers
    if (obj > 1000000000000000n) { // Microseconds threshold
      // Convert microseconds to milliseconds and create ISO string
      const milliseconds = Number(obj / 1000n);
      return new Date(milliseconds).toISOString() as T;
    }
    // For other BigInt values, convert to string
    return String(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serialize(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serialize(obj[key]);
      }
    }
    return serialized;
  }
  
  return obj;
}

/**
 * JSON.stringify replacer function for BigInt and Date objects
 */
export function bigIntReplacer(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}
