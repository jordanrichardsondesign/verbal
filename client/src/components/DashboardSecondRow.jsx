import { Clock, TriangleAlert, ClipboardCheck } from 'lucide-react';

const STATUS_CONFIG = {
  'on-track': {
    label: '✓ On track',
    className: 'bg-[#f0fdf4] text-[#34b0b4] font-semibold',
  },
  'expected-low': {
    label: 'Expected low',
    className: 'bg-[#f7f7f8] border border-[#e8e8ec] text-[#9b9ba7] font-semibold',
  },
  'monitor': {
    label: 'Monitor',
    className: 'bg-[rgba(255,95,124,0.1)] text-[#ff5f7c] font-semibold',
  },
};

const CHECKLIST_ROWS = [
  { label: 'Nurse Discharge',   pct: 75, calls: '67/89', barColor: '#34b0b4', status: 'on-track',      labelColor: '#020817' },
  { label: 'HIPAA Compliance',  pct: 72, calls: '64/89', barColor: '#34b0b4', status: 'on-track',      labelColor: '#020817' },
  { label: 'Post-Surgical',     pct:  9, calls:  '8/89', barColor: '#3ba7ff', status: 'expected-low',  labelColor: '#020817' },
  { label: 'Recording Only',    pct: 12, calls: '11/89', barColor: '#ff5f7c', status: 'monitor',       labelColor: '#ff5f7c', warning: true },
];

function AvgCallDuration() {
  return (
    <div className="avg-call-card bg-white rounded-lg p-6 flex flex-col gap-3 shrink-0 w-[340px] xl:w-[400px]">
      {/* Header */}
      <div className="flex items-center gap-1.5 w-full">
        <Clock size={13} strokeWidth={1.75} className="text-[#9b9ba7] shrink-0" />
        <span className="text-[11px] font-semibold tracking-[0.5px] uppercase text-[#9b9ba7] whitespace-nowrap">
          Avg Call Duration
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-[32px] font-bold tracking-[-1px] text-[#020817] leading-none">6.4</span>
        <span className="text-[14px] font-medium text-[#9b9ba7]">min avg</span>
      </div>

      {/* Threshold label */}
      <div className="flex items-center gap-1.5">
        <div className="size-[6px] rounded-[3px] bg-[#9b9ba7] shrink-0" />
        <span className="text-[12.5px] text-[#777]">Billing threshold: 5.0 min</span>
      </div>

      {/* Alert badge */}
      <div className="flex items-center gap-1 bg-[rgba(255,95,124,0.1)] rounded-md px-2.5 py-1 w-fit">
        <TriangleAlert size={12} strokeWidth={2} className="text-[#ff5f7c] shrink-0" />
        <span className="text-[12px] font-semibold text-[#ff5f7c] whitespace-nowrap">
          8 calls below threshold — 9% of calls
        </span>
      </div>

      {/* Agent breakdown */}
      <div>
        <p className="text-[11.5px] text-[#9b9ba7]">
          Marcus J. (3), Nina L. (2), Kevin R. (2), Priya D. (1)
        </p>
      </div>
    </div>
  );
}

function ChecklistCoverage() {
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col gap-3 flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <ClipboardCheck size={13} strokeWidth={1.75} className="text-[#9b9ba7] shrink-0" />
        <span className="text-[11px] font-semibold tracking-[0.5px] uppercase text-[#9b9ba7] whitespace-nowrap">
          Checklist Coverage — 89 calls this week
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col w-full">
        {CHECKLIST_ROWS.map(({ label, pct, calls, barColor, status, labelColor, warning }) => {
          const badge = STATUS_CONFIG[status];
          return (
            <div
              key={label}
              className="flex items-center gap-3 py-[7px]"
            >
              {/* Label */}
              <div className="flex items-center gap-1 shrink-0 w-[140px]">
                {warning && (
                  <TriangleAlert size={11} strokeWidth={2} className="text-[#ff5f7c] shrink-0" />
                )}
                <span
                  className="text-[12.5px] whitespace-nowrap"
                  style={{ color: labelColor, fontWeight: warning ? 500 : 400 }}
                >
                  {label}
                </span>
              </div>

              {/* Bar */}
              <div className="flex-1 min-w-[10px] h-[5px] bg-[#f7f7f8] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-1.5 shrink-0 justify-end min-w-[140px]">
                <span
                  className="text-[12px] font-semibold w-[28px] text-right"
                  style={{ color: warning ? '#ff5f7c' : '#777' }}
                >
                  {pct}%
                </span>
                <span className="text-[10.5px] text-[#9b9ba7] whitespace-nowrap">{calls} calls</span>
                <span className={`text-[11px] px-[7px] py-px rounded-[4px] whitespace-nowrap ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardSecondRow() {
  return (
    <div className="dashboard-second-row flex flex-row gap-3 w-full">
      <AvgCallDuration />
      <ChecklistCoverage />
    </div>
  );
}
