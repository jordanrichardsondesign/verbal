import { useState } from 'react';
import {
  ComposedChart, Scatter, Line, XAxis, YAxis,
  ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';
import { Funnel, User, TrendingUp, ListChecks, ChevronDown } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import ChecklistPicker from './ChecklistPicker';
import ProviderPicker from './ProviderPicker';
import { FilterButton, SearchInput } from './PageControls';
import CallDetailModal from './CallDetailModal';

/* ────────────────────────────────────────────────
   Shared atoms (same visual patterns as TeamPage)
───────────────────────────────────────────────── */
const BADGE_STYLES = {
  green:  'bg-[rgba(52,176,180,0.1)] text-[#44605e]',
  orange: 'bg-[rgba(255,122,0,0.08)] text-[#ff7678]',
  ruby:   'bg-[rgba(255,95,124,0.1)] text-[#ff5f7c]',
};
function Badge({ value, variant }) {
  return (
    <span className={`inline-flex items-center justify-center px-4 py-[7px] rounded-full text-[13px] font-medium whitespace-nowrap ${BADGE_STYLES[variant]}`}>
      {value}
    </span>
  );
}

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

/* ── Custom dot — slightly larger on hover via active state ── */
function ScatterDot(props) {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#3ba7ff"
      fillOpacity={0.75}
      stroke="white"
      strokeWidth={1.5}
      style={{ cursor: 'pointer' }}
    />
  );
}

