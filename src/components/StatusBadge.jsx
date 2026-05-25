import { STATUS_CONFIG, getEffectiveStatus } from '../utils/helpers';

export default function StatusBadge({ status, invoice }) {
  const effective = invoice ? getEffectiveStatus(invoice) : status;
  const cfg = STATUS_CONFIG[effective] || STATUS_CONFIG.draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
