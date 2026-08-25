'use client';

import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, Patient, ServiceMaster, TaxType, InvoiceStatus } from '@/types';
import { computeInvoiceTotals, formatMoney, formatMoneyInteger } from '@/lib/currency';
import InvoiceSheet from './InvoiceSheet';

const COMMON_SERVICES = [
  "Home Healthcare Nursing Care",
  "Basic Nursing Care Services",
  "Speciality Nursing Care Services",
  "Patient Care at Home",
  "Nursing Attendant Services",
  "Sleep Study & Diagnostics",
  "CPAP Machine Rental",
  "BiPAP Machine Rental",
  "Oxygen Concentrator Rental",
  "Oxygen Cylinder Rental",
  "Wheelchair Rental",
  "Medical Equipment Sales",
  "Doctor Consultation",
  "Other"
];

interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  onSave: (data: Partial<Invoice>) => Promise<void>;
  isEditing?: boolean;
}

export default function InvoiceForm({ initialData, onSave, isEditing = false }: InvoiceFormProps) {
  // Empty by default for new invoices as requested
  const [invoiceNo, setInvoiceNo] = useState(initialData?.invoiceNo || '');
  const [invDate, setInvDate] = useState(initialData?.invDate || new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState(initialData?.paymentMode || 'Cash');
  const [placeOfSupply, setPlaceOfSupply] = useState(initialData?.placeOfSupply || 'Bengaluru, Karnataka');

  // Patient details
  const [patId, setPatId] = useState(initialData?.patId || '');
  const [patName, setPatName] = useState(initialData?.patName || '');
  const [patAge, setPatAge] = useState(initialData?.patAge || '');
  const [patGender, setPatGender] = useState(initialData?.patGender || 'Male');
  const [patContact, setPatContact] = useState(initialData?.patContact || '');
  const [patAddress, setPatAddress] = useState(initialData?.patAddress || '');

  // Care details
  const [doctor, setDoctor] = useState(initialData?.doctor || '');
  const [admDate, setAdmDate] = useState(initialData?.admDate || '');
  const [disDate, setDisDate] = useState(initialData?.disDate || '');
  const [roomBed, setRoomBed] = useState(initialData?.roomBed || '');

  // Line items & Tax
  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [
          { service: 'Home Healthcare Nursing Care', description: 'Per day, 12-hr shift', qty: 5, rate: 1200, disc: 10, gst: 0 },
          { service: 'Oxygen Concentrator Rental', description: '5 litre unit', qty: 5, rate: 400, disc: 0, gst: 12 }
        ]
  );

  const [taxType, setTaxType] = useState<TaxType>(initialData?.taxType || 'intra');
  const [extraDiscount, setExtraDiscount] = useState<number>(initialData?.extraDiscount || 0);
  const [notes, setNotes] = useState(initialData?.notes || 'Thank you for choosing For Healthcare. Get well soon.');
  const [status, setStatus] = useState<InvoiceStatus>(initialData?.status || 'Pending');

  // Catalogs
  const [servicesCatalog, setServicesCatalog] = useState<ServiceMaster[]>([]);
  const [patientsCatalog, setPatientsCatalog] = useState<Patient[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch catalogs on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [resSvc, resPat] = await Promise.all([
          fetch('/api/services').then(r => r.json()),
          fetch('/api/patients').then(r => r.json())
        ]);
        if (resSvc.success) setServicesCatalog(resSvc.data);
        if (resPat.success) setPatientsCatalog(resPat.data);
      } catch (err) {
        console.error('Failed loading catalogs', err);
      }
    }
    loadCatalog();
  }, []);

  const totals = computeInvoiceTotals(items, taxType, extraDiscount);

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    if (field === 'service') {
      const svcMaster = servicesCatalog.find(s => s.name === value);
      if (svcMaster) {
        updated[index].service = svcMaster.name;
        updated[index].rate = svcMaster.defaultRate;
        updated[index].gst = svcMaster.defaultGst;
        if (!updated[index].description && svcMaster.description) {
          updated[index].description = svcMaster.description;
        }
      } else {
        updated[index].service = value;
      }
    } else if (['qty', 'rate', 'disc', 'gst'].includes(field)) {
      (updated[index] as any)[field] = parseFloat(value) || 0;
    } else {
      (updated[index] as any)[field] = value;
    }
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { service: 'Home Healthcare Nursing Care', description: '', qty: 1, rate: 0, disc: 0, gst: 0 }
    ]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleClearForm = () => {
    if (!confirm('Clear all fields and start a new invoice?')) return;
    setInvoiceNo('');
    setPatId('');
    setPatName('');
    setPatAge('');
    setPatContact('');
    setPatAddress('');
    setDoctor('');
    setAdmDate('');
    setDisDate('');
    setRoomBed('');
    setExtraDiscount(0);
    setNotes('Thank you for choosing For Healthcare. Get well soon.');
    setTaxType('intra');
    setItems([]);
  };

  const handleSubmit = async (e: React.FormEvent, submitStatus?: InvoiceStatus) => {
    e.preventDefault();
    if (!patName.trim()) {
      alert("Please enter the patient's name.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one service before generating the invoice.");
      return;
    }

    setLoading(true);
    const payload: Partial<Invoice> = {
      invoiceNo,
      invDate,
      paymentMode,
      placeOfSupply,
      patId,
      patName,
      patAge,
      patGender,
      patContact,
      patAddress,
      doctor,
      admDate,
      disDate,
      roomBed,
      items,
      taxType,
      extraDiscount,
      notes,
      status: submitStatus || status
    };

    try {
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  const draftInvoiceObject: Invoice = {
    id: initialData?.id || 'preview-id',
    invoiceNo: invoiceNo || '-',
    invDate,
    paymentMode,
    placeOfSupply,
    patId,
    patName,
    patAge,
    patGender,
    patContact,
    patAddress,
    doctor,
    admDate,
    disDate,
    roomBed,
    items,
    taxType,
    extraDiscount,
    notes,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="max-w-[1180px] mx-auto space-y-4 px-2 sm:px-4">
      
      <form onSubmit={(e) => handleSubmit(e, 'Pending')}>
        
        {/* ===== Panel 1 & 2 Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Panel 1: Invoice Details */}
          <div className="panel">
            <h2><span className="num">1</span>Invoice Details</h2>
            <div className="field">
              <label>Invoice No.</label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="mono"
                placeholder="Enter Invoice No..."
              />
            </div>
            <div className="field-row grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="field">
                <label>Invoice Date</label>
                <input type="date" value={invDate} onChange={(e) => setInvDate(e.target.value)} />
              </div>
              <div className="field">
                <label>Payment Mode</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Place of Supply</label>
              <input value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} />
            </div>
          </div>

          {/* Panel 2: Patient Details */}
          <div className="panel">
            <h2><span className="num">2</span>Patient Details</h2>
            <div className="field-row grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="field">
                <label>Patient ID</label>
                <input value={patId} onChange={(e) => setPatId(e.target.value)} placeholder="e.g. KH-P-0231" />
              </div>
              <div className="field">
                <label>Patient Name *</label>
                <input value={patName} onChange={(e) => setPatName(e.target.value)} placeholder="Full name" required />
              </div>
            </div>
            <div className="field-row grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="field">
                <label>Age</label>
                <input value={patAge} onChange={(e) => setPatAge(e.target.value)} placeholder="e.g. 68" />
              </div>
              <div className="field">
                <label>Gender</label>
                <select value={patGender} onChange={(e) => setPatGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="field-row grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="field">
                <label>Contact No.</label>
                <input value={patContact} onChange={(e) => setPatContact(e.target.value)} placeholder="10-digit mobile" />
              </div>
              <div className="field">
                <label>Address</label>
                <input value={patAddress} onChange={(e) => setPatAddress(e.target.value)} placeholder="Street, area, city" />
              </div>
            </div>
          </div>

        </div>

        {/* ===== Panel 3: Care Details ===== */}
        <div className="panel">
          <h2><span className="num">3</span>Care Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="field">
              <label>Attending Doctor</label>
              <input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr. name" />
            </div>
            <div className="field">
              <label>Admission Date</label>
              <input type="date" value={admDate} onChange={(e) => setAdmDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Discharge Date</label>
              <input type="date" value={disDate} onChange={(e) => setDisDate(e.target.value)} />
            </div>
          </div>
          <div className="field mt-3 max-w-full sm:max-w-xs">
            <label>Room / Bed No.</label>
            <input value={roomBed} onChange={(e) => setRoomBed(e.target.value)} placeholder="e.g. Room 4 / Bed B" />
          </div>
        </div>

        {/* ===== Panel 4: Services Table ===== */}
        <div className="panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <h2 style={{ margin: 0 }}><span className="num">4</span>Services Rendered</h2>
            <span className="text-[11px] sm:text-[11.5px] text-slate-400">Nursing/home-care usually GST 0% · rented/sold equipment usually taxable</span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="svc min-w-[700px] sm:min-w-full">
              <thead>
                <tr>
                  <th style={{ width: '24%' }}>Service</th>
                  <th style={{ width: '20%' }}>Description</th>
                  <th style={{ width: '8%' }}>Qty</th>
                  <th style={{ width: '12%' }}>Rate (₹)</th>
                  <th style={{ width: '9%' }}>Disc %</th>
                  <th style={{ width: '9%' }}>GST %</th>
                  <th style={{ width: '14%' }}>Amount (₹)</th>
                  <th style={{ width: '4%' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={8} className="text-center text-slate-400 py-6">
                      No services added yet — click “+ Add Service” to begin.
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => {
                    const gross = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                    const discAmt = (gross * (Number(it.disc) || 0)) / 100;
                    const taxable = gross - discAmt;
                    const gstAmt = (taxable * (Number(it.gst) || 0)) / 100;
                    const amount = taxable + gstAmt;

                    return (
                      <tr key={idx}>
                        <td>
                          <select
                            value={it.service}
                            onChange={(e) => updateItem(idx, 'service', e.target.value)}
                          >
                            {COMMON_SERVICES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            value={it.description}
                            onChange={(e) => updateItem(idx, 'description', e.target.value)}
                            placeholder="optional"
                          />
                        </td>
                        <td className="num">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={it.qty}
                            onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                          />
                        </td>
                        <td className="num">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={it.rate}
                            onChange={(e) => updateItem(idx, 'rate', e.target.value)}
                          />
                        </td>
                        <td className="num">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={it.disc}
                            onChange={(e) => updateItem(idx, 'disc', e.target.value)}
                          />
                        </td>
                        <td className="num">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={it.gst}
                            onChange={(e) => updateItem(idx, 'gst', e.target.value)}
                          />
                        </td>
                        <td className="amount">{formatMoney(amount)}</td>
                        <td className="del">
                          <button
                            type="button"
                            className="icon-btn"
                            title="Remove line"
                            onClick={() => removeItemRow(idx)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '12px' }}>
            <button type="button" className="btn btn-add" onClick={addItemRow}>
              + Add Service
            </button>
          </div>
        </div>

        {/* ===== Panel 5: Tax / Discount / Totals ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Tax Type */}
          <div className="panel">
            <h2><span className="num">5</span>Tax Type</h2>
            <div className="flex flex-col gap-2.5 font-medium text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="taxType"
                  value="intra"
                  checked={taxType === 'intra'}
                  onChange={() => setTaxType('intra')}
                  className="accent-[#0b3d66] w-4 h-4"
                />
                Intra-State (CGST + SGST)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="taxType"
                  value="inter"
                  checked={taxType === 'inter'}
                  onChange={() => setTaxType('inter')}
                  className="accent-[#0b3d66] w-4 h-4"
                />
                Inter-State (IGST)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="taxType"
                  value="none"
                  checked={taxType === 'none'}
                  onChange={() => setTaxType('none')}
                  className="accent-[#0b3d66] w-4 h-4"
                />
                No GST
              </label>
            </div>
          </div>

          {/* Discount & Notes */}
          <div className="panel">
            <h2>Discount &amp; Notes</h2>
            <div className="field">
              <label>Additional Flat Discount (₹)</label>
              <input
                type="number"
                min="0"
                value={extraDiscount}
                onChange={(e) => setExtraDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="panel">
            <h2>Summary</h2>
            <div className="totals-list">
              <div className="row">
                <span>Subtotal</span>
                <span>{formatMoney(totals.subtotal)}</span>
              </div>
              <div className="row">
                <span>Item Discount</span>
                <span>{formatMoney(totals.discount)}</span>
              </div>
              <div className="row">
                <span>Taxable Value</span>
                <span>{formatMoney(totals.taxable)}</span>
              </div>
              <div className="row">
                <span>Total GST</span>
                <span>{formatMoney(totals.gst)}</span>
              </div>
              <div className="row grand">
                <span>Grand Total</span>
                <span>{formatMoneyInteger(totals.finalPayable)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Action Bar - Fully Responsive */}
        <div className="action-bar flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={handleClearForm}>
            New / Clear Form
          </button>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              className="btn btn-outline flex-1 sm:flex-none"
              onClick={() => setShowPreviewModal(true)}
            >
              Preview Sheet
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              {loading ? 'Saving...' : 'Preview, Print & Save Invoice'}
            </button>
          </div>
        </div>

      </form>

      {/* Preview Modal Overlay - Responsive */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-[#0a1423]/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-4 sm:my-8 shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50">
              <strong className="font-extrabold text-slate-900 text-sm font-sans">Invoice Preview</strong>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-2 sm:p-6 overflow-y-auto max-h-[80vh]">
              <InvoiceSheet invoice={draftInvoiceObject} />
            </div>

            <div className="flex justify-end gap-2.5 px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="btn btn-outline"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
