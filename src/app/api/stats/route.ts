import { NextResponse } from 'next/server';
import { getInvoices, getPatients, getServices } from '@/lib/db';
import { computeInvoiceTotals } from '@/lib/currency';

export async function GET() {
  try {
    const invoices = getInvoices();
    const patients = getPatients();
    const services = getServices();

    let totalRevenue = 0;
    let totalPendingAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let draftCount = 0;

    invoices.forEach(inv => {
      const totals = computeInvoiceTotals(inv.items || [], inv.taxType || 'intra', inv.extraDiscount || 0);
      if (inv.status === 'Paid') {
        totalRevenue += totals.finalPayable;
        paidCount++;
      } else if (inv.status === 'Pending') {
        totalPendingAmount += totals.finalPayable;
        pendingCount++;
      } else if (inv.status === 'Draft') {
        draftCount++;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalInvoices: invoices.length,
        totalRevenue,
        totalPendingAmount,
        paidCount,
        pendingCount,
        draftCount,
        patientCount: patients.length,
        serviceCount: services.length,
        recentInvoices: invoices.slice(0, 5)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to calculate stats' }, { status: 500 });
  }
}
