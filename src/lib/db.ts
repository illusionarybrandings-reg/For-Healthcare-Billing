import fs from 'fs';
import path from 'path';
import { Invoice, Patient, ServiceMaster } from '@/types';

// Vercel Serverless environment uses /tmp for writable storage
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const ROOT_DB_FILE = path.join(process.cwd(), 'data', 'db.json');

interface Schema {
  invoices: Invoice[];
  patients: Patient[];
  services: ServiceMaster[];
  counter: number;
}

// In-memory fallback for edge or read-only environments
let memoryDb: Schema | null = null;

const INITIAL_SERVICES: ServiceMaster[] = [
  { id: '1', name: 'Home Healthcare Nursing Care', category: 'Nursing', defaultRate: 1200, defaultGst: 0, description: 'Per day, 12-hr shift' },
  { id: '2', name: 'Basic Nursing Care Services', category: 'Nursing', defaultRate: 1000, defaultGst: 0, description: 'Per visit / basic monitoring' },
  { id: '3', name: 'Speciality Nursing Care Services', category: 'Nursing', defaultRate: 1800, defaultGst: 0, description: 'ICU care at home / tracheostomy' },
  { id: '4', name: 'Patient Care Attendant Services', category: 'Attendant', defaultRate: 800, defaultGst: 0, description: 'Elderly & bedridden care' },
  { id: '5', name: 'Oxygen Concentrator Rental', category: 'Equipment Rental', defaultRate: 400, defaultGst: 12, description: '5 Litre medical unit' },
  { id: '6', name: 'CPAP Machine Rental', category: 'Equipment Rental', defaultRate: 500, defaultGst: 12, description: 'Auto CPAP with mask' },
  { id: '7', name: 'BiPAP Machine Rental', category: 'Equipment Rental', defaultRate: 750, defaultGst: 12, description: 'Dual pressure support unit' },
  { id: '8', name: 'Oxygen Cylinder Rental & Refill', category: 'Equipment Rental', defaultRate: 350, defaultGst: 12, description: 'B-type/D-type cylinder' },
  { id: '9', name: 'Sleep Study & Diagnostics', category: 'Diagnostics', defaultRate: 4500, defaultGst: 0, description: 'Level-1 Polysomnography' },
  { id: '10', name: 'Doctor Home Consultation', category: 'Doctor Visit', defaultRate: 1500, defaultGst: 0, description: 'General Physician visit' },
  { id: '11', name: 'Wheelchair Rental', category: 'Equipment Rental', defaultRate: 150, defaultGst: 12, description: 'Standard folding wheelchair' },
  { id: '12', name: 'Medical Equipment Sales', category: 'Sales', defaultRate: 2500, defaultGst: 12, description: 'Pulse oximeter / BP monitor' }
];

const INITIAL_PATIENTS: Patient[] = [
  { id: 'p1', patId: 'KH-P-0231', name: 'Ramesh Kumar', age: '68', gender: 'Male', contact: '9845012345', address: '#42, 11th Cross, Malleshwaram, Bengaluru', createdAt: new Date().toISOString() },
  { id: 'p2', patId: 'KH-P-0232', name: 'Sunita Rao', age: '74', gender: 'Female', contact: '9731298765', address: '#108, 15th Cross, Rajajinagar, Bengaluru', createdAt: new Date().toISOString() },
  { id: 'p3', patId: 'KH-P-0233', name: 'Venkatesh Murthy', age: '61', gender: 'Male', contact: '8861054321', address: '#88, 5th Main, Sadashivanagar, Bengaluru', createdAt: new Date().toISOString() }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNo: 'KH/2026/0001',
    invDate: '2026-08-20',
    paymentMode: 'UPI',
    placeOfSupply: 'Bengaluru, Karnataka',
    patId: 'KH-P-0231',
    patName: 'Ramesh Kumar',
    patAge: '68',
    patGender: 'Male',
    patContact: '9845012345',
    patAddress: '#42, 11th Cross, Malleshwaram, Bengaluru',
    doctor: 'Dr. Suresh V. Shetty',
    admDate: '2026-08-15',
    disDate: '2026-08-20',
    roomBed: 'Home Care Bed A',
    items: [
      { id: 'i1', service: 'Home Healthcare Nursing Care', description: 'Per day, 12-hr shift', qty: 5, rate: 1200, disc: 10, gst: 0 },
      { id: 'i2', service: 'Oxygen Concentrator Rental', description: '5 litre unit', qty: 5, rate: 400, disc: 0, gst: 12 }
    ],
    taxType: 'intra',
    extraDiscount: 0,
    notes: 'Thank you for choosing For Healthcare. Get well soon.',
    status: 'Paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function getDefaultSchema(): Schema {
  if (fs.existsSync(ROOT_DB_FILE)) {
    try {
      const raw = fs.readFileSync(ROOT_DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
  }
  return {
    invoices: INITIAL_INVOICES,
    patients: INITIAL_PATIENTS,
    services: INITIAL_SERVICES,
    counter: 2
  };
}

function ensureDb(): Schema {
  if (memoryDb) return memoryDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultSchema();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      memoryDb = initial;
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDb = JSON.parse(content);
    return memoryDb!;
  } catch (err) {
    console.error('File DB write failed, using memory DB', err);
    if (!memoryDb) memoryDb = getDefaultSchema();
    return memoryDb;
  }
}

function saveDb(data: Schema): void {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist to file (Vercel serverless environment), kept in memory', err);
  }
}

