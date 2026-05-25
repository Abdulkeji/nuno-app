import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getInvoices, saveInvoices,
  getClients, saveClients,
  getBusinessProfile, saveBusinessProfile,
  getNextInvoiceNumber,
} from '../utils/storage';
import { generateId, formatInvoiceNumber, calcTotals } from '../utils/helpers';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const { currentUser } = useAuth();
  const uid = currentUser?.id;

  const [invoices,        setInvoices]        = useState([]);
  const [clients,         setClients]         = useState([]);
  const [businessProfile, setBusinessProfile] = useState(null);

  // ─── Load data when user changes ─────────────────────────────────────────
  useEffect(() => {
    if (!uid) {
      setInvoices([]);
      setClients([]);
      setBusinessProfile(null);
      return;
    }
    setInvoices(getInvoices(uid));
    setClients(getClients(uid));
    setBusinessProfile(getBusinessProfile(uid));
  }, [uid]);

  // ─── Invoice helpers ──────────────────────────────────────────────────────
  const addInvoice = useCallback((data) => {
    const num   = getNextInvoiceNumber(uid);
    const totals = calcTotals(data.items, data.taxRate);
    const newInv = {
      ...data,
      id:            generateId(),
      invoiceNumber: data.invoiceNumber || formatInvoiceNumber(num),
      ...totals,
      createdAt:     new Date().toISOString(),
      updatedAt:     new Date().toISOString(),
    };
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    saveInvoices(uid, updated);
    return newInv;
  }, [uid, invoices]);

  const updateInvoice = useCallback((id, changes) => {
    const totals = changes.items ? calcTotals(changes.items, changes.taxRate ?? invoices.find(i => i.id === id)?.taxRate) : {};
    const updated = invoices.map((inv) =>
      inv.id === id
        ? { ...inv, ...changes, ...totals, updatedAt: new Date().toISOString() }
        : inv
    );
    setInvoices(updated);
    saveInvoices(uid, updated);
  }, [uid, invoices]);

  const deleteInvoice = useCallback((id) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    setInvoices(updated);
    saveInvoices(uid, updated);
  }, [uid, invoices]);

  const markAsPaid = useCallback((id) => {
    updateInvoice(id, { status: 'paid', paidDate: new Date().toISOString() });
  }, [updateInvoice]);

  // ─── Client helpers ───────────────────────────────────────────────────────
  const addClient = useCallback((data) => {
    const newClient = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [...clients, newClient];
    setClients(updated);
    saveClients(uid, updated);
    return newClient;
  }, [uid, clients]);

  const updateClient = useCallback((id, changes) => {
    const updated = clients.map((c) => (c.id === id ? { ...c, ...changes } : c));
    setClients(updated);
    saveClients(uid, updated);
  }, [uid, clients]);

  const deleteClient = useCallback((id) => {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    saveClients(uid, updated);
  }, [uid, clients]);

  // ─── Business Profile ─────────────────────────────────────────────────────
  const updateBusinessProfile = useCallback((data) => {
    setBusinessProfile(data);
    saveBusinessProfile(uid, data);
  }, [uid]);

  // ─── Dashboard Stats ──────────────────────────────────────────────────────
  const stats = (() => {
    const paid    = invoices.filter((i) => i.status === 'paid');
    const pending = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue');
    const revenue = paid.reduce((s, i) => s + (i.total || 0), 0);
    const outstanding = pending.reduce((s, i) => s + (i.total || 0), 0);
    return {
      totalRevenue:    revenue,
      outstanding,
      totalInvoices:   invoices.length,
      totalClients:    clients.length,
      paidCount:       paid.length,
      pendingCount:    pending.length,
      draftCount:      invoices.filter((i) => i.status === 'draft').length,
    };
  })();

  return (
    <AppContext.Provider value={{
      invoices, clients, businessProfile, stats,
      addInvoice, updateInvoice, deleteInvoice, markAsPaid,
      addClient, updateClient, deleteClient,
      updateBusinessProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}
