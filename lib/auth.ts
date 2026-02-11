/**
 * Authentication utilities for the Tauri Updater Server
 */

// Generate authorization token from secret
export function generateToken(secret: string = 'meetgeek'): string {
  return Buffer.from(secret).toString('base64');
}

// Decode token to verify
export function decodeToken(token: string): string {
  try {
    return Buffer.from(token, 'base64').toString('utf-8');
  } catch (error) {
    throw new Error('Invalid token format');
  }
}

// Get the default token for "meetgeek"
export const DEFAULT_TOKEN = generateToken('meetgeek');

// Example: DEFAULT_TOKEN = "bWVldGdlZWs="
