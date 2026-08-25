'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Invoice } from '@/types';
import { formatMoneyInteger, formatDateDisplay, computeInvoiceTotals } from '@/lib/currency';

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/invoices');
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data);
      }
    } catch (err) {
      console.error('Error fetching invoices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string, invNo: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${invNo}?`)) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setInvoices(invoices.filter(i => i.id !== id));
      } else {
        alert(json.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete invoice');
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.patId && inv.patId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.doctor && inv.doctor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Invoice History & Management</h1>
          <p className="text-xs text-slate-500">View, search, filter, print, and manage all Kaashvi Healthcare invoices</p>
        </div>
        <Link
          href="/invoices/new"
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md transition hover:-translate-y-0.5 inline-flex items-center gap-1.5 self-start md:self-auto"
        >
          + Create New Invoice
        </Link>
      </div>

      {/* Toolbar: Search + Filter Tabs */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Box */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search by patient, invoice no, doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg w-full md:w-auto text-xs font-semibold">
          {['All', 'Paid', 'Pending', 'Draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md transition ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No invoices found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0b3d66] text-white font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Invoice No.</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Patient Details</th>
                  <th className="py-3 px-4 text-left">Doctor & Care</th>
                  <th className="py-3 px-4 text-right">Grand Total (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const totals = computeInvoiceTotals(inv.items || [], inv.taxType || 'intra', inv.extraDiscount || 0);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold mono text-[#0b3d66] block">{inv.invoiceNo}</span>
                        <span className="text-[10px] text-slate-400">{inv.paymentMode || 'Cash'}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-600">
                        {formatDateDisplay(inv.invDate)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{inv.patName}</span>
                        <span className="text-[10px] text-slate-500">
                          {inv.patId ? `${inv.patId} · ` : ''}{inv.patAge ? `${inv.patAge} yrs` : ''}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-medium block">{inv.doctor || '-'}</span>
                        <span className="text-[10px] text-slate-400">{inv.roomBed || '-'}</span>
                      </td>

                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 mono text-sm">
                        {formatMoneyInteger(totals.finalPayable)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          inv.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="px-2.5 py-1 bg-[#0b3d66] hover:bg-[#124d7e] text-white font-bold text-[11px] rounded transition inline-block"
                        >
                          View / Print
                        </Link>

                        <Link
                          href={`/invoices/${inv.id}/edit`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded transition inline-block"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(inv.id, inv.invoiceNo)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] rounded transition"
                          title="Delete Invoice"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
