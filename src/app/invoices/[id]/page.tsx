'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Invoice } from '@/types';
import InvoiceSheet from '@/components/InvoiceSheet';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      if (!id) return;
      try {
        const res = await fetch(`/api/invoices/${id}`);
        const json = await res.json();
        if (json.success) {
          setInvoice(json.data);
        } else {
          alert('Invoice not found');
          router.push('/invoices');
        }
      } catch (err) {
        console.error('Failed to load invoice', err);
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [id, router]);

  const handleDownloadHtml = () => {
    if (!invoice) return;
    const sheetEl = document.getElementById('printableInvoiceArea');
    if (!sheetEl) return;
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNo}</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background: #f4f7fa; padding: 20px; }
    .mono { font-family: 'IBM Plex Mono', monospace; }
  </style>
</head>
<body>
  ${sheetEl.outerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Invoice_${invoice.invoiceNo.replace(/\//g, '_')}.html`;
    a.click();
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading invoice details...</div>;
  }

  if (!invoice) {
    return <div className="py-20 text-center text-xs text-slate-500">Invoice not found.</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <Link href="/invoices" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
            ← Back to Invoices List
          </Link>
          <h1 className="text-lg font-extrabold text-slate-900 mt-1 font-sans">
            Invoice {invoice.invoiceNo}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/invoices/${invoice.id}/edit`}
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs rounded-lg transition"
          >
            ✏️ Edit Invoice
          </Link>

          <button
            onClick={handleDownloadHtml}
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs rounded-lg transition"
          >
            💾 Save HTML
          </button>

          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-[#0b3d66] hover:bg-[#124d7e] text-white font-extrabold text-xs rounded-lg shadow-md transition"
          >
            🖨️ Print Invoice
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <InvoiceSheet invoice={invoice} />

    </div>
  );
}
