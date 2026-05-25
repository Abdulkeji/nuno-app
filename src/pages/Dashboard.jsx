import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  DollarSign, FileText, Clock, Users,
  Plus, ArrowRight, TrendingUp, AlertTriangle,
} from 'lucide-react';
import { useApp }     from '../context/AppContext';
import { useAuth }    from '../context/AuthContext';
import StatusBadge    from '../components/StatusBadge';
import { formatCurrency, formatDate, getEffectiveStatus } from '../utils/helpers';
import { format, subMonths, isSameMonth, isSameYear, parseISO } from 'date-fns';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { invoices, clients, businessProfile, stats } = useApp();

  const recentInvoices = useMemo(
    () => [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [invoices]
  );

  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(now, 5 - i);
      const total = invoices
        .filter((inv) => {
          if (inv.status !== 'paid') return false;
          const d = parseISO(inv.issueDate);
          return isSameMonth(d, month) && isSameYear(d, month);
        })
        .reduce((s, inv) => s + (inv.total || 0), 0);
      return { month: format(month, 'MMM'), revenue: total };
    });
  }, [invoices]);

  const overdueInvoices = invoices.filter(
    (inv) => getEffectiveStatus(inv) === 'overdue'
  );

  const currency = businessProfile?.defaultCurrency || 'USD';

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Hello, <span className="text-emerald-600">{currentUser?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Here’s what’s happening with your billing today.
          </p>
        </div>
        <Link to="/invoices/new" className="btn-primary shrink-0 w-full sm:w-auto text-base sm:text-sm py-3 sm:py-2.5">
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>
      </div>

      {/* Overdue alert */}
      {overdueInvoices.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl mb-4 sm:mb-6">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-semibold text-xs sm:text-sm">
              {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''}
            </p>
            <p className="text-red-600 text-[11px] sm:text-xs mt-0.5">
              Total outstanding: {formatCurrency(overdueInvoices.reduce((s, i) => s + i.total, 0), currency)}
              {' '}— Follow up with your clients to get paid.
            </p>
          </div>
          <Link to="/invoices?status=overdue" className="sm:ml-auto text-red-700 text-xs font-semibold hover:underline shrink-0 mt-2 sm:mt-0">
            View all →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue, currency)}
          sub={`${stats.paidCount} paid invoice${stats.paidCount !== 1 ? 's' : ''}`}
          color="bg-emerald-600"
        />
        <StatCard
          icon={Clock}
          label="Outstanding"
          value={formatCurrency(stats.outstanding, currency)}
          sub={`${stats.pendingCount} awaiting payment`}
          color="bg-amber-500"
        />
        <StatCard
          icon={FileText}
          label="Total Invoices"
          value={stats.totalInvoices}
          sub={`${stats.draftCount} draft`}
          color="bg-slate-600"
        />
        <StatCard
          icon={Users}
          label="Clients"
          value={stats.totalClients}
          sub="active clients"
          color="bg-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue chart */}
        <div className="card lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-slate-700 text-sm">Revenue Overview</h2>
              <p className="text-slate-400 text-xs mt-0.5">Last 6 months — paid invoices only</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          {chartData.some((d) => d.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(5,150,105,0.04)' }} />
                <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[160px] sm:h-[220px] text-slate-400">
              <TrendingUp className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No revenue data yet</p>
              <p className="text-xs mt-1">Create & mark invoices as paid to see revenue</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card min-w-0">
          <h2 className="font-semibold text-slate-700 text-xs sm:text-sm mb-3 sm:mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to: '/invoices/new', label: 'Create Invoice',    icon: FileText, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
              { to: '/clients',      label: 'Add Client',        icon: Users,    color: 'bg-slate-50 text-slate-600 hover:bg-slate-100' },
              { to: '/receipts',     label: 'View Receipts',     icon: FileText, color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
              { to: '/settings',     label: 'Business Settings', icon: Users,    color: 'bg-slate-50 text-slate-600 hover:bg-slate-100' },
            ].map(({ to, label, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 p-3 rounded-xl ${color} transition-colors`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-60" />
              </Link>
            ))}
          </div>

          {/* Invoice status breakdown */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Invoice Status</p>
            {[
          { label: 'Draft',   count: stats.draftCount,   color: 'bg-slate-300'   },
              { label: 'Sent',    count: stats.pendingCount,  color: 'bg-amber-400'   },
              { label: 'Paid',    count: stats.paidCount,     color: 'bg-emerald-500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full shrink-0 ${s.color}`} />
                <span className="text-[11px] sm:text-xs text-slate-600 flex-1">{s.label}</span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-900">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card mt-4 sm:mt-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
          <h2 className="font-semibold text-slate-700 text-xs sm:text-sm">Recent Invoices</h2>
          <Link to="/invoices" className="text-emerald-600 text-xs sm:text-sm font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="text-center py-6 sm:py-10 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No invoices yet</p>
            <Link to="/invoices/new" className="btn-primary mt-4 inline-flex">
              <Plus className="w-4 h-4" /> Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:-mx-6 px-2 sm:px-6">
            <table className="w-full min-w-[400px] sm:min-w-[600px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-header text-left rounded-tl-lg">Invoice #</th>
                  <th className="table-header text-left">Client</th>
                  <th className="table-header text-left">Date</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-right rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv, i) => (
                  <tr
                    key={inv.id}
                    className={`border-b transition-colors hover:bg-emerald-50/40 ${i === recentInvoices.length - 1 ? 'border-b-0' : 'border-slate-100'}`}
                  >
                    <td className="table-cell">
                      <Link
                        to={`/invoices/${inv.id}`}
                        className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                      >
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="table-cell font-medium text-slate-900">{inv.clientName}</td>
                    <td className="table-cell text-slate-500">{formatDate(inv.issueDate)}</td>
                    <td className="table-cell"><StatusBadge invoice={inv} /></td>
                    <td className="table-cell text-right font-semibold text-slate-900">
                      {formatCurrency(inv.total, inv.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
