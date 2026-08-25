import { NextResponse } from 'next/server';
import { getInvoiceById, saveInvoice, deleteInvoice } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const invoice = getInvoiceById(id);
    if (!invoice) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = saveInvoice({ ...body, id });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = deleteInvoice(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete invoice' }, { status: 500 });
  }
}
