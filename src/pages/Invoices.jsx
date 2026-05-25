import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus, Search, Filter, FileText, ChevronDown,
  Download, Trash2, Eye, Edit3, CheckCircle,
} from 'lucide-react';
import { useApp }       from '../context/AppContext';
import StatusBadge      from '../components/StatusBadge';
import {
  formatCurrency, formatDate, getEffectiveStatus,
} from '../utils/helpers';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const STATUSES = ['all', 'draft', 'sent', 'paid', 'overdue'];

export default function Invoices() {
  const { invoices, deleteInvoice, markAsPaid, businessProfile } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState(searchParams.get('status') || 'all');
  const [sortBy,    setSortBy]    = useState('date-desc');
  const [deleteId,  setDeleteId]  = useState(null);

  const filtered = useMemo(() => {
    let list = [...invoices];

    // Status filter
    if (status !== 'all') {
      list = list.filter((inv) => getEffectiveStatus(inv) === status);
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.clientName?.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':  return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-desc': return b.total - a.total;
        case 'amount-asc':  return a.total - b.total;
        default: return 0;
      }
    });

    return list;
  }, [invoices, status, search, sortBy]);

  const handleStatusChange = (s) => {
    setStatus(s);
    setSearchParams(s === 'all' ? {} : { status: s });
  };

  const confirmDelete = (id) => {
    deleteInvoice(id);
    setDeleteId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-slate-400 text-sm mt-0.5">{invoices.length} total invoices</p>
        </div>
        <Link to="/invoices/new" className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      {/* Filters bar */}
      <div className="card mb-4 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice # or client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field pr-8 appearance-none"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mt-3">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                status === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {s === 'all' ? `All (${invoices.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No invoices found</p>
            <p className="text-xs mt-1">
              {search || status !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first invoice to get started'}
            </p>
            {!search && status === 'all' && (
              <Link to="/invoices/new" className="btn-primary mt-4 inline-flex">
                <Plus className="w-4 h-4" /> Create Invoice
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(5,150,105,0.08)' }}>
                  <th className="table-header text-left">Invoice #</th>
                  <th className="table-header text-left">Client</th>
                  <th className="table-header text-left">Issue Date</th>
                  <th className="table-header text-left">Due Date</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-right">Amount</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const eff = getEffectiveStatus(inv);
                  return (
                    <tr
                      key={inv.id}
                      className="last:border-0 hover:bg-emerald-50/40 transition-colors"
                      style={{ borderBottom: '1px solid rgba(5,150,105,0.06)' }}
                    >
                      <td className="table-cell">
                        <Link
                          to={`/invoices/${inv.id}`}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="table-cell">
                        <p className="font-medium text-slate-900">{inv.clientName}</p>
                        <p className="text-slate-400 text-xs">{inv.clientEmail}</p>
                      </td>
                      <td className="table-cell text-slate-600">{formatDate(inv.issueDate)}</td>
                      <td className="table-cell text-slate-600">{formatDate(inv.dueDate)}</td>
                      <td className="table-cell"><StatusBadge status={eff} /></td>
                      <td className="table-cell text-right font-bold text-slate-900">
                        {formatCurrency(inv.total, inv.currency)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/invoices/${inv.id}`}
                            title="View"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/invoices/${inv.id}/edit`}
                            title="Edit"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          {eff !== 'paid' && (
                            <button
                              title="Mark as Paid"
                              onClick={() => markAsPaid(inv.id)}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            title="Download PDF"
                            onClick={() => generateInvoicePDF(inv, businessProfile)}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteId(inv.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center font-inter">Delete Invoice?</h3>
            <p className="text-slate-500 text-sm text-center mt-2 mb-6">
              This action cannot be undone. The invoice will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button onClick={() => confirmDelete(deleteId)} className="btn-danger flex-1 justify-center">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
