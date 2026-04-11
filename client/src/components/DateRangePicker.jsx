import { Calendar, ChevronDown } from 'lucide-react';

export const PERIODS = ['1W', '2W', '1M', '3M'];

export function getDateRange(period) {
  const end = new Date();
  const start = new Date();
  if (period === '1W') start.setDate(end.getDate() - 7);
  else if (period === '2W') start.setDate(end.getDate() - 14);
  else if (period === '1M') start.setMonth(end.getMonth() - 1);
  else if (period === '3M') start.setMonth(end.getMonth() - 3);

  const fmt = (d, showMonth) =>
    d.toLocaleDateString('en-US', showMonth ? { month: 'short', day: 'numeric' } : { day: 'numeric' });

  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  return `${fmt(start, true)} – ${fmt(end, !sameMonth)}`;
}

export default function DateRangePicker({ activePeriod, setActivePeriod }) {
  const dateLabel = getDateRange(activePeriod);

  return (
    <div className="flex items-center gap-[6px] px-[13px] py-[5px] rounded-[8px] border border-light-stroke bg-white">
      {/* Date range selector */}
      <button className="flex items-center gap-[6px] px-[8px] py-[6px] rounded-[6px] cursor-pointer hover:bg-gray-50 transition-colors">
        <Calendar size={14} strokeWidth={1.75} className="text-[#555] shrink-0" />
        <span className="text-[12px] font-medium text-[#555] whitespace-nowrap">{dateLabel}</span>
        <ChevronDown size={12} strokeWidth={1.75} className="text-[#555] shrink-0" />
      </button>

      {/* Vertical divider + period tabs */}
      <div className="flex items-center pl-[8px] border-l border-light-stroke gap-[2px]">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`px-[8px] py-[6px] rounded-[6px] text-[12px] whitespace-nowrap transition-colors cursor-pointer ${
              activePeriod === p
                ? 'bg-pale-green font-bold text-dark-green'
                : 'font-normal text-[#9b9ba7] hover:bg-pale-green/40'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
