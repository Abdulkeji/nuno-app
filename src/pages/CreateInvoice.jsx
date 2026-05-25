import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ChevronDown, ArrowLeft, Save, Send } from 'lucide-react';
import { useApp }  from '../context/AppContext';
import {
  CURRENCIES, PAYMENT_METHODS, today, addDays,
  calcTotals, formatCurrency, generateId,
} from '../utils/helpers';
import { peekInvoiceCounter, getNextInvoiceNumber } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { formatInvoiceNumber } from '../utils/helpers';

const EMPTY_ITEM = () => ({ id: generateId(), description: '', quantity: 1, unitPrice: 0, total: 0 });

export default function CreateInvoice() {
  const { id }       = useParams();   // present when editing
  const isEditing    = !!id;
  const { currentUser } = useAuth();
  const { invoices, clients, businessProfile, addInvoice, updateInvoice } = useApp();
  const navigate = useNavigate();

  const existing = isEditing ? invoices.find((inv) => inv.id === id) : null;

  // ─── Form State ───────────────────────────────────────────────────────────
  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        invoiceNumber: existing.invoiceNumber,
        issueDate:     existing.issueDate,
        dueDate:       existing.dueDate,
        currency:      existing.currency || 'USD',
        taxRate:       String(existing.taxRate || 0),
        paymentMethod: existing.paymentMethod || '',
        notes:         existing.notes || '',
        terms:         existing.terms || '',
        status:        existing.status || 'draft',
        clientId:      existing.clientId || '',
        clientName:    existing.clientName || '',
        clientEmail:   existing.clientEmail || '',
        clientPhone:   existing.clientPhone || '',
        clientAddress: existing.clientAddress || '',
      };
    }
    const nextNum = peekInvoiceCounter(currentUser.id);
    return {
      invoiceNumber: formatInvoiceNumber(nextNum),
      issueDate:     today(),
      dueDate:       addDays(today(), parseInt(businessProfile?.defaultPaymentTerms || 30, 10)),
      currency:      businessProfile?.defaultCurrency || 'USD',
      taxRate:       businessProfile?.defaultTaxRate || '10',
      paymentMethod: '',
      notes:         '',
      terms:         businessProfile?.defaultTerms || 'Payment within the agreed terms. Late fees may apply.',
      status:        'draft',
      clientId:      '',
      clientName:    '',
      clientEmail:   '',
      clientPhone:   '',
      clientAddress: '',
    };
  });

  const [items, setItems] = useState(
    existing?.items || [EMPTY_ITEM()]
  );

  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [useExistingClient, setUseExistingClient] = useState(!!existing?.clientId);

  // ─── Totals (derived) ─────────────────────────────────────────────────────
  const { subtotal, taxAmount, total } = calcTotals(items, form.taxRate);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const setField = (name, value) =>
    setForm((f) => ({ ...f, [name]: value }));

  const selectClient = (clientId) => {
    if (!clientId) {
      setField('clientId', '');
      return;
    }
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    setForm((f) => ({
      ...f,
      clientId:      client.id,
      clientName:    client.name,
      clientEmail:   client.email || '',
      clientPhone:   client.phone || '',
      clientAddress: client.address || '',
    }));
  };

  const updateItem = (itemId, field, raw) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const value = field === 'description' ? raw : parseFloat(raw) || 0;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      })
    );
  };

  const addItem = () => setItems((prev) => [...prev, EMPTY_ITEM()]);
  const removeItem = (itemId) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== itemId) : prev));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Client name is required';
    if (!form.issueDate)         e.issueDate  = 'Issue date is required';
    if (!form.dueDate)           e.dueDate    = 'Due date is required';
    const hasItems = items.some((i) => i.description.trim());
    if (!hasItems) e.items = 'Add at least one item with a description';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (saveStatus) => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      ...form,
      status: saveStatus,
      items: items.map((i) => ({
        ...i,
        quantity:  parseFloat(i.quantity) || 0,
        unitPrice: parseFloat(i.unitPrice) || 0,
        total:     parseFloat(i.quantity || 0) * parseFloat(i.unitPrice || 0),
      })),
      subtotal,
      taxAmount,
      total,
      taxRate: parseFloat(form.taxRate) || 0,
    };

    if (isEditing) {
      updateInvoice(id, payload);
    } else {
      addInvoice(payload);
    }

    setSaving(false);
    navigate('/invoices');
  };

  const sym = CURRENCIES.find((c) => c.code === form.currency)?.symbol || '$';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-inter">
            {isEditing ? `Edit ${existing?.invoiceNumber}` : 'New Invoice'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isEditing ? 'Update invoice details' : 'Fill in the details to create an invoice'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left column (main form) ───────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Invoice meta */}
          <div className="card">
            <h2 className="font-bold text-slate-900 font-inter mb-4">Invoice Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Invoice Number</label>
                <input
                  type="text"
                  value={form.invoiceNumber}
                  onChange={(e) => setField('invoiceNumber', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Currency</label>
                <div className="relative">
                  <select
                    value={form.currency}
                    onChange={(e) => setField('currency', e.target.value)}
                    className="select-field appearance-none pr-8"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code} – {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label">Issue Date</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setField('issueDate', e.target.value)}
                  className="input-field"
                />
                {errors.issueDate && <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>}
              </div>
              <div>
                <label className="label">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setField('dueDate', e.target.value)}
                  className="input-field"
                />
                {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
              </div>
            </div>
          </div>

          {/* Client */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 font-inter">Bill To</h2>
              {clients.length > 0 && (
                <button
                  onClick={() => setUseExistingClient((v) => !v)}
                  className="text-primary-800 text-xs font-semibold hover:underline"
                >
                  {useExistingClient ? 'Enter manually' : 'Select existing client'}
                </button>
              )}
            </div>

            {useExistingClient && clients.length > 0 ? (
              <div>
                <label className="label">Select Client</label>
                <div className="relative">
                  <select
                    value={form.clientId}
                    onChange={(e) => selectClient(e.target.value)}
                    className="select-field appearance-none pr-8"
                  >
                    <option value="">— Choose a client —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            ) : null}

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Client / Company Name *</label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => setField('clientName', e.target.value)}
                  placeholder="ACME Corporation"
                  className="input-field"
                />
                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => setField('clientEmail', e.target.value)}
                  placeholder="billing@acme.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={form.clientPhone}
                  onChange={(e) => setField('clientPhone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  value={form.clientAddress}
                  onChange={(e) => setField('clientAddress', e.target.value)}
                  placeholder="123 Main St, City, Country"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card">
            <h2 className="font-bold text-slate-900 font-inter mb-4">Line Items</h2>
            {errors.items && (
              <p className="text-red-500 text-xs mb-3">{errors.items}</p>
            )}

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-5 label">Description</div>
              <div className="col-span-2 label text-center">Qty</div>
              <div className="col-span-2 label text-right">Unit Price</div>
              <div className="col-span-2 label text-right">Total</div>
              <div className="col-span-1" />
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Service or product description"
                      className="input-field"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      className="input-field text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{sym}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                        className="input-field pl-6 text-right"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="input-field bg-slate-50 text-right text-slate-700 font-medium cursor-default">
                      {sym}{(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-3 flex items-center gap-2 text-primary-800 text-sm font-semibold hover:text-primary-900"
            >
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
          </div>

          {/* Notes & Terms */}
          <div className="card">
            <h2 className="font-bold text-slate-900 font-inter mb-4">Additional Info</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Payment Method</label>
                <div className="relative">
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setField('paymentMethod', e.target.value)}
                    className="select-field appearance-none pr-8"
                  >
                    <option value="">Select method…</option>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label">Tax / VAT Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={form.taxRate}
                  onChange={(e) => setField('taxRate', e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  placeholder="Thank you for your business! Any special notes…"
                  className="textarea-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={form.terms}
                  onChange={(e) => setField('terms', e.target.value)}
                  placeholder="Payment terms, late fee policy, etc."
                  className="textarea-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column (summary + actions) ─────────────────────────── */}
        <div className="space-y-5">
          {/* Summary */}
          <div className="card sticky top-6">
            <h2 className="font-bold text-slate-900 font-inter mb-4">Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">{sym}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({form.taxRate || 0}%)</span>
                <span className="font-medium">{sym}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between text-slate-900 font-bold text-base">
                <span>Total</span>
                <span className="text-primary-800">{sym}{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleSave('sent')}
                disabled={saving}
                className="btn-primary w-full justify-center"
              >
                <Send className="w-4 h-4" />
                {isEditing ? 'Update & Send' : 'Send Invoice'}
              </button>
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="btn-secondary w-full justify-center"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
            </div>

            {/* Business from info */}
            {businessProfile && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">From</p>
                <p className="text-sm font-semibold text-slate-900">{businessProfile.businessName}</p>
                {businessProfile.address && (
                  <p className="text-xs text-slate-500 mt-0.5">{businessProfile.address}</p>
                )}
                {businessProfile.email && (
                  <p className="text-xs text-slate-500">{businessProfile.email}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
