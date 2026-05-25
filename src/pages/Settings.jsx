import { useState, useEffect } from 'react';
import { Save, Building2, ChevronDown, CheckCircle } from 'lucide-react';
import { useApp }   from '../context/AppContext';
import { CURRENCIES } from '../utils/helpers';

const DEFAULT = {
  businessName:       '',
  address:            '',
  phone:              '',
  email:              '',
  website:            '',
  taxNumber:          '',
  defaultCurrency:    'USD',
  defaultTaxRate:     '10',
  defaultPaymentTerms:'30',
  defaultTerms:       'Payment within the agreed terms. Late fees may apply after due date.',
};

export default function Settings() {
  const { businessProfile, updateBusinessProfile } = useApp();
  const [form,    setForm]    = useState(DEFAULT);
  const [saved,   setSaved]   = useState(false);
  const [errors,  setErrors]  = useState({});

  useEffect(() => {
    if (businessProfile) {
      setForm({ ...DEFAULT, ...businessProfile });
    }
  }, [businessProfile]);

  const setField = (name, value) =>
    setForm((f) => ({ ...f, [name]: value }));

  const validate = () => {
    const e = {};
    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateBusinessProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          This information appears on all your invoices and receipts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Identity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Business Identity</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Business Name *</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setField('businessName', e.target.value)}
                placeholder="Bright Studio Co."
                className="input-field"
              />
              {errors.businessName && (
                <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Business Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="25 Innovation Drive, San Francisco, CA 94103"
                className="textarea-field"
              />
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="+1 (415) 555-0199"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="hello@business.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Website</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setField('website', e.target.value)}
                placeholder="www.yourbusiness.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Tax / VAT Number</label>
              <input
                type="text"
                value={form.taxNumber}
                onChange={(e) => setField('taxNumber', e.target.value)}
                placeholder="US-TAX-123456"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Invoice Defaults */}
        <div className="card">
          <h2 className="font-bold text-slate-900 font-inter mb-5">Invoice Defaults</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Default Currency</label>
              <div className="relative">
                <select
                  value={form.defaultCurrency}
                  onChange={(e) => setField('defaultCurrency', e.target.value)}
                  className="select-field appearance-none pr-8"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="label">Default Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={form.defaultTaxRate}
                onChange={(e) => setField('defaultTaxRate', e.target.value)}
                placeholder="10"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Payment Terms (days)</label>
              <input
                type="number"
                min="0"
                value={form.defaultPaymentTerms}
                onChange={(e) => setField('defaultPaymentTerms', e.target.value)}
                placeholder="30"
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Default Terms & Conditions</label>
            <textarea
              rows={3}
              value={form.defaultTerms}
              onChange={(e) => setField('defaultTerms', e.target.value)}
              placeholder="Standard payment terms, late fee policy, etc."
              className="textarea-field"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            Save Settings
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Settings saved!
            </div>
          )}
        </div>
      </form>

      {/* Preview card */}
      {form.businessName && (
        <div className="mt-8 card border-dashed border-slate-300 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Invoice Header Preview</p>
          <div className="bg-primary-800 rounded-xl px-6 py-4 flex items-start justify-between">
            <div>
              <p className="text-white font-bold text-lg">{form.businessName}</p>
              {form.address && <p className="text-primary-200 text-xs mt-0.5">{form.address}</p>}
              {form.email   && <p className="text-primary-200 text-xs">{form.email}</p>}
              {form.phone   && <p className="text-primary-200 text-xs">{form.phone}</p>}
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase tracking-widest">INVOICE</p>
              <p className="text-white font-bold">#INV-001</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
