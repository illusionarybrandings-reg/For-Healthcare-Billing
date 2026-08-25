'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import InvoiceForm from '@/components/InvoiceForm';
import { Invoice } from '@/types';

export default function NewInvoicePage() {
  const router = useRouter();

  const handleSave = async (invoicePayload: Partial<Invoice>) => {
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload),
      });

      const json = await res.json();
      if (json.success) {
        router.push(`/invoices/${json.data.id}`);
      } else {
        alert(json.error || 'Failed to save invoice');
      }
    } catch (err) {
      alert('Error creating invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Create New Invoice / Bill</h1>
        <p className="text-xs text-slate-500">Fill in patient, care, and service details to generate a printable bill</p>
      </div>

      <InvoiceForm onSave={handleSave} />
    </div>
  );
}
