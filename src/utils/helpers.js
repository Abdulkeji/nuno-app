import { format, isAfter, parseISO } from 'date-fns';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const PAYMENT_METHODS = [
  'Bank Transfer',
  'Wire Transfer',
  'Credit Card',
  'Debit Card',
  'PayPal',
  'Cash',
  'Cheque',
  'Cryptocurrency',
  'Other',
];

export const STATUS_CONFIG = {
  draft:   { label: 'Draft',   color: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400'   },
  sent:    { label: 'Sent',    color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500'    },
  paid:    { label: 'Paid',    color: 'bg-emerald-100 text-emerald-700',dot: 'bg-emerald-500' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700',        dot: 'bg-red-500'     },
};

export const formatCurrency = (amount, currencyCode = 'USD') => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const numAmount = parseFloat(amount) || 0;
  return `${currency.symbol}${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatInvoiceNumber = (num) => `INV-${String(num).padStart(3, '0')}`;

export const getEffectiveStatus = (invoice) => {
  if (invoice.status === 'sent') {
    const now = new Date();
    const due = parseISO(invoice.dueDate);
    if (isAfter(now, due)) return 'overdue';
  }
  return invoice.status;
};

export const today = () => new Date().toISOString().split('T')[0];

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const calcTotals = (items, taxRate) => {
  const subtotal = items.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  const rate = parseFloat(taxRate) || 0;
  const taxAmount = (subtotal * rate) / 100;
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
};
