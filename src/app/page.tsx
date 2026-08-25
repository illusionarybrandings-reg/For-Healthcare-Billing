'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import InvoiceForm from '@/components/InvoiceForm';
import { Invoice } from '@/types';

export default function HomePage() {
  const router = useRouter();

  const handleSaveInvoice = async (invoicePayload: Partial<Invoice>) => {
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
    <div className="w-full">
      <InvoiceForm onSave={handleSaveInvoice} />
    </div>
  );
}
