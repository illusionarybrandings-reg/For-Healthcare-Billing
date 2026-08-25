import { InvoiceItem, InvoiceTotals, TaxType } from '@/types';

export function formatMoney(amount: number): string {
  return "₹ " + (Math.round(amount * 100) / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatMoneyInteger(amount: number): string {
  return "₹ " + Math.round(amount).toLocaleString('en-IN');
}

export function computeInvoiceTotals(items: InvoiceItem[], taxType: TaxType, extraDiscount: number = 0): InvoiceTotals {
  let subtotal = 0;
  let discount = 0;
  let taxable = 0;
  let gst = 0;

  items.forEach(it => {
    const qty = Number(it.qty) || 0;
    const rate = Number(it.rate) || 0;
    const disc = Number(it.disc) || 0;
    const gstRate = Number(it.gst) || 0;

    const gross = qty * rate;
    const d = (gross * disc) / 100;
    const t = gross - d;
    const g = (t * gstRate) / 100;

    subtotal += gross;
    discount += d;
    taxable += t;
    gst += g;
  });

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (taxType === 'intra') {
    cgst = gst / 2;
    sgst = gst / 2;
  } else if (taxType === 'inter') {
    igst = gst;
  } else {
    gst = 0;
    cgst = 0;
    sgst = 0;
    igst = 0;
  }

  const flatDisc = Number(extraDiscount) || 0;
  const afterTax = taxable + gst;
  const beforeRound = afterTax - flatDisc;
  const finalPayable = Math.round(beforeRound);
  const roundOff = finalPayable - beforeRound;

  return {
    subtotal,
    discount,
    taxable,
    gst,
    cgst,
    sgst,
    igst,
    extraDiscount: flatDisc,
    afterTax,
    beforeRound,
    finalPayable,
    roundOff,
    taxType
  };
}

// Indian Number-to-Words Conversion (Crore, Lakh, Thousand, Hundred)
const UNITS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigit(n: number): string {
  if (n < 20) return UNITS[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return TENS[t] + (u > 0 ? " " + UNITS[u] : "");
}

export function numberToWords(num: number): string {
  num = Math.abs(Math.round(num));
  if (num === 0) return "Zero Rupees Only";
  
  let crore = Math.floor(num / 10000000);
  num %= 10000000;
  let lakh = Math.floor(num / 100000);
  num %= 100000;
  let thousand = Math.floor(num / 1000);
  num %= 1000;
  let hundred = Math.floor(num / 100);
  let rem = num % 100;
  
  let s = "";
  if (crore) s += twoDigit(crore) + " Crore ";
  if (lakh) s += twoDigit(lakh) + " Lakh ";
  if (thousand) s += twoDigit(thousand) + " Thousand ";
  if (hundred) s += UNITS[hundred] + " Hundred ";
  if (rem) {
    if (s) s += "and ";
    s += twoDigit(rem) + " ";
  }
  return (s + "Rupees Only").replace(/\s+/g, ' ').trim();
}

export function formatDateDisplay(isoString: string): string {
  if (!isoString) return '-';
  const parts = isoString.split('-');
  if (parts.length !== 3) return isoString;
  const [y, m, d] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(m, 10) - 1;
  return `${d}-${months[monthIdx] || m}-${y}`;
}
