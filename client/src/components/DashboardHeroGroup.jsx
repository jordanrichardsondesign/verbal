import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ReferenceLine,
  ResponsiveContainer, Tooltip,
} from 'recharts';

const PERIOD_LABELS = {
  '1W': 'Last Week',
  '2W': 'Last 2 Weeks',
  '1M': 'Last Month',
  '3M': 'Last 3 Months',
};

// Deterministic data patterns per period — ends at current values (call: 82%, note: 60%)
const DATA_PATTERNS = {
  '1W': { call: [76, 80, 78, 79, 81, 83, 82], note: [73, 70, 68, 65, 63, 61, 60], days: 7 },
  '2W': { call: [72, 75, 77, 79, 78, 81, 82], note: [75, 72, 70, 67, 64, 62, 60], days: 14 },
  '1M': { call: [70, 74, 77, 80, 82], note: [78, 74, 69, 64, 60], days: 30 },
  '3M': { call: [65, 70, 74, 77, 80, 82], note: [82, 78, 73, 68, 63, 60], days: 90 },
};

function generateData(period) {
  const { call, note, days } = DATA_PATTERNS[period];
  const points = call.length;
  const today = new Date();
  const interval = days / (points - 1);
  return call.map((callVal, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - days + Math.round(i * interval));
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      callAdherence: callVal,
      noteAdherence: note[i],
    };
  });
}

const MISSED_ITEMS = [
  { label: 'Inquire about barriers', pct: 55 },
  { label: 'Confirm medication', pct: 42 },
  { label: 'Discuss gaps in care', pct: 37 },
  { label: 'Medication reconciliation', pct: 24 },
  { label: 'Discharge instructions', pct: 21 },
  { label: 'HIPAA verification', pct: 15 },
];

function barColor(pct) {
  if (pct >= 35) return '#ff5f7c';
  if (pct >= 20) return '#ff7678';
  return '#34b0b4';
}

function LegendPill({ color, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-[#fafafd] border border-light-stroke rounded-full px-3 py-1 shrink-0">
      <div className="h-[4px] w-[20px] rounded-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex items-center gap-1.5 text-[12px] whitespace-nowrap">
        <span className="font-normal text-[#555]">{label}</span>
        <span className="font-bold text-[#555]">{value}%</span>
      </div>
    </div>
  );
}

export default function DashboardHeroGroup({ period }) {
  const data = useMemo(() => generateData(period), [period]);
  const first = data[0];
  const last = data[data.length - 1];

  return (
    <div className="dashboard-hero flex flex-row w-full bg-white rounded-lg overflow-hidden">

      {/* Left — Line Chart */}
      <div className="flex-1 min-w-0 pt-6 px-6 pb-6 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9b9ba7]">
            Adherence Trend — {PERIOD_LABELS[period]}
          </p>
          <div className="flex flex-wrap gap-3">
            <LegendPill color="#34b0b4" label="Call adherence" value={last.callAdherence} />
            <LegendPill color="#3ba7ff" label="Note adherence" value={last.noteAdherence} />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={155}>
          <AreaChart data={data} margin={{ top: 10, right: 64, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="callGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34b0b4" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#34b0b4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="noteGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3ba7ff" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#3ba7ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9a9a9a', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              domain={[40, 105]}
              ticks={[50, 80, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#9a9a9a', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <ReferenceLine
              y={80}
              stroke="#d5d5d5"
              strokeDasharray="4 4"
              label={{ value: '80% Goal', position: 'right', fontSize: 11, fill: '#888', fontFamily: 'Inter' }}
            />
            <Area
              type="monotone"
              dataKey="callAdherence"
              stroke="#34b0b4"
              strokeWidth={2}
              fill="url(#callGrad)"
              dot={(props) => {
                const { cx, cy, index } = props;
                if (index !== data.length - 1) return <g key={index} />;
                return <circle key={index} cx={cx} cy={cy} r={5} fill="#34b0b4" stroke="white" strokeWidth={2} />;
              }}
              activeDot={{ r: 4, fill: '#34b0b4' }}
            />
            <Area
              type="monotone"
              dataKey="noteAdherence"
              stroke="#3ba7ff"
              strokeWidth={2}
              fill="url(#noteGrad)"
              dot={(props) => {
                const { cx, cy, index } = props;
                if (index !== data.length - 1) return <g key={index} />;
                return <circle key={index} cx={cx} cy={cy} r={5} fill="#3ba7ff" stroke="white" strokeWidth={2} />;
              }}
              activeDot={{ r: 4, fill: '#3ba7ff' }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                fontFamily: 'Inter',
                borderColor: '#ebebeb',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              formatter={(v, key) => [
                `${v}%`,
                key === 'callAdherence' ? 'Call Adherence' : 'Note Adherence',
              ]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <div className="w-px bg-[#f1f4f4] self-stretch shrink-0" />

      {/* Right — Missed Checklist Items */}
      <div className="hero-right w-[38%] shrink-0 p-6 flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9b9ba7] whitespace-nowrap">
          Most missed checklist items
        </p>
        <div className="flex flex-col gap-1 w-full">
          {MISSED_ITEMS.map(({ label, pct }) => (
            <div key={label} className="flex items-center gap-2 py-[5px]">
              <span className="text-[12px] text-[#555] w-[90px] xl:w-[140px] shrink-0 truncate">{label}</span>
              <div className="flex-1 min-w-[20px] h-[5px] bg-[#f7f7f8] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor(pct) }}
                />
              </div>
              <span className="text-[11px] font-semibold text-[#555] w-[28px] text-right shrink-0">
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
