export type TaxType = 'intra' | 'inter' | 'none';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Draft' | 'Cancelled';

export interface InvoiceItem {
  id?: string;
  service: string;
  description: string;
  qty: number;
  rate: number;
  disc: number; // Discount percentage
  gst: number;  // GST percentage
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  invDate: string;
  paymentMode: string;
  placeOfSupply: string;
  
  // Patient details
  patId: string;
  patName: string;
  patAge: string;
  patGender: string;
  patContact: string;
  patAddress: string;

  // Care details
  doctor: string;
  admDate: string;
  disDate: string;
  roomBed: string;

  // Line items & Tax
  items: InvoiceItem[];
  taxType: TaxType;
  extraDiscount: number;
  notes: string;
  status: InvoiceStatus;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  patId: string;
  name: string;
  age: string;
  gender: string;
  contact: string;
  address: string;
  createdAt: string;
}

export interface ServiceMaster {
  id: string;
  name: string;
  category: string;
  defaultRate: number;
  defaultGst: number;
  description?: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  taxable: number;
  gst: number;
  cgst: number;
  sgst: number;
  igst: number;
  extraDiscount: number;
  afterTax: number;
  beforeRound: number;
  finalPayable: number;
  roundOff: number;
  taxType: TaxType;
}
