# Tauri Updater Server

A Next.js web application for managing Tauri app updates using a JSON-based database.

## Features

- 📦 JSON-based update server following Tauri updater specification
- 🎨 Modern UI for managing update data
- 🔄 RESTful API endpoints
- 📝 Support for multiple platforms (Linux, Windows, macOS)
- ✨ Real-time JSON preview

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the admin interface.

### Production

```bash
npm run build
npm start
```

## API Endpoints

### GET `/api/updates`

Returns the current update JSON that Tauri apps will check.

**Response:**
```json
{
  "version": "1.0.0",
  "notes": "Release notes",
  "pub_date": "2026-02-10T00:00:00Z",
  "platforms": {
    "linux-x86_64": {
      "signature": "...",
      "url": "https://..."
    },
    "windows-x86_64": {
      "signature": "...",
      "url": "https://..."
    },
    "darwin-x86_64": {
      "signature": "...",
      "url": "https://..."
    },
    "darwin-aarch64": {
      "signature": "...",
      "url": "https://..."
    }
  }
}
```

### POST `/api/updates` or PUT `/api/updates`

Updates the update JSON data. Both POST and PUT methods are supported.

**Request Body:** Same structure as GET response

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

## Configuration

### Local Development

The update data is stored in `data/updates.json`. This file is created automatically on first save.

### Vercel Deployment

**Important:** Vercel serverless functions have a read-only file system, so file-based storage won't work. You have two options:

#### Option 1: Use Vercel KV (Recommended)

1. Install Vercel KV in your Vercel project dashboard
2. Add the environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
3. The app will automatically use KV for storage

#### Option 2: Use Environment Variables (Simple but limited)

For a simple setup, you can store the JSON in an environment variable, but this requires manual updates through Vercel's dashboard.

#### Option 3: Use a Database

You can modify the storage layer to use a database like Supabase, PlanetScale, or MongoDB.

## Tauri Configuration

Configure your Tauri app's `tauri.conf.json` to use this server:

```json
{
  "plugins": {
    "updater": {
      "pubkey": "YOUR_PUBLIC_KEY",
      "endpoints": [
        "https://your-domain.com/api/updates"
      ]
    }
  }
}
```

## Supported Platforms

- `linux-x86_64` - Linux x86_64
- `windows-x86_64` - Windows x86_64
- `darwin-x86_64` - macOS Intel
- `darwin-aarch64` - macOS Apple Silicon

## Notes

- The signature field should contain the **content** of the `.sig` file, not a path or URL
- Version must be a valid SemVer (with or without leading `v`)
- Publication date must be formatted according to RFC 3339
- All platform URLs must be valid HTTPS URLs (Tauri enforces TLS in production)
