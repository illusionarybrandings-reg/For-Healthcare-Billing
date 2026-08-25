import { NextResponse } from 'next/server';
import { getPatients, savePatient } from '@/lib/db';

export async function GET() {
  try {
    const patients = getPatients();
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = savePatient(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save patient' }, { status: 500 });
  }
}
