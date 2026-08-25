import { NextResponse } from 'next/server';
import { getInvoices, saveInvoice } from '@/lib/db';

export async function GET() {
  try {
    const invoices = getInvoices();
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.patName) {
      return NextResponse.json({ success: false, error: 'Patient name is required' }, { status: 400 });
    }
    const created = saveInvoice(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save invoice' }, { status: 500 });
  }
}
