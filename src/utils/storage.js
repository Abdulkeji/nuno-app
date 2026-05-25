const PREFIX = 'invoicepro_';
const DEMO_EMAIL = 'demo@gmail.com';

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = () => {
  const raw = localStorage.getItem(`${PREFIX}users`);
  if (raw) {
    // Migrate demo user email if it still has an old address
    const users = JSON.parse(raw);
    const demo = users.find((u) => u.id === 'demo-user-001');
    if (demo && demo.email !== DEMO_EMAIL) {
      demo.email = DEMO_EMAIL;
      localStorage.setItem(`${PREFIX}users`, JSON.stringify(users));
    }
    return users;
  }

  // Seed the demo user on first load
  const seed = [
    {
      id: 'demo-user-001',
      name: 'Alex Johnson',
      email: DEMO_EMAIL,
      password: 'demo1234',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(`${PREFIX}users`, JSON.stringify(seed));
  return seed;
};

export const saveUser = (user) => {
  const users = getUsers();
  localStorage.setItem(`${PREFIX}users`, JSON.stringify([...users, user]));
};

// ─── Business Profile ─────────────────────────────────────────────────────────
export const getBusinessProfile = (userId) => {
  const raw = localStorage.getItem(`${PREFIX}business_${userId}`);
  return raw ? JSON.parse(raw) : null;
};

export const saveBusinessProfile = (userId, profile) => {
  localStorage.setItem(`${PREFIX}business_${userId}`, JSON.stringify(profile));
};

// ─── Clients ──────────────────────────────────────────────────────────────────
export const getClients = (userId) => {
  const raw = localStorage.getItem(`${PREFIX}clients_${userId}`);
  return raw ? JSON.parse(raw) : [];
};

export const saveClients = (userId, clients) => {
  localStorage.setItem(`${PREFIX}clients_${userId}`, JSON.stringify(clients));
};

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const getInvoices = (userId) => {
  const raw = localStorage.getItem(`${PREFIX}invoices_${userId}`);
  return raw ? JSON.parse(raw) : [];
};

export const saveInvoices = (userId, invoices) => {
  localStorage.setItem(`${PREFIX}invoices_${userId}`, JSON.stringify(invoices));
};

// ─── Invoice Counter ──────────────────────────────────────────────────────────
export const getNextInvoiceNumber = (userId) => {
  const key = `${PREFIX}counter_${userId}`;
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  const next = current + 1;
  localStorage.setItem(key, next.toString());
  return next;
};

export const peekInvoiceCounter = (userId) => {
  const key = `${PREFIX}counter_${userId}`;
  return parseInt(localStorage.getItem(key) || '0', 10) + 1;
};

// ─── Demo Data Seeder ─────────────────────────────────────────────────────────
export const seedDemoData = () => {
  const userId = 'demo-user-001';

  // Only seed if no invoices exist yet
  if (getInvoices(userId).length > 0) return;

  // Business profile
  saveBusinessProfile(userId, {
    businessName: 'Bright Studio Co.',
    address: '25 Innovation Drive, San Francisco, CA 94103',
    phone: '+1 (415) 555-0199',
    email: 'hello@brightstudio.co',
    website: 'www.brightstudio.co',
    taxNumber: 'US-TAX-882244',
    defaultCurrency: 'USD',
    defaultTaxRate: '10',
    defaultPaymentTerms: '30',
    logo: '',
  });

  // Clients
  const clients = [
    { id: 'cl-001', name: 'ACME Corporation', company: 'ACME Corp', email: 'billing@acme.com', phone: '+1 (212) 555-0100', address: '100 Business Ave, New York, NY 10001' },
    { id: 'cl-002', name: 'Beta Technologies', company: 'Beta Tech Inc.', email: 'accounts@betatech.io', phone: '+1 (310) 555-0202', address: '500 Tech Blvd, Los Angeles, CA 90028' },
    { id: 'cl-003', name: 'Gamma Retail LLC', company: 'Gamma Retail', email: 'finance@gammallc.com', phone: '+1 (312) 555-0303', address: '77 Commerce St, Chicago, IL 60601' },
  ];
  saveClients(userId, clients);

  // Invoice counter
  localStorage.setItem(`${PREFIX}counter_${userId}`, '5');

  // Invoices spanning the last 6 months
  const now = new Date();
  const sub = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  const invoices = [
    {
      id: 'inv-001', invoiceNumber: 'INV-001', clientId: 'cl-001', clientName: 'ACME Corporation',
      clientEmail: 'billing@acme.com', clientPhone: '+1 (212) 555-0100', clientAddress: '100 Business Ave, New York, NY 10001',
      issueDate: sub(90), dueDate: sub(60), status: 'paid', currency: 'USD',
      items: [
        { id: 1, description: 'Brand Identity Design', quantity: 1, unitPrice: 2500, total: 2500 },
        { id: 2, description: 'Logo Variations (3)', quantity: 3, unitPrice: 200, total: 600 },
      ],
      subtotal: 3100, taxRate: 10, taxAmount: 310, total: 3410,
      paymentMethod: 'Bank Transfer', notes: 'Thank you for your business!',
      terms: 'Payment within 30 days. Late fees apply after due date.',
      createdAt: sub(90), updatedAt: sub(60),
    },
    {
      id: 'inv-002', invoiceNumber: 'INV-002', clientId: 'cl-002', clientName: 'Beta Technologies',
      clientEmail: 'accounts@betatech.io', clientPhone: '+1 (310) 555-0202', clientAddress: '500 Tech Blvd, Los Angeles, CA 90028',
      issueDate: sub(60), dueDate: sub(30), status: 'paid', currency: 'USD',
      items: [
        { id: 1, description: 'UI/UX Design – Mobile App', quantity: 1, unitPrice: 4800, total: 4800 },
        { id: 2, description: 'Prototype & Handoff', quantity: 1, unitPrice: 700, total: 700 },
      ],
      subtotal: 5500, taxRate: 10, taxAmount: 550, total: 6050,
      paymentMethod: 'Wire Transfer', notes: 'Pleasure working with you.',
      terms: 'Net 30. All deliverables are property of client upon full payment.',
      createdAt: sub(60), updatedAt: sub(30),
    },
    {
      id: 'inv-003', invoiceNumber: 'INV-003', clientId: 'cl-003', clientName: 'Gamma Retail LLC',
      clientEmail: 'finance@gammallc.com', clientPhone: '+1 (312) 555-0303', clientAddress: '77 Commerce St, Chicago, IL 60601',
      issueDate: sub(45), dueDate: sub(15), status: 'overdue', currency: 'USD',
      items: [
        { id: 1, description: 'E-Commerce Website Development', quantity: 1, unitPrice: 6000, total: 6000 },
        { id: 2, description: 'SEO Setup & Optimization', quantity: 1, unitPrice: 800, total: 800 },
        { id: 3, description: 'Hosting & Deployment', quantity: 12, unitPrice: 50, total: 600 },
      ],
      subtotal: 7400, taxRate: 10, taxAmount: 740, total: 8140,
      paymentMethod: 'Bank Transfer', notes: 'Please process payment at your earliest convenience.',
      terms: 'Net 30. 1.5% per month late fee.',
      createdAt: sub(45), updatedAt: sub(45),
    },
    {
      id: 'inv-004', invoiceNumber: 'INV-004', clientId: 'cl-001', clientName: 'ACME Corporation',
      clientEmail: 'billing@acme.com', clientPhone: '+1 (212) 555-0100', clientAddress: '100 Business Ave, New York, NY 10001',
      issueDate: sub(10), dueDate: sub(-20), status: 'sent', currency: 'USD',
      items: [
        { id: 1, description: 'Social Media Marketing Package', quantity: 1, unitPrice: 1500, total: 1500 },
        { id: 2, description: 'Content Creation (10 posts)', quantity: 10, unitPrice: 80, total: 800 },
      ],
      subtotal: 2300, taxRate: 10, taxAmount: 230, total: 2530,
      paymentMethod: 'Credit Card', notes: 'Includes all social platforms agreed upon.',
      terms: 'Net 30.',
      createdAt: sub(10), updatedAt: sub(10),
    },
    {
      id: 'inv-005', invoiceNumber: 'INV-005', clientId: 'cl-002', clientName: 'Beta Technologies',
      clientEmail: 'accounts@betatech.io', clientPhone: '+1 (310) 555-0202', clientAddress: '500 Tech Blvd, Los Angeles, CA 90028',
      issueDate: sub(2), dueDate: sub(-28), status: 'draft', currency: 'USD',
      items: [
        { id: 1, description: 'React Dashboard Development', quantity: 1, unitPrice: 5500, total: 5500 },
      ],
      subtotal: 5500, taxRate: 10, taxAmount: 550, total: 6050,
      paymentMethod: 'Bank Transfer', notes: 'First milestone payment.',
      terms: 'Net 30.',
      createdAt: sub(2), updatedAt: sub(2),
    },
  ];

  saveInvoices(userId, invoices);
};