export function getInvoices(): Invoice[] {
  const db = ensureDb();
  return db.invoices || [];
}

export function getInvoiceById(id: string): Invoice | undefined {
  const db = ensureDb();
  return db.invoices.find(i => i.id === id || i.invoiceNo === id);
}

export function saveInvoice(data: Partial<Invoice>): Invoice {
  const db = ensureDb();
  const year = new Date().getFullYear();

  if (data.id) {
    const idx = db.invoices.findIndex(i => i.id === data.id);
    if (idx !== -1) {
      const existing = db.invoices[idx];
      const updated: Invoice = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString()
      } as Invoice;
      db.invoices[idx] = updated;
      saveDb(db);
      return updated;
    }
  }

  // Create New Invoice
  db.counter += 1;
  const seq = String(db.counter).padStart(4, '0');
  const invoiceNo = data.invoiceNo || `KH/${year}/${seq}`;
  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNo,
    invDate: data.invDate || new Date().toISOString().split('T')[0],
    paymentMode: data.paymentMode || 'Cash',
    placeOfSupply: data.placeOfSupply || 'Bengaluru, Karnataka',
    patId: data.patId || '',
    patName: data.patName || '',
    patAge: data.patAge || '',
    patGender: data.patGender || 'Male',
    patContact: data.patContact || '',
    patAddress: data.patAddress || '',
    doctor: data.doctor || '',
    admDate: data.admDate || '',
    disDate: data.disDate || '',
    roomBed: data.roomBed || '',
    items: data.items || [],
    taxType: data.taxType || 'intra',
    extraDiscount: data.extraDiscount || 0,
    notes: data.notes || 'Thank you for choosing For Healthcare. Get well soon.',
    status: data.status || 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.invoices.unshift(newInvoice);

  // Auto-sync patient record
  if (newInvoice.patName) {
    const existingPat = db.patients.find(p => p.name.toLowerCase() === newInvoice.patName.toLowerCase() || p.patId === newInvoice.patId);
    if (!existingPat && newInvoice.patName.trim()) {
      db.patients.push({
        id: `p-${Date.now()}`,
        patId: newInvoice.patId || `KH-P-${Math.floor(1000 + Math.random() * 9000)}`,
        name: newInvoice.patName,
        age: newInvoice.patAge,
        gender: newInvoice.patGender,
        contact: newInvoice.patContact,
        address: newInvoice.patAddress,
        createdAt: new Date().toISOString()
      });
    }
  }

  saveDb(db);
  return newInvoice;
}

export function deleteInvoice(id: string): boolean {
  const db = ensureDb();
  const initialCount = db.invoices.length;
  db.invoices = db.invoices.filter(i => i.id !== id);
  if (db.invoices.length !== initialCount) {
    saveDb(db);
    return true;
  }
  return false;
}

export function getPatients(): Patient[] {
  const db = ensureDb();
  return db.patients || [];
}

export function savePatient(data: Partial<Patient>): Patient {
  const db = ensureDb();
  if (data.id) {
    const idx = db.patients.findIndex(p => p.id === data.id);
    if (idx !== -1) {
      db.patients[idx] = { ...db.patients[idx], ...data } as Patient;
      saveDb(db);
      return db.patients[idx];
    }
  }
  const newPat: Patient = {
    id: `p-${Date.now()}`,
    patId: data.patId || `KH-P-${Math.floor(1000 + Math.random() * 9000)}`,
    name: data.name || '',
    age: data.age || '',
    gender: data.gender || 'Male',
    contact: data.contact || '',
    address: data.address || '',
    createdAt: new Date().toISOString()
  };
  db.patients.push(newPat);
  saveDb(db);
  return newPat;
}

export function getServices(): ServiceMaster[] {
  const db = ensureDb();
  return db.services || [];
}

export function saveService(data: Partial<ServiceMaster>): ServiceMaster {
  const db = ensureDb();
  if (data.id) {
    const idx = db.services.findIndex(s => s.id === data.id);
    if (idx !== -1) {
      db.services[idx] = { ...db.services[idx], ...data } as ServiceMaster;
      saveDb(db);
      return db.services[idx];
    }
  }
  const newSvc: ServiceMaster = {
    id: `svc-${Date.now()}`,
    name: data.name || '',
    category: data.category || 'General',
    defaultRate: Number(data.defaultRate) || 0,
    defaultGst: Number(data.defaultGst) || 0,
    description: data.description || ''
  };
  db.services.push(newSvc);
  saveDb(db);
  return newSvc;
}

export function generateNextInvoiceNumber(): string {
  const db = ensureDb();
  const year = new Date().getFullYear();
  const nextSeq = db.counter + 1;
  return `KH/${year}/${String(nextSeq).padStart(4, '0')}`;
}
