
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const rules = [
    { ok: form.password.length >= 6,                    text: 'At least 6 characters' },
    { ok: /[A-Z]/.test(form.password),                  text: 'One uppercase letter'  },
    { ok: form.password === form.confirm && form.confirm.length > 0, text: 'Passwords match' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'oklch(0.985 0.004 286)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: '#0a1f14' }}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #059669, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        {/* Logo removed due to missing asset */}

        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Start billing<br />
            <span style={{ color: '#6ee7b7' }}>the smart way.</span>
          </h1>
          <ul className="space-y-3">
            {[
              'Create unlimited invoices',
              'Track payment status in real-time',
              'Generate receipts with one click',
              'Export professional PDFs',
              'Manage clients & business info',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-zinc-400 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#6ee7b7' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-zinc-600 text-sm relative z-10">© {new Date().getFullYear()} NUNO. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo removed due to missing asset */}

          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h2>
          <p className="text-slate-400 text-sm mt-2 mb-8">
            Free forever — no credit card required
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Jane Smith"
                className="input-field"
              />
            </div>

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
                  type={show.password ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show.password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <input
                  type={show.confirm ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  placeholder="Repeat your password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password strength hints */}
            {form.password && (
              <ul className="flex flex-wrap gap-2">
                {rules.map((r) => (
                  <li
                    key={r.text}
                    className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      r.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {r.text}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
