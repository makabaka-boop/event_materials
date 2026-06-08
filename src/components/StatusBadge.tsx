import { Status, STATUS_STYLE } from '../types';

interface Props {
  status: Status;
  compact?: boolean;
}

export function StatusBadge({ status, compact }: Props) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} font-medium rounded-full ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
