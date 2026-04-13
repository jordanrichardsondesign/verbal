import { useState, useRef, useEffect } from 'react';
import {
  ComposedChart, Scatter, Line, XAxis, YAxis,
  ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';
import { Funnel, User, TrendingUp, ChevronDown, Check } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import ChecklistPicker from './ChecklistPicker';
import ProviderPicker from './ProviderPicker';
import PatientPicker from './PatientPicker';
import { FilterButton, SearchInput } from './PageControls';
import CallDetailModal from './CallDetailModal';
import { COL, Badge, TableColHeader, CallRow, useContainerWidth, computeVisibleCols, getChecklistWidth } from './CallsTable';
import { CALLS } from '../data/calls';


/* ────────────────────────────────────────────────
   Chart panel — Adherence scatter + trend line
───────────────────────────────────────────────── */

// Enriched scatter data — each dot = one call with real provider info
const SCATTER_DATA = [
  { x: 1,  y: 74, provider: 'Stephanie Jackson', initials: 'SJ', duration: '01:20:34' },
  { x: 1,  y: 62, provider: 'Michael King',       initials: 'MK', duration: '00:48:10' },
  { x: 2,  y: 88, provider: 'Laura Hill',         initials: 'LH', duration: '00:32:55' },
  { x: 3,  y: 55, provider: 'Alice Newton',        initials: 'AN', duration: '00:12:04' },
  { x: 3,  y: 91, provider: 'Robert Collins',      initials: 'RC', duration: '00:55:22' },
  { x: 4,  y: 70, provider: 'Henry James',         initials: 'HJ', duration: '01:02:18' },
  { x: 5,  y: 45, provider: 'Cynthia Turner',      initials: 'CT', duration: '00:41:33' },
  { x: 5,  y: 82, provider: 'James Peterson',      initials: 'JP', duration: '00:28:47' },
  { x: 6,  y: 78, provider: 'Emma Matthews',       initials: 'EM', duration: '00:37:15' },
  { x: 7,  y: 60, provider: 'Thomas White',        initials: 'TW', duration: '00:51:09' },
  { x: 8,  y: 95, provider: 'Stephanie Jackson',   initials: 'SJ', duration: '00:44:20' },
  { x: 9,  y: 68, provider: 'Michael King',        initials: 'MK', duration: '00:19:38' },
  { x: 9,  y: 50, provider: 'Alice Newton',         initials: 'AN', duration: '00:22:51' },
  { x: 11, y: 85, provider: 'Laura Hill',          initials: 'LH', duration: '00:38:12' },
  { x: 12, y: 72, provider: 'Robert Collins',       initials: 'RC', duration: '00:59:44' },
  { x: 13, y: 88, provider: 'Henry James',          initials: 'HJ', duration: '00:46:05' },
  { x: 13, y: 40, provider: 'Cynthia Turner',       initials: 'CT', duration: '00:15:30' },
  { x: 14, y: 92, provider: 'James Peterson',       initials: 'JP', duration: '00:33:18' },
  { x: 15, y: 76, provider: 'Emma Matthews',        initials: 'EM', duration: '00:52:47' },
  { x: 17, y: 83, provider: 'Thomas White',         initials: 'TW', duration: '00:29:55' },
  { x: 18, y: 90, provider: 'Stephanie Jackson',    initials: 'SJ', duration: '00:41:10' },
  { x: 19, y: 65, provider: 'Michael King',         initials: 'MK', duration: '00:24:33' },
  { x: 20, y: 95, provider: 'Laura Hill',           initials: 'LH', duration: '00:36:08' },
  { x: 21, y: 87, provider: 'Robert Collins',        initials: 'RC', duration: '01:04:22' },
  { x: 22, y: 78, provider: 'Henry James',           initials: 'HJ', duration: '00:49:17' },
  { x: 23, y: 93, provider: 'James Peterson',        initials: 'JP', duration: '00:31:44' },
  { x: 24, y: 88, provider: 'Emma Matthews',         initials: 'EM', duration: '00:58:30' },
  { x: 25, y: 96, provider: 'Stephanie Jackson',     initials: 'SJ', duration: '00:43:55' },
];

// Smooth upward trend line
const TREND_DATA = [
  { x: 1, trend: 67 }, { x: 5, trend: 72 }, { x: 9, trend: 75 },
  { x: 13, trend: 78 }, { x: 17, trend: 82 }, { x: 21, trend: 86 },
  { x: 25, trend: 88 },
];

const X_TICKS = [1, 5, 9, 13, 17, 21, 25];

/* ── Custom hover tooltip ── */
function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d?.provider) return null;
  return (
    <div className="bg-white border border-[#ebebeb] rounded-[10px] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] px-[14px] py-[12px] flex flex-col gap-[8px] min-w-[180px]">
      {/* Provider */}
      <div className="flex items-center gap-[8px]">
        <div className="shrink-0 flex items-center justify-center size-[26px] rounded-full bg-[#e0eefe]">
          <span className="text-[10px] font-medium text-[#0055a3]">{d.initials}</span>
        </div>
        <span className="text-[12px] font-medium text-[#444]">{d.provider}</span>
      </div>
      {/* Stats */}
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[11px] text-[#888]">Adherence</span>
          <span className="text-[11px] font-semibold text-[#444]">{d.y}%</span>
        </div>
        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[11px] text-[#888]">Duration</span>
          <span className="text-[11px] font-semibold text-[#444]">{d.duration}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Metric options ── */
const METRICS = [
  { key: 'callAdh',  label: 'Call Adherence',   color: '#34B0B4' },
  { key: 'noteAdh',  label: 'Note Adherence',    color: '#3BA7FF' },
  { key: 'pace',     label: 'Pace',              color: '#618985' },
  { key: 'listen',   label: 'Listen Ratio',      color: '#6868EC' },
  { key: 'language', label: 'Provider Language', color: '#616D89' },
];

/* ── Custom dot ── */
function ScatterDot({ cx, cy, color }) {
  return (
    <circle
      cx={cx} cy={cy} r={4}
      fill={color} fillOpacity={0.75}
      stroke="white" strokeWidth={1.5}
      style={{ cursor: 'pointer' }}
    />
  );
}

function AdherenceChart() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [metric,  setMetric]  = useState(METRICS[0]);
  const menuRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  return (
    <div className="bg-white rounded-lg p-[30px] flex flex-col gap-4 flex-1 min-w-0">
      {/* Dropdown header */}
      <div className="flex items-center justify-between">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="flex items-center gap-[6px] px-[8px] py-[5px] -mx-[8px] -my-[5px] rounded-[7px] hover:bg-[#f5f5f8] transition-colors cursor-pointer"
          >
            <span className="text-[16px] font-medium text-[#555]">{metric.label}</span>
            <ChevronDown
              size={14} strokeWidth={1.75}
              className={`text-[#888] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute top-[calc(100%+8px)] left-[-8px] z-50 bg-white rounded-[10px] shadow-[0px_8px_24px_rgba(0,0,0,0.1)] border border-[#ebebeb] py-[4px] min-w-[190px]">
              {METRICS.map((m) => {
                const active = metric.key === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => { setMetric(m); setIsOpen(false); }}
                    className={`w-full flex items-center gap-[10px] px-[12px] py-[9px] text-[13px] hover:bg-[#fafafd] transition-colors text-left ${active ? 'text-[#333] font-medium' : 'text-[#555]'}`}
                  >
                    <span className="size-[8px] rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                    {m.label}
                    {active && <Check size={12} strokeWidth={2.5} className="ml-auto shrink-0" style={{ color: m.color }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Score row */}
      <div className="flex items-start justify-between">
        <div className="flex items-end gap-1">
          <span className="text-[34px] font-medium text-[#555] leading-none">88%</span>
          <span className="text-[18px] leading-none pb-0.5">👍</span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={11} strokeWidth={2} className="text-[#555]" />
            <span className="text-[10px] font-medium text-[#555]">Up 12%</span>
            <span className="text-[10px] font-medium text-[#555]">this month</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-[10px] font-medium text-[#888]">Starting variance: <span className="text-[#555]">74%</span></span>
            <span className="text-[10px] font-medium text-[#888]">Ending variance: <span className="text-[#555]">32%</span></span>
          </div>
        </div>
      </div>

      {/* Chart — fills remaining vertical space */}
      <ResponsiveContainer width="100%" height="100%" className="flex-1 min-h-0">
        <ComposedChart margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            xAxisId="main"
            type="number"
            dataKey="x"
            domain={[0, 26]}
            ticks={X_TICKS}
            tickFormatter={(v) => `6/${v}`}
            tick={{ fontSize: 11, fill: '#888', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <YAxis
            yAxisId="scatter"
            type="number"
            dataKey="y"
            domain={[0, 105]}
            ticks={[25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#888', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <YAxis yAxisId="trend" type="number" domain={[0, 105]} hide />

          <ReferenceLine yAxisId="scatter" y={80} stroke="#e8e8ec" strokeDasharray="4 3" />
          <Tooltip content={<ScatterTooltip />} cursor={false} />

          <Scatter
            xAxisId="main"
            yAxisId="scatter"
            data={SCATTER_DATA}
            shape={(props) => <ScatterDot {...props} color={metric.color} />}
            isAnimationActive={false}
          />
          <Line
            xAxisId="main"
            yAxisId="trend"
            data={TREND_DATA}
            dataKey="trend"
            type="monotone"
            stroke={metric.color}
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Critical calls panel
───────────────────────────────────────────────── */
const CRITICAL_CALLS = [
  { callIndex: 0, time: 'Today, 11:30 AM',    flags: [{ label: 'Pace: 110 WPM' }, { label: 'Adherence: 0%' }] },
  { callIndex: 1, time: 'Today, 10:00 AM',    flags: [{ label: 'Pace: 122 WPM' }, { label: 'Adherence: 0%' }] },
  { callIndex: 2, time: 'Today, 9:30 AM',     flags: [{ label: 'Adherence: 0%' }] },
  { callIndex: 3, time: 'Yesterday, 1:45 PM', flags: [{ label: 'Pace: 107 WPM' }] },
  { callIndex: 4, time: 'Yesterday, 2:15 PM', flags: [{ label: 'Listen: 32%' }, { label: 'Adherence: 85%' }] },
];

function CriticalCalls({ onSelect }) {
  return (
    <div className="bg-white rounded-lg flex flex-col w-[450px] shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="text-[16px] font-medium text-[#555]">Most critical calls</span>
      </div>

      {/* List */}
      <div className="flex flex-col overflow-y-auto px-3 pb-3 gap-1">
        {CRITICAL_CALLS.map((item, i) => {
          const call = CALLS[item.callIndex];
          return (
            <div
              key={i}
              onClick={() => onSelect(call)}
              className="flex items-center gap-3 px-3 py-[10px] rounded-lg hover:bg-[#fafafd] transition-colors cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex items-center justify-center shrink-0 size-[28px] rounded-full bg-[#e0eefe]">
                <User size={13} strokeWidth={1.75} className="text-[#0055a3]" />
              </div>

              {/* Name + time */}
              <div className="flex flex-col min-w-0 shrink-0">
                <span className="text-[12px] font-medium text-[#020817] whitespace-nowrap">{call.provider.name}</span>
                <span className="text-[11px] text-[#616d89] whitespace-nowrap">{item.time}</span>
              </div>

              <div className="flex-1" />

              {/* Flag tags */}
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {item.flags.map((flag, j) => (
                  <div key={j} className="flex items-center gap-[4px]">
                    <div className="size-[6px] rounded-full bg-[#ff5f7c] shrink-0" />
                    <span className="text-[10px] font-medium text-[#ff5f7c] whitespace-nowrap">{flag.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Page
───────────────────────────────────────────────── */
/* ── Sort helper ── */
function callSortVal(call, key) {
  switch (key) {
    case 'date':      return (call.date || '') + ' ' + (call.time || '');
    case 'provider':  return call.provider.name;
    case 'patient':   return call.patient;
    case 'checklist': return call.checklist;
    case 'callAdh':   return parseFloat(call.callAdh.value) || 0;
    case 'noteAdh':   return parseFloat(call.noteAdh.value) || 0;
    case 'pace':      return parseFloat(call.pace.value) || 0;
    case 'listen':    return parseFloat(call.listen.value) || 0;
    case 'language':  return parseFloat(call.language.value) || 0;
    case 'duration':  return call.duration.value;
    default:          return '';
  }
}

export default function CallsPage() {
  const [search, setSearch] = useState('');
  const [activePeriod, setActivePeriod] = useState('1M');
  const [selectedCall, setSelectedCall] = useState(null);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = CALLS.filter((c) =>
    c.provider.name.toLowerCase().includes(search.toLowerCase()) ||
    c.patient.toLowerCase().includes(search.toLowerCase()) ||
    c.checklist.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = callSortVal(a, sortKey);
        const bv = callSortVal(b, sortKey);
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const selectedIndex = selectedCall ? sorted.indexOf(selectedCall) : -1;

  const sh = { activeSortKey: sortKey, sortDir, onSort: handleSort };

  // Responsive table
  const ROW_PAD = 20; // px-[10px] on each row = 10 left + 10 right
  const [tableRef, containerW] = useContainerWidth();
  const availableW    = containerW - ROW_PAD;
  const visibleCols   = computeVisibleCols(availableW);
  const checklistW    = getChecklistWidth(availableW, visibleCols);

  return (
    <div className="flex flex-col flex-1 px-10 py-[30px] gap-5">
      {/* Header bar */}
      <div className="flex items-center gap-[10px] w-full">
        <div className="flex items-center pr-5">
          <h1 className="text-2xl font-medium text-[#444] whitespace-nowrap">Calls</h1>
        </div>

        <ChecklistPicker />
        <FilterButton icon={Funnel} label="Status" />
        <ProviderPicker />
        <PatientPicker />

        <div className="flex-1" />

        <DateRangePicker activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search calls"
        />
      </div>

      {/* Chart + Critical calls */}
      <div className="flex gap-3 w-full">
        <AdherenceChart />
        <CriticalCalls onSelect={setSelectedCall} />
      </div>

      {/* Table */}
      <div ref={tableRef} className="rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-[10px] border-b border-[#ebebeb]">
          {visibleCols.has('date')     && <TableColHeader label="Date"           width={COL.date}     align="left" sortKey="date"      {...sh} />}
          {visibleCols.has('provider') && <TableColHeader label="Provider"       width={COL.provider} align="left" sortKey="provider"  {...sh} />}
          {visibleCols.has('patient')  && <TableColHeader label="Patient"        width={COL.patient}  align="left" sortKey="patient"   {...sh} />}
          {visibleCols.has('checklist') && <TableColHeader label="Checklist" width={checklistW} align="left" sortKey="checklist" {...sh} />}
          {visibleCols.has('callAdh')  && <TableColHeader label="Call Adherence" width={COL.callAdh}              sortKey="callAdh"   {...sh} />}
          {visibleCols.has('noteAdh')  && <TableColHeader label="Note Adherence" width={COL.noteAdh}              sortKey="noteAdh"   {...sh} />}
          {visibleCols.has('pace')     && <TableColHeader label="Pace"           width={COL.pace}                 sortKey="pace"      {...sh} />}
          {visibleCols.has('listen')   && <TableColHeader label="Listen"         width={COL.listen}               sortKey="listen"    {...sh} />}
          {visibleCols.has('language') && <TableColHeader label="Language"       width={COL.language}             sortKey="language"  {...sh} />}
          {visibleCols.has('duration') && <TableColHeader label="Duration"       width={COL.duration}             sortKey="duration"  {...sh} />}
        </div>

        {/* Rows */}
        <div>
          {sorted.map((call, i) => (
            <CallRow key={i} call={call} onClick={() => setSelectedCall(call)} visibleCols={visibleCols} checklistWidth={checklistW} />
          ))}
          {sorted.length === 0 && (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#9b9ba7]">
              No calls match your search.
            </div>
          )}
        </div>
      </div>

      {/* Call detail modal */}
      {selectedCall && (
        <CallDetailModal
          call={selectedCall}
          callIndex={Math.max(0, selectedIndex)}
          totalCalls={sorted.length}
          onClose={() => setSelectedCall(null)}
          onNext={() => { const next = sorted[selectedIndex + 1]; if (next) setSelectedCall(next); }}
          onPrev={() => { const prev = sorted[selectedIndex - 1]; if (prev) setSelectedCall(prev); }}
        />
      )}
    </div>
  );
}
