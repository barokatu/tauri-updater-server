import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

export interface UpdateData {
  version: string;
  notes: string;
  pub_date: string;
  platforms: Record<string, {
    signature: string;
    url: string;
  }>;
}

// Default data structure
const DEFAULT_DATA: UpdateData = {
  version: "1.0.0",
  notes: "Initial release",
  pub_date: new Date().toISOString(),
  platforms: {
    "linux-x86_64": {
      signature: "",
      url: ""
    },
    "windows-x86_64": {
      signature: "",
      url: ""
    },
    "darwin-x86_64": {
      signature: "",
      url: ""
    },
    "darwin-aarch64": {
      signature: "",
      url: ""
    }
  }
};

// Try to use Vercel KV if available, otherwise fall back to file system
export async function readData(): Promise<UpdateData> {
  // Check if we're on Vercel and have KV available
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import('@vercel/kv');
      const data = await kv.get<UpdateData>('tauri-updates');
      if (data) {
        return data;
      }
    } catch (error) {
      console.error('Error reading from KV:', error);
    }
  }

  // Fallback to file system (works locally, not on Vercel)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContents = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(fileContents);
    }
  } catch (error) {
    console.error('Error reading from file system:', error);
  }

  // Return default data if nothing is found
  return DEFAULT_DATA;
}

export async function writeData(data: UpdateData): Promise<void> {
  // Check if we're on Vercel and have KV available
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import('@vercel/kv');
      await kv.set('tauri-updates', data);
      return;
    } catch (error) {
      console.error('Error writing to KV:', error);
      throw error;
    }
  }

  // Fallback to file system (works locally, not on Vercel)
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to file system:', error);
    throw new Error('File system writes are not supported on Vercel. Please configure Vercel KV or use a different hosting solution.');
  }
}
