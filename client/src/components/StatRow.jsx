const STATS = [
  {
    best:  { label: 'Best on call adherence', name: '#1: Stephanie S.', value: '100%', positive: true },
    worst: { label: 'Needs improvement',      name: 'Jerry B.',         value: '0%',   positive: false },
  },
  {
    best:  { label: 'Best notes',       name: 'Brian K.', value: '100%', positive: true },
    worst: { label: 'Notes need work',  name: 'Jerry B.', value: '12%',  positive: false },
  },
  {
    best:  { label: 'Listens the most', name: 'Joanne P.', value: '78%', positive: true },
    worst: { label: 'Listens the least', name: 'Greg H.', value: '0%',   positive: false },
  },
  {
    best:  { label: 'Fastest speaker', name: 'Terry P.', value: '178 WPM', positive: false },
    worst: { label: 'Slowest speaker', name: 'Greg H.',  value: '102 WPM', positive: false },
  },
];

function StatBadge({ value, positive }) {
  return positive ? (
    <span className="inline-flex items-center justify-center h-[26px] px-4 rounded-full bg-[rgba(52,176,180,0.1)] text-[13px] font-medium text-[#44605e] tracking-[0.5px] whitespace-nowrap">
      {value}
    </span>
  ) : (
    <span className="inline-flex items-center justify-center h-[26px] px-4 rounded-full bg-[rgba(255,95,124,0.1)] text-[13px] font-medium text-[#ff5f7c] tracking-[0.5px] whitespace-nowrap">
      {value}
    </span>
  );
}

function StatGroup({ label, name, value, positive }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9b9ba7]">{label}</p>
      <div className="flex items-center justify-between h-[26px]">
        <span className="text-[12.5px] font-medium text-[#555] whitespace-nowrap">{name}</span>
        <StatBadge value={value} positive={positive} />
      </div>
    </div>
  );
}

export default function StatRow() {
  return (
    <div className="dashboard-stat-row flex flex-row gap-3 w-full">
      {STATS.map((card, i) => (
        <div key={i} className="bg-white rounded-lg p-6 flex flex-col gap-5 flex-1 min-w-0">
          <StatGroup {...card.best} />
          <StatGroup {...card.worst} />
        </div>
      ))}
    </div>
  );
}
