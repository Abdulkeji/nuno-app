import { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, saveUser, seedDemoData } from '../utils/storage';
import { generateId } from '../utils/helpers';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure demo user + seed data exist
    getUsers();
    seedDemoData();

    const stored = localStorage.getItem('invoicepro_session');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('invoicepro_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error('Invalid email or password. Try demo@gmail.com / demo1234');
    const session = { id: user.id, email: user.email, name: user.name };
    localStorage.setItem('invoicepro_session', JSON.stringify(session));
    setCurrentUser(session);
    return session;
  };

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    const session = { id: newUser.id, email: newUser.email, name: newUser.name };
    localStorage.setItem('invoicepro_session', JSON.stringify(session));
    setCurrentUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem('invoicepro_session');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
