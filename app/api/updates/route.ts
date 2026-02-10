import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

// GET - Return the updates JSON
export async function GET() {
  try {
    const data = await readData();
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

// Helper function to update the JSON
async function updateData(body: any) {
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

  try {
    await writeData(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    console.error('Error updating updates file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update updates data' },
      { status: 500 }
    );
  }
}

// PUT - Update the updates JSON
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return updateData(body);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }
}

// POST - Update the updates JSON (alternative to PUT for better compatibility)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return updateData(body);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }
}
