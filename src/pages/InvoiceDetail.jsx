import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Download, Edit3, Trash2, CheckCircle,
  Send, FileText, Clock, Building2, User,
} from 'lucide-react';
import { useApp }             from '../context/AppContext';
import StatusBadge            from '../components/StatusBadge';
import { generateInvoicePDF, generateReceiptPDF } from '../utils/pdfGenerator';
import { formatCurrency, formatDate, getEffectiveStatus } from '../utils/helpers';

export default function InvoiceDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { invoices, deleteInvoice, markAsPaid, businessProfile } = useApp();

  const invoice = invoices.find((inv) => inv.id === id);
  const [deleteModal, setDeleteModal] = useState(false);

  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p className="text-slate-600 font-medium">Invoice not found</p>
        <Link to="/invoices" className="btn-primary mt-4 inline-flex">Back to Invoices</Link>
      </div>
    );
  }

  const status = getEffectiveStatus(invoice);
  const sym    = invoice.currency === 'EUR' ? '€'
               : invoice.currency === 'GBP' ? '£'
               : invoice.currency === 'NGN' ? '₦'
               : '$';

  const handleDelete = () => {
    deleteInvoice(id);
    navigate('/invoices');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Top actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 no-print">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="sm:ml-auto flex flex-wrap gap-2">
          {status !== 'paid' && (
            <button
              onClick={() => markAsPaid(id)}
              className="btn-success"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Paid
            </button>
          )}
          <Link to={`/invoices/${id}/edit`} className="btn-secondary">
            <Edit3 className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={() => generateInvoicePDF(invoice, businessProfile)}
            className="btn-secondary"
          >
            <Download className="w-4 h-4" /> Invoice PDF
          </button>
          {status === 'paid' && (
            <button
              onClick={() => generateReceiptPDF(invoice, businessProfile)}
              className="btn-success"
            >
              <Download className="w-4 h-4" /> Receipt PDF
            </button>
          )}
          <button
            onClick={() => setDeleteModal(true)}
            className="btn-danger"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Invoice card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden print-area">

        {/* Header */}
        <div className="bg-primary-800 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white font-inter">
                {businessProfile?.businessName || 'Your Business'}
              </h1>
              {businessProfile?.address && (
                <p className="text-primary-200 text-sm mt-1">{businessProfile.address}</p>
              )}
              {businessProfile?.email && (
                <p className="text-primary-200 text-sm">{businessProfile.email}</p>
              )}
              {businessProfile?.phone && (
                <p className="text-primary-200 text-sm">{businessProfile.phone}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase tracking-widest">INVOICE</p>
              <p className="text-white text-xl font-bold font-inter">{invoice.invoiceNumber}</p>
              <div className="mt-2">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
        </div>

        {/* Dates row */}
        <div className="bg-slate-50 px-8 py-4 flex flex-wrap gap-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Issue Date</p>
              <p className="text-sm font-semibold text-slate-900">{formatDate(invoice.issueDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Due Date</p>
              <p className={`text-sm font-semibold ${status === 'overdue' ? 'text-red-600' : 'text-slate-900'}`}>
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
          {invoice.paidDate && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-xs text-slate-500">Paid On</p>
                <p className="text-sm font-semibold text-emerald-700">{formatDate(invoice.paidDate)}</p>
              </div>
            </div>
          )}
          {invoice.currency && (
            <div className="ml-auto">
              <p className="text-xs text-slate-500">Currency</p>
              <p className="text-sm font-semibold text-slate-900">{invoice.currency}</p>
            </div>
          )}
        </div>

        {/* Bill To */}
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-4 h-4 text-primary-800" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bill To</p>
              <p className="font-bold text-slate-900">{invoice.clientName}</p>
              {invoice.clientEmail   && <p className="text-sm text-slate-600">{invoice.clientEmail}</p>}
              {invoice.clientPhone   && <p className="text-sm text-slate-600">{invoice.clientPhone}</p>}
              {invoice.clientAddress && <p className="text-sm text-slate-600">{invoice.clientAddress}</p>}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="px-8 py-6 border-b border-slate-100 overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
                <th className="text-center pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-16">Qty</th>
                <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">Unit Price</th>
                <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, i) => (
                <tr key={item.id || i} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 text-slate-800 font-medium">{item.description || '—'}</td>
                  <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-600">
                    {sym}{parseFloat(item.unitPrice || 0).toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-semibold text-slate-900">
                    {sym}{parseFloat(item.total || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{sym}{parseFloat(invoice.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({invoice.taxRate || 0}%)</span>
                <span>{sym}{parseFloat(invoice.taxAmount || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-base text-slate-900">
                <span>Total</span>
                <span className="text-primary-800 text-lg">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        {(invoice.paymentMethod || invoice.notes || invoice.terms) && (
          <div className="px-8 py-6 bg-slate-50 grid sm:grid-cols-3 gap-6 text-sm">
            {invoice.paymentMethod && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Payment Method</p>
                <p className="text-slate-800">{invoice.paymentMethod}</p>
              </div>
            )}
            {invoice.notes && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-slate-700 leading-relaxed">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Terms</p>
                <p className="text-slate-700 leading-relaxed">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Receipt conversion callout */}
        {status === 'paid' && (
          <div className="px-8 py-4 bg-emerald-50 border-t border-emerald-100 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-800 font-semibold text-sm">Payment confirmed!</p>
              <p className="text-emerald-600 text-xs">
                This invoice has been converted to a receipt. Download it above.
              </p>
            </div>
            <button
              onClick={() => generateReceiptPDF(invoice, businessProfile)}
              className="btn-success text-xs px-3 py-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Receipt
            </button>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center font-inter">Delete Invoice?</h3>
            <p className="text-slate-500 text-sm text-center mt-2 mb-6">
              <strong>{invoice.invoiceNumber}</strong> will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleDelete} className="btn-danger flex-1 justify-center">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
