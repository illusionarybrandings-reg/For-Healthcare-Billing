'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InvoiceForm from '@/components/InvoiceForm';
import { Invoice } from '@/types';

export default function EditInvoicePage() {
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

  const handleUpdate = async (invoicePayload: Partial<Invoice>) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload),
      });

      const json = await res.json();
      if (json.success) {
        router.push(`/invoices/${id}`);
      } else {
        alert(json.error || 'Failed to update invoice');
      }
    } catch (err) {
      alert('Error updating invoice');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading invoice for editing...</div>;
  }

  if (!invoice) {
    return <div className="py-20 text-center text-xs text-slate-500">Invoice not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Edit Invoice {invoice.invoiceNo}</h1>
        <p className="text-xs text-slate-500">Update patient, care, or service line items</p>
      </div>

      <InvoiceForm initialData={invoice} onSave={handleUpdate} isEditing={true} />
    </div>
  );
}
