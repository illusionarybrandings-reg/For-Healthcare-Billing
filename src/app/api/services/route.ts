import { NextResponse } from 'next/server';
import { getServices, saveService } from '@/lib/db';

export async function GET() {
  try {
    const services = getServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = saveService(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save service' }, { status: 500 });
  }
}
