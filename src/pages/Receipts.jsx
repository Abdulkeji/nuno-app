import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Download, Eye, ArrowRight, FileText } from 'lucide-react';
import { useApp }             from '../context/AppContext';
import { generateReceiptPDF } from '../utils/pdfGenerator';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Receipts() {
  const { invoices, businessProfile } = useApp();

  const receipts = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === 'paid')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [invoices]
  );

  const receiptNumber = (inv) =>
    `REC-${inv.invoiceNumber.replace('INV-', '')}`;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Receipts</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Paid invoices are automatically converted into receipts
        </p>
      </div>

      {receipts.length === 0 ? (
        <div className="card text-center py-16">
          <Receipt className="w-14 h-14 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 font-inter">No receipts yet</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            When you mark an invoice as paid, it will automatically appear here as a receipt.
          </p>
          <Link to="/invoices" className="btn-primary mt-6 inline-flex">
            <FileText className="w-4 h-4" /> View Invoices
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="card text-center py-4">
              <p className="text-2xl font-black text-slate-900 tracking-tight">{receipts.length}</p>
              <p className="text-slate-500 text-sm mt-0.5">Total Receipts</p>
            </div>
            <div className="card text-center py-4">
              <p className="text-2xl font-bold text-emerald-700 font-inter">
                {formatCurrency(
                  receipts.reduce((s, r) => s + (r.total || 0), 0),
                  receipts[0]?.currency
                )}
              </p>
              <p className="text-slate-500 text-sm mt-0.5">Total Collected</p>
            </div>
            <div className="card text-center py-4 col-span-2 sm:col-span-1">
              <p className="text-2xl font-bold text-slate-900 font-inter">
                {new Set(receipts.map((r) => r.clientName)).size}
              </p>
              <p className="text-slate-500 text-sm mt-0.5">Unique Clients</p>
            </div>
          </div>

          {/* Receipt cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {receipts.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
              >
                {/* Green header */}
                <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-sm">{receiptNumber(inv)}</span>
                  </div>
                  <span className="text-emerald-100 text-xs">
                    ref: {inv.invoiceNumber}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="font-semibold text-slate-900 truncate">{inv.clientName}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">{inv.clientEmail}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Paid On</p>
                      <p className="text-sm font-medium text-slate-700">
                        {formatDate(inv.paidDate || inv.updatedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="text-base font-bold text-slate-900">
                        {formatCurrency(inv.total, inv.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {inv.items?.slice(0, 2).map((item, i) => (
                      <p key={i} className="text-xs text-slate-500 truncate">
                        · {item.description}
                      </p>
                    ))}
                    {inv.items?.length > 2 && (
                      <p className="text-xs text-slate-400">
                        +{inv.items.length - 2} more item{inv.items.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/invoices/${inv.id}`}
                      className="flex-1 btn-secondary justify-center text-xs py-2 px-3"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <button
                      onClick={() => generateReceiptPDF(inv, businessProfile)}
                      className="flex-1 btn-success justify-center text-xs py-2 px-3"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
