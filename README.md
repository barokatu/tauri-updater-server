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

**Headers:**
- `Authorization: Bearer <token>` (Required)
  - The token is base64-encoded "meetgeek" by default
  - Can be customized via `AUTH_SECRET` environment variable
  - Example: `Authorization: Bearer bWVldGdlZWs=` (base64 of "meetgeek")

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

### Authentication

The GET endpoint requires an Authorization header. By default, the token is generated from the string "meetgeek" (base64 encoded: `bWVldGdlZWs=`).

You can customize the secret by setting the `AUTH_SECRET` environment variable:

```bash
AUTH_SECRET=your-secret-key
```

**Example request:**
```bash
curl -H "Authorization: Bearer bWVldGdlZWs=" https://your-domain.com/api/updates
```

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

Configure your Tauri app's `tauri.conf.json` to use this server. Note that Tauri updater plugin doesn't support custom headers directly, so you may need to use a proxy or modify the endpoint to include authentication in the URL (not recommended for production) or use a custom update server implementation.

For testing purposes, you can temporarily disable authentication or use a proxy server that adds the Authorization header.

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

**Note:** Since Tauri's updater plugin doesn't support custom headers, you have a few options:
1. Use a reverse proxy (nginx, Cloudflare Workers) to add the Authorization header
2. Implement a custom update check endpoint that doesn't require auth (less secure)
3. Use query parameters with a signed token (requires custom implementation)

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
