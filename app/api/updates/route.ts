import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

// GET - Return the updates JSON
export async function GET() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error reading updates file:', error);
    return NextResponse.json(
      { error: 'Failed to read updates data' },
      { status: 500 }
    );
  }
}

// PUT - Update the updates JSON
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.version || !body.platforms) {
      return NextResponse.json(
        { error: 'Missing required fields: version and platforms' },
        { status: 400 }
      );
    }

    // Validate platforms structure
    for (const [platform, platformData] of Object.entries(body.platforms)) {
      if (!platformData || typeof platformData !== 'object') {
        return NextResponse.json(
          { error: `Invalid platform data for ${platform}` },
          { status: 400 }
        );
      }
      if (!('signature' in platformData) || !('url' in platformData)) {
        return NextResponse.json(
          { error: `Platform ${platform} must have signature and url` },
          { status: 400 }
        );
      }
    }

    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write updated data
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Error updating updates file:', error);
    return NextResponse.json(
      { error: 'Failed to update updates data' },
      { status: 500 }
    );
  }
}
