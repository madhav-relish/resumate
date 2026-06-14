import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data.json');

export async function GET() {
  try {
    // Check if the file exists
    try {
      await fs.access(DATA_FILE_PATH);
    } catch {
      // If it doesn't exist, return empty object so the frontend can use its initialData
      return NextResponse.json({ data: null });
    }

    const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing data:', error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
