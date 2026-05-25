// Simple local database using browser's localStorage

const DB_KEY = 'nuno_app_db';

// Structure: { invoices: [], clients: [], receipts: [], settings: {} }
function getDb() {
  const db = localStorage.getItem(DB_KEY);
  return db ? JSON.parse(db) : { invoices: [], clients: [], receipts: [], settings: {} };
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export const localDb = {
  getAll: (key) => {
    const db = getDb();
    return db[key] || [];
  },
  add: (key, item) => {
    const db = getDb();
    db[key] = db[key] || [];
    db[key].push(item);
    saveDb(db);
    return item;
  },
  update: (key, id, updateFn) => {
    const db = getDb();
    db[key] = db[key].map((item) => (item.id === id ? updateFn(item) : item));
    saveDb(db);
  },
  remove: (key, id) => {
    const db = getDb();
    db[key] = db[key].filter((item) => item.id !== id);
    saveDb(db);
  },
  clear: () => {
    localStorage.removeItem(DB_KEY);
  },
  getSettings: () => {
    const db = getDb();
    return db.settings || {};
  },
  setSettings: (settings) => {
    const db = getDb();
    db.settings = settings;
    saveDb(db);
  },
};
