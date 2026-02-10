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

### PUT `/api/updates`

Updates the update JSON data.

**Request Body:** Same structure as GET response

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

## Configuration

The update data is stored in `data/updates.json`. This file is created automatically on first save.

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
