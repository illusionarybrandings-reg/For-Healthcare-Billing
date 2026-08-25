'use client';

import React from 'react';
import { Invoice } from '@/types';
import { computeInvoiceTotals, numberToWords, formatDateDisplay } from '@/lib/currency';

interface InvoiceSheetProps {
  invoice: Invoice;
}

export default function InvoiceSheet({ invoice }: InvoiceSheetProps) {
  const totals = computeInvoiceTotals(invoice.items || [], invoice.taxType || 'intra', invoice.extraDiscount || 0);

  return (
    <div className="w-full overflow-x-auto">
      <div id="printableInvoiceArea" className="printable-sheet min-w-[320px] max-w-4xl mx-auto p-4 sm:p-10 bg-white rounded-xl shadow-lg border border-slate-200">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <img 
              src="/LOGO FOR.svg" 
              alt="For Healthcare Logo" 
              className="h-12 sm:h-16 w-auto object-contain flex-none"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-wide font-sans">FOR HEALTHCARE</h1>
              <p className="text-[10.5px] sm:text-xs font-bold text-emerald-600 tracking-wider uppercase">Care · Compassion · Trust</p>
              <p className="text-[10.5px] sm:text-xs text-slate-600 mt-1 font-medium">3rd, SUKRITHI # 1043, 2nd cross, main, BTM 4th Stage, Bilekahalli, Bengaluru, Karnataka 560076</p>
              <p className="text-[10.5px] sm:text-xs text-slate-600">+91 81975 26597 | +91 99640 05780 &nbsp;|&nbsp; forhealthcare.forlife@gmail.com</p>
            </div>
          </div>

          <div className="sm:text-right self-end sm:self-auto">
            <span className={`inline-block px-3 py-1 text-[11px] sm:text-xs font-extrabold uppercase rounded-full tracking-wider ${
              invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              invoice.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              'bg-slate-100 text-slate-700 border border-slate-300'
            }`}>
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Invoice Banner */}
        <div className="bg-[#0b3d66] text-white font-extrabold text-center tracking-[3px] text-xs sm:text-sm py-2 rounded-md my-4 uppercase">
          INVOICE / BILL
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs text-slate-800 my-4">
          {/* Left Column */}
          <div className="space-y-1.5 sm:border-r sm:border-slate-100 sm:pr-4">
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Invoice No.</span>
              <span className="font-bold mono">{invoice.invoiceNo}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Invoice Date</span>
              <span className="font-semibold">{formatDateDisplay(invoice.invDate)}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Payment Mode</span>
              <span className="font-semibold">{invoice.paymentMode || 'Cash'}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Place of Supply</span>
              <span className="font-semibold">{invoice.placeOfSupply || 'Bengaluru, Karnataka'}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Patient Name</span>
              <span className="font-bold text-slate-900">{invoice.patName || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Age / Gender</span>
              <span className="font-semibold">{invoice.patAge || '-'} / {invoice.patGender || '-'}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-1.5 sm:pl-2">
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Patient ID</span>
              <span className="font-semibold mono">{invoice.patId || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Contact No.</span>
              <span className="font-semibold">{invoice.patContact || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Address</span>
              <span className="font-medium text-right text-slate-700 max-w-[200px] truncate">{invoice.patAddress || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Attending Doctor</span>
              <span className="font-semibold">{invoice.doctor || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Admission Date</span>
              <span className="font-semibold">{formatDateDisplay(invoice.admDate)}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Discharge Date</span>
              <span className="font-semibold">{formatDateDisplay(invoice.disDate)}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
              <span className="text-slate-500 font-medium">Room / Bed No.</span>
              <span className="font-semibold">{invoice.roomBed || '-'}</span>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-xs border-collapse min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="bg-[#0b3d66] text-white font-bold uppercase tracking-wider">
                <th className="py-2 px-2 text-center w-8">#</th>
                <th className="py-2 px-3 text-left">Service</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-2 text-center w-12">Qty</th>
                <th className="py-2 px-3 text-right">Rate (₹)</th>
                <th className="py-2 px-2 text-center w-14">Disc %</th>
                <th className="py-2 px-2 text-center w-14">GST %</th>
                <th className="py-2 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(invoice.items || []).map((it, idx) => {
                const qty = Number(it.qty) || 0;
                const rate = Number(it.rate) || 0;
                const disc = Number(it.disc) || 0;
                const gst = Number(it.gst) || 0;
                const gross = qty * rate;
                const discAmt = (gross * disc) / 100;
                const taxable = gross - discAmt;
                const gstAmt = (taxable * gst) / 100;
                const total = taxable + gstAmt;

                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{it.service}</td>
                    <td className="py-2 px-3 text-slate-600">{it.description || '-'}</td>
                    <td className="py-2 px-2 text-center font-medium">{qty}</td>
                    <td className="py-2 px-3 text-right mono">{rate.toFixed(2)}</td>
                    <td className="py-2 px-2 text-center">{disc}%</td>
                    <td className="py-2 px-2 text-center">{gst}%</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 mono">{total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Table */}
        <div className="flex justify-end mt-4">
          <table className="w-64 text-xs">
            <tbody className="space-y-1">
              <tr>
                <td className="py-1 text-slate-600">Subtotal</td>
                <td className="py-1 text-right font-medium mono">₹ {totals.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Item Discount</td>
                <td className="py-1 text-right text-emerald-600 font-medium mono">-₹ {totals.discount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Taxable Value</td>
                <td className="py-1 text-right font-medium mono">₹ {totals.taxable.toFixed(2)}</td>
              </tr>
              {totals.taxType === 'intra' && (
                <>
                  <tr>
                    <td className="py-1 text-slate-600">CGST</td>
                    <td className="py-1 text-right font-medium mono">₹ {totals.cgst.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-600">SGST</td>
                    <td className="py-1 text-right font-medium mono">₹ {totals.sgst.toFixed(2)}</td>
                  </tr>
                </>
              )}
              {totals.taxType === 'inter' && (
                <tr>
                  <td className="py-1 text-slate-600">IGST</td>
                  <td className="py-1 text-right font-medium mono">₹ {totals.igst.toFixed(2)}</td>
                </tr>
              )}
              {totals.extraDiscount > 0 && (
                <tr>
                  <td className="py-1 text-slate-600">Additional Flat Discount</td>
                  <td className="py-1 text-right text-emerald-600 font-medium mono">-₹ {totals.extraDiscount.toFixed(2)}</td>
                </tr>
              )}
              <tr>
                <td className="py-1 text-slate-600">Round Off</td>
                <td className="py-1 text-right font-medium mono">₹ {totals.roundOff.toFixed(2)}</td>
              </tr>
              <tr className="border-t-2 border-[#0b3d66]">
                <td className="py-2 font-bold text-sm text-[#0b3d66]">Total Payable</td>
                <td className="py-2 text-right font-extrabold text-sm text-[#0b3d66] mono">
                  ₹ {totals.finalPayable.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount in Words */}
        <div className="mt-4 bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded-r-md text-xs">
          <span className="text-slate-600">Amount in Words: </span>
          <strong className="text-slate-900 font-bold">{numberToWords(totals.finalPayable)}</strong>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-3 text-[11px] text-slate-600 italic">
            {invoice.notes}
          </div>
        )}

        {/* Signatures */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0 mt-12 sm:mt-16 pt-4 text-xs text-slate-700">
          <div className="text-center w-full sm:w-auto">
            <div className="w-48 border-t border-slate-400 mx-auto mb-1"></div>
            <span>Patient / Attendant Signature</span>
          </div>
          <div className="text-center w-full sm:w-auto">
            <div className="w-56 border-t border-slate-400 mx-auto mb-1"></div>
            <span className="font-bold text-slate-900">For Healthcare</span>
            <br />
            <span className="text-[10px] text-slate-500">Authorised Signatory</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[9.5px] text-slate-400 mt-8 pt-4 border-t border-slate-100">
          This is a computer-generated invoice. No physical signature required.
        </div>
      </div>
    </div>
  );
}
