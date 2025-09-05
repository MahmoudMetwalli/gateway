/**
 * Utility functions for handling BigInt serialization
 */

/**
 * Converts BigInt values to strings in an object recursively
 */
export function serializeBigInt<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return String(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeBigInt(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serializeBigInt(obj[key]);
      }
    }
    return serialized;
  }
  
  return obj;
}

/**
 * JSON.stringify replacer function for BigInt
 */
export function bigIntReplacer(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}