function AdherenceChart() {
  return (
    <div className="bg-white rounded-lg p-[30px] flex flex-col gap-4 flex-1 min-w-0">
      {/* Dropdown header */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 cursor-pointer">
          <span className="text-[16px] font-medium text-[#555]">Adherence</span>
          <ChevronDown size={14} strokeWidth={1.75} className="text-[#555]" />
        </button>
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
          {/* Shared X axis — numeric day-of-month */}
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

          {/* Y axis for scatter dots (dataKey="y" required for Scatter positioning) */}
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

          {/* Hidden Y axis for trend line — same scale, no labels */}
          <YAxis
            yAxisId="trend"
            type="number"
            domain={[0, 105]}
            hide
          />

          <ReferenceLine yAxisId="scatter" y={80} stroke="#e8e8ec" strokeDasharray="4 3" />

          <Tooltip content={<ScatterTooltip />} cursor={false} />

          {/* One dot per call */}
          <Scatter
            xAxisId="main"
            yAxisId="scatter"
            data={SCATTER_DATA}
            shape={<ScatterDot />}
            isAnimationActive={false}
          />

          {/* Upward trend line */}
          <Line
            xAxisId="main"
            yAxisId="trend"
            data={TREND_DATA}
            dataKey="trend"
            type="monotone"
            stroke="#3ba7ff"
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
  { name: 'Lisa Wong',         time: 'Today, 11:30 AM',    flags: [{ label: 'Pace: 110 WPM' }, { label: 'Adherence: 0%' }] },
  { name: 'Sarah Lee',         time: 'Today, 10:00 AM',    flags: [{ label: 'Pace: 122 WPM' }, { label: 'Adherence: 0%' }] },
  { name: 'Emily Johnson',     time: 'Today, 9:30 AM',     flags: [{ label: 'Adherence: 0%' }] },
  { name: 'David Kim',         time: 'Yesterday, 1:45 PM', flags: [{ label: 'Pace: 107 WPM' }] },
  { name: 'Michael Smith',     time: 'Yesterday, 2:15 PM', flags: [{ label: 'Listen: 32%' }, { label: 'Adherence: 85%' }] },
];

function CriticalCalls() {
  return (
    <div className="bg-white rounded-lg flex flex-col w-[380px] shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="text-[16px] font-medium text-[#555]">Most critical calls</span>
      </div>

      {/* List */}
      <div className="flex flex-col overflow-y-auto px-3 pb-3 gap-1">
        {CRITICAL_CALLS.map((call, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-[10px] rounded-lg hover:bg-[#fafafd] transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className="flex items-center justify-center shrink-0 size-[28px] rounded-full bg-[#e0eefe]">
              <User size={13} strokeWidth={1.75} className="text-[#0055a3]" />
            </div>

            {/* Name + time */}
            <div className="flex flex-col min-w-0 shrink-0">
              <span className="text-[12px] font-medium text-[#020817] whitespace-nowrap">{call.name}</span>
              <span className="text-[11px] text-[#616d89] whitespace-nowrap">{call.time}</span>
            </div>

            <div className="flex-1" />

            {/* Flag tags */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {call.flags.map((flag, j) => (
                <div key={j} className="flex items-center gap-[4px]">
                  <div className="size-[6px] rounded-full bg-[#ff5f7c] shrink-0" />
                  <span className="text-[10px] font-medium text-[#ff5f7c] whitespace-nowrap">{flag.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Calls table
───────────────────────────────────────────────── */
const COL = {
  date:      90,
  provider:  220,
  patient:   150,
  checklist: 250,
  callAdh:   100,
  noteAdh:   120,
  pace:      100,
  listen:    100,
  language:  100,
  duration:  100,
};

const CALLS = [
  {
    date: 'Today', provider: { name: 'Stephanie Jackson', dept: 'Neurology', initials: 'SJ' },
    patient: 'Stephanie Jackson', checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '100%',     variant: 'green' },
    pace:     { value: '135 WPM',  variant: 'green' },
    listen:   { value: '56%',      variant: 'orange' },
    language: { value: '98%',      variant: 'green' },
    duration: { value: '01:20:34', variant: 'green' },
  },
  {
    date: 'Today', provider: { name: 'Michael King', dept: 'Cardiology', initials: 'MK' },
    patient: 'Ronald Carter', checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '56%',      variant: 'orange' },
    pace:     { value: '150 WPM',  variant: 'green' },
    listen:   { value: '70%',      variant: 'green' },
    language: { value: '92%',      variant: 'green' },
    duration: { value: '00:48:10', variant: 'green' },
  },
  {
    date: 'Today', provider: { name: 'Laura Hill', dept: 'Pediatrics', initials: 'LH' },
    patient: 'Maria Santos', checklist: 'Nurse Discharge',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '95%',      variant: 'green' },
    pace:     { value: '140 WPM',  variant: 'green' },
    listen:   { value: '80%',      variant: 'green' },
    language: { value: '100%',     variant: 'green' },
    duration: { value: '00:32:55', variant: 'green' },
  },
  {
    date: 'Today', provider: { name: 'Alice Newton', dept: 'Dermatology', initials: 'AN' },
    patient: 'James Wright', checklist: 'HIPAA Compliance',
    callAdh:  { value: '45%',      variant: 'ruby' },
    noteAdh:  { value: '46%',      variant: 'orange' },
    pace:     { value: '160 WPM',  variant: 'green' },
    listen:   { value: '90%',      variant: 'ruby' },
    language: { value: '88%',      variant: 'green' },
    duration: { value: '00:12:04', variant: 'orange' },
  },
  {
    date: 'Yesterday', provider: { name: 'Robert Collins', dept: 'Oncology', initials: 'RC' },
    patient: 'Linda Park', checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '88%',      variant: 'green' },
    pace:     { value: '130 WPM',  variant: 'green' },
    listen:   { value: '65%',      variant: 'green' },
    language: { value: '95%',      variant: 'green' },
    duration: { value: '00:55:22', variant: 'green' },
  },
  {
    date: 'Yesterday', provider: { name: 'Henry James', dept: 'Orthopedics', initials: 'HJ' },
    patient: 'Thomas Rivera', checklist: 'Post-Surgical',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '85%',      variant: 'green' },
    pace:     { value: '125 WPM',  variant: 'green' },
    listen:   { value: '60%',      variant: 'green' },
    language: { value: '97%',      variant: 'green' },
    duration: { value: '01:02:18', variant: 'green' },
  },
  {
    date: 'Yesterday', provider: { name: 'Cynthia Turner', dept: 'Gastroenterology', initials: 'CT' },
    patient: 'Barbara Evans', checklist: 'Nurse Discharge',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '93%',      variant: 'green' },
    pace:     { value: '145 WPM',  variant: 'green' },
    listen:   { value: '75%',      variant: 'green' },
    language: { value: '100%',     variant: 'green' },
    duration: { value: '00:41:33', variant: 'green' },
  },
  {
    date: 'Jun 8', provider: { name: 'James Peterson', dept: 'Endocrinology', initials: 'JP' },
    patient: 'William Chen', checklist: 'HIPAA Compliance',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '90%',      variant: 'green' },
    pace:     { value: '120 WPM',  variant: 'green' },
    listen:   { value: '68%',      variant: 'green' },
    language: { value: '91%',      variant: 'green' },
    duration: { value: '00:28:47', variant: 'green' },
  },
  {
    date: 'Jun 8', provider: { name: 'Emma Matthews', dept: 'Urology', initials: 'EM' },
    patient: 'Patricia Nguyen', checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '98%',      variant: 'green' },
    pace:     { value: '155 WPM',  variant: 'green' },
    listen:   { value: '82%',      variant: 'green' },
    language: { value: '99%',      variant: 'green' },
    duration: { value: '00:37:15', variant: 'green' },
  },
  {
    date: 'Jun 7', provider: { name: 'Thomas White', dept: 'Ophthalmology', initials: 'TW' },
    patient: 'Charles Moore', checklist: 'Post-Surgical',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '87%',      variant: 'green' },
    pace:     { value: '110 WPM',  variant: 'green' },
    listen:   { value: '73%',      variant: 'green' },
    language: { value: '96%',      variant: 'green' },
    duration: { value: '00:51:09', variant: 'green' },
  },
];

function TableColHeader({ label, width, align = 'center' }) {
  return (
    <div
      className={`shrink-0 h-[44px] flex items-center px-[10px] ${align === 'center' ? 'justify-center' : ''} text-[12px] font-medium text-[#777] whitespace-nowrap`}
      style={{ width }}
    >
      {label}
    </div>
  );
}

function CallRow({ call, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center px-[10px] py-[18px] border-b border-[#ebebeb] hover:bg-white transition-colors cursor-pointer">
      {/* Date */}
      <div className="shrink-0 px-[10px]" style={{ width: COL.date }}>
        <span className="text-[13px] text-[#777]">{call.date}</span>
      </div>

      {/* Provider */}
      <div className="shrink-0 flex items-center gap-2 px-[10px]" style={{ width: COL.provider }}>
        <div className="flex items-center justify-center shrink-0 size-[40px] rounded-full bg-[#e0eefe]">
          <span className="text-[16px] font-medium text-[#0055a3] tracking-[-0.18px]">{call.provider.initials}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[#020817] leading-[18px] whitespace-nowrap">{call.provider.name}</span>
          <span className="text-[12px] text-[#777] leading-[18px] whitespace-nowrap">{call.provider.dept}</span>
        </div>
      </div>

      {/* Patient */}
      <div className="shrink-0 px-[10px]" style={{ width: COL.patient }}>
        <span className="text-[12px] text-[#777] whitespace-nowrap">{call.patient}</span>
      </div>

      {/* Checklist */}
      <div className="shrink-0 flex items-center gap-2 px-[10px]" style={{ width: COL.checklist }}>
        <ListChecks size={14} strokeWidth={1.75} className="text-[#9b9ba7] shrink-0" />
        <span className="text-[13px] font-medium text-[#777] truncate">{call.checklist}</span>
      </div>

      {/* Call Adherence */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.callAdh }}>
        <Badge {...call.callAdh} />
      </div>

      {/* Note Adherence */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.noteAdh }}>
        <Badge {...call.noteAdh} />
      </div>

      {/* Pace */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.pace }}>
        <Badge {...call.pace} />
      </div>

      {/* Listen */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.listen }}>
        <Badge {...call.listen} />
      </div>

      {/* Language */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.language }}>
        <Badge {...call.language} />
      </div>

      {/* Duration */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.duration }}>
        <Badge {...call.duration} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Page
───────────────────────────────────────────────── */
export default function CallsPage() {
  const [search, setSearch] = useState('');
  const [activePeriod, setActivePeriod] = useState('1M');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const filtered = CALLS.filter((c) =>
    c.provider.name.toLowerCase().includes(search.toLowerCase()) ||
    c.patient.toLowerCase().includes(search.toLowerCase()) ||
    c.checklist.toLowerCase().includes(search.toLowerCase())
  );

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
        <FilterButton label="By Patient" />

        <div className="flex-1" />

        <DateRangePicker activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search calls"
        />
      </div>

      {/* Chart + Critical calls */}
      <div className="flex gap-5 w-full">
        <AdherenceChart />
        <CriticalCalls />
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-[10px] border-b border-[#ebebeb]">
          <TableColHeader label="Date" width={COL.date} align="left" />
          <TableColHeader label="Provider" width={COL.provider} align="left" />
          <TableColHeader label="Patient" width={COL.patient} align="left" />
          <TableColHeader label="Checklist" width={COL.checklist} align="left" />
          <TableColHeader label="Call Adherence" width={COL.callAdh} />
          <TableColHeader label="Note Adherence" width={COL.noteAdh} />
          <TableColHeader label="Pace" width={COL.pace} />
          <TableColHeader label="Listen" width={COL.listen} />
          <TableColHeader label="Language" width={COL.language} />
          <TableColHeader label="Duration" width={COL.duration} />
        </div>

        {/* Rows */}
        <div>
          {filtered.map((call, i) => (
            <CallRow key={i} call={call} onClick={() => setSelectedIndex(i)} />
          ))}
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#9b9ba7]">
              No calls match your search.
            </div>
          )}
        </div>
      </div>

      {/* Call detail modal */}
      {selectedIndex !== null && (
        <CallDetailModal
          call={filtered[selectedIndex]}
          callIndex={selectedIndex}
          totalCalls={filtered.length}
          onClose={() => setSelectedIndex(null)}
          onNext={() => setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))}
          onPrev={() => setSelectedIndex((i) => Math.max(i - 1, 0))}
        />
      )}
    </div>
  );
}
