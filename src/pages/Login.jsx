import nunoLogo from '../assets/nuno-logo.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () =>
    setForm({ email: 'demo@gmail.com', password: 'demo1234' });

  return (
    <div className="min-h-screen flex" style={{ background: 'oklch(0.985 0.004 286)' }}>
      {/* â”€â”€ Left panel â€” editorial dark â”€â”€ */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: '#0a1f14' }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #059669, transparent 70%)', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #047857, transparent 70%)', transform: 'translate(-40%, 40%)' }}
        />

        {/* Logo image */}
        <div className="flex items-center gap-3 relative z-10">
          <img
            src={nunoLogo}
            alt="NUNO Logo"
            className="w-14 h-14 rounded-xl bg-transparent"
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-6">Invoicing, elevated.</p>
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Beautiful invoices.<br />
            <span style={{ color: '#6ee7b7' }}>Zero friction.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
            Create invoices, track payments, and turn receipts into revenue â€” all from one clean workspace.
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {['PDF Export', 'Payment Tracking', 'Client CRM', 'Receipt Generator'].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: 'rgba(5,150,105,0.15)', color: '#6ee7b7', border: '1px solid rgba(5,150,105,0.25)' }}
              >
                <Sparkles className="w-3 h-3" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-zinc-600 text-sm relative z-10">Â© {new Date().getFullYear()} NUNO. All rights reserved.</p>
      </div>

      {/* â”€â”€ Right panel â€” form â”€â”€ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <img
              src={nunoLogo}
              alt="NUNO Logo"
              className="w-10 h-10 rounded-xl bg-transparent"
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-slate-400 text-sm mt-2 mb-8">
            Sign in to continue to your workspace
          </p>

          {/* Demo credentials banner */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-6 text-left transition-all duration-150 group"
            style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(5,150,105,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(5,150,105,0.07)'}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
            >
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <div>
              <p className="text-emerald-700 text-sm font-semibold">Try demo account</p>
              <p className="text-emerald-600 text-xs">demo@gmail.com · demo1234</p>
            </div>
            <span className="ml-auto text-emerald-500 text-xs font-medium">Click to fill →</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Your password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? 'Signing inâ€¦' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            No account?{' '}
            <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
