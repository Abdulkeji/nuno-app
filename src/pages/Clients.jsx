import { useState } from 'react';
import {
  Plus, Search, Users, Edit3, Trash2,
  Mail, Phone, MapPin, Building2, FileText, X,
} from 'lucide-react';
import { useApp }    from '../context/AppContext';
import { generateId } from '../utils/helpers';
import { Link }      from 'react-router-dom';

const EMPTY_FORM = { name: '', company: '', email: '', phone: '', address: '' };

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient, invoices } = useApp();

  const [search,      setSearch]      = useState('');
  const [modal,       setModal]       = useState(false);
  const [editId,      setEditId]      = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [errors,      setErrors]      = useState({});

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModal(true);
  };

  const openEdit = (client) => {
    setEditId(client.id);
    setForm({
      name:    client.name || '',
      company: client.company || '',
      email:   client.email || '',
      phone:   client.phone || '',
      address: client.address || '',
    });
    setErrors({});
    setModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editId) {
      updateClient(editId, form);
    } else {
      addClient(form);
    }
    setModal(false);
  };

  const confirmDelete = () => {
    deleteClient(deleteId);
    setDeleteId(null);
  };

  const clientInvoices = (clientId) =>
    invoices.filter((inv) => inv.clientId === clientId);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clients</h1>
          <p className="text-slate-400 text-sm mt-0.5">{clients.length} client{clients.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button onClick={openAdd} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Client grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-14 h-14 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 font-inter">No clients yet</h3>
          <p className="text-slate-400 text-sm mt-2">
            {search ? 'No clients match your search.' : 'Add clients to reuse their info when creating invoices.'}
          </p>
          {!search && (
            <button onClick={openAdd} className="btn-primary mt-6 inline-flex">
              <Plus className="w-4 h-4" /> Add First Client
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => {
            const invs = clientInvoices(client.id);
            const paid = invs.filter((i) => i.status === 'paid');
            return (
              <div key={client.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <span className="text-primary-800 font-bold text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{client.name}</p>
                      {client.company && (
                        <p className="text-xs text-slate-500 truncate">{client.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => openEdit(client)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(client.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  {client.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span><strong className="text-slate-900">{invs.length}</strong> invoice{invs.length !== 1 ? 's' : ''}</span>
                    <span><strong className="text-emerald-700">{paid.length}</strong> paid</span>
                  </div>
                  <Link
                    to={`/invoices/new`}
                    state={{ prefillClient: client }}
                    className="text-primary-800 text-xs font-semibold hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> Invoice
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 font-inter">
                {editId ? 'Edit Client' : 'Add Client'}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="label">Full Name / Contact *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="input-field"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="label">Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Acme Corporation"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@company.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="123 Main St, City, Country"
                  className="textarea-field"
                />
              </div>
            </div>

            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                {editId ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center font-inter">Remove Client?</h3>
            <p className="text-slate-500 text-sm text-center mt-2 mb-6">
              This client will be removed. Existing invoices are not affected.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={confirmDelete} className="btn-danger flex-1 justify-center">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
