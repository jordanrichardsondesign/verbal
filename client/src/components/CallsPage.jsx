import { useState, useRef, useEffect } from 'react';
import {
  ComposedChart, Scatter, Line, XAxis, YAxis,
  ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';
import { Funnel, User, TrendingUp, TrendingDown, ChevronDown, Check } from 'lucide-react';
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

/* ── Per-metric scatter + trend data ── */

const NOTE_SCATTER = [
  { x: 1,  y: 62, provider: 'Stephanie Jackson', initials: 'SJ', duration: '01:20:34' },
  { x: 1,  y: 71, provider: 'Michael King',       initials: 'MK', duration: '00:48:10' },
  { x: 2,  y: 85, provider: 'Laura Hill',         initials: 'LH', duration: '00:32:55' },
  { x: 3,  y: 58, provider: 'Alice Newton',       initials: 'AN', duration: '00:12:04' },
  { x: 3,  y: 78, provider: 'Robert Collins',     initials: 'RC', duration: '00:55:22' },
  { x: 4,  y: 90, provider: 'Henry James',        initials: 'HJ', duration: '01:02:18' },
  { x: 5,  y: 52, provider: 'Cynthia Turner',     initials: 'CT', duration: '00:41:33' },
  { x: 5,  y: 75, provider: 'James Peterson',     initials: 'JP', duration: '00:28:47' },
  { x: 6,  y: 68, provider: 'Emma Matthews',      initials: 'EM', duration: '00:37:15' },
  { x: 7,  y: 55, provider: 'Thomas White',       initials: 'TW', duration: '00:51:09' },
  { x: 8,  y: 88, provider: 'Stephanie Jackson',  initials: 'SJ', duration: '00:44:20' },
  { x: 9,  y: 72, provider: 'Michael King',       initials: 'MK', duration: '00:19:38' },
  { x: 9,  y: 60, provider: 'Alice Newton',       initials: 'AN', duration: '00:22:51' },
  { x: 11, y: 82, provider: 'Laura Hill',         initials: 'LH', duration: '00:38:12' },
  { x: 12, y: 77, provider: 'Robert Collins',     initials: 'RC', duration: '00:59:44' },
  { x: 13, y: 91, provider: 'Henry James',        initials: 'HJ', duration: '00:46:05' },
  { x: 13, y: 48, provider: 'Cynthia Turner',     initials: 'CT', duration: '00:15:30' },
  { x: 14, y: 80, provider: 'James Peterson',     initials: 'JP', duration: '00:33:18' },
  { x: 15, y: 73, provider: 'Emma Matthews',      initials: 'EM', duration: '00:52:47' },
  { x: 17, y: 86, provider: 'Thomas White',       initials: 'TW', duration: '00:29:55' },
  { x: 18, y: 92, provider: 'Stephanie Jackson',  initials: 'SJ', duration: '00:41:10' },
  { x: 19, y: 69, provider: 'Michael King',       initials: 'MK', duration: '00:24:33' },
  { x: 20, y: 84, provider: 'Laura Hill',         initials: 'LH', duration: '00:36:08' },
  { x: 21, y: 79, provider: 'Robert Collins',     initials: 'RC', duration: '01:04:22' },
  { x: 22, y: 88, provider: 'Henry James',        initials: 'HJ', duration: '00:49:17' },
  { x: 23, y: 76, provider: 'James Peterson',     initials: 'JP', duration: '00:31:44' },
  { x: 24, y: 93, provider: 'Emma Matthews',      initials: 'EM', duration: '00:58:30' },
  { x: 25, y: 88, provider: 'Stephanie Jackson',  initials: 'SJ', duration: '00:43:55' },
];
const NOTE_TREND = [
  { x: 1, trend: 68 }, { x: 5, trend: 70 }, { x: 9, trend: 72 },
  { x: 13, trend: 74 }, { x: 17, trend: 75 }, { x: 21, trend: 76 }, { x: 25, trend: 76 },
];

const PACE_SCATTER = [
  { x: 1,  y: 155, provider: 'Stephanie Jackson', initials: 'SJ', duration: '01:20:34' },
  { x: 1,  y: 138, provider: 'Michael King',      initials: 'MK', duration: '00:48:10' },
  { x: 2,  y: 128, provider: 'Laura Hill',        initials: 'LH', duration: '00:32:55' },
  { x: 3,  y: 162, provider: 'Alice Newton',      initials: 'AN', duration: '00:12:04' },
  { x: 3,  y: 118, provider: 'Robert Collins',    initials: 'RC', duration: '00:55:22' },
  { x: 4,  y: 145, provider: 'Henry James',       initials: 'HJ', duration: '01:02:18' },
  { x: 5,  y: 158, provider: 'Cynthia Turner',    initials: 'CT', duration: '00:41:33' },
  { x: 5,  y: 132, provider: 'James Peterson',    initials: 'JP', duration: '00:28:47' },
  { x: 6,  y: 143, provider: 'Emma Matthews',     initials: 'EM', duration: '00:37:15' },
  { x: 7,  y: 151, provider: 'Thomas White',      initials: 'TW', duration: '00:51:09' },
  { x: 8,  y: 122, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:44:20' },
  { x: 9,  y: 148, provider: 'Michael King',      initials: 'MK', duration: '00:19:38' },
  { x: 9,  y: 165, provider: 'Alice Newton',      initials: 'AN', duration: '00:22:51' },
  { x: 11, y: 135, provider: 'Laura Hill',        initials: 'LH', duration: '00:38:12' },
  { x: 12, y: 142, provider: 'Robert Collins',    initials: 'RC', duration: '00:59:44' },
  { x: 13, y: 129, provider: 'Henry James',       initials: 'HJ', duration: '00:46:05' },
  { x: 13, y: 156, provider: 'Cynthia Turner',    initials: 'CT', duration: '00:15:30' },
  { x: 14, y: 138, provider: 'James Peterson',    initials: 'JP', duration: '00:33:18' },
  { x: 15, y: 144, provider: 'Emma Matthews',     initials: 'EM', duration: '00:52:47' },
  { x: 17, y: 133, provider: 'Thomas White',      initials: 'TW', duration: '00:29:55' },
  { x: 18, y: 141, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:41:10' },
  { x: 19, y: 136, provider: 'Michael King',      initials: 'MK', duration: '00:24:33' },
  { x: 20, y: 127, provider: 'Laura Hill',        initials: 'LH', duration: '00:36:08' },
  { x: 21, y: 145, provider: 'Robert Collins',    initials: 'RC', duration: '01:04:22' },
  { x: 22, y: 139, provider: 'Henry James',       initials: 'HJ', duration: '00:49:17' },
  { x: 23, y: 142, provider: 'James Peterson',    initials: 'JP', duration: '00:31:44' },
  { x: 24, y: 131, provider: 'Emma Matthews',     initials: 'EM', duration: '00:58:30' },
  { x: 25, y: 138, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:43:55' },
];
const PACE_TREND = [
  { x: 1, trend: 148 }, { x: 5, trend: 147 }, { x: 9, trend: 145 },
  { x: 13, trend: 144 }, { x: 17, trend: 143 }, { x: 21, trend: 142 }, { x: 25, trend: 142 },
];

const LISTEN_SCATTER = [
  { x: 1,  y: 44, provider: 'Stephanie Jackson', initials: 'SJ', duration: '01:20:34' },
  { x: 1,  y: 38, provider: 'Michael King',      initials: 'MK', duration: '00:48:10' },
  { x: 2,  y: 52, provider: 'Laura Hill',        initials: 'LH', duration: '00:32:55' },
  { x: 3,  y: 33, provider: 'Alice Newton',      initials: 'AN', duration: '00:12:04' },
  { x: 3,  y: 61, provider: 'Robert Collins',    initials: 'RC', duration: '00:55:22' },
  { x: 4,  y: 47, provider: 'Henry James',       initials: 'HJ', duration: '01:02:18' },
  { x: 5,  y: 36, provider: 'Cynthia Turner',    initials: 'CT', duration: '00:41:33' },
  { x: 5,  y: 55, provider: 'James Peterson',    initials: 'JP', duration: '00:28:47' },
  { x: 6,  y: 48, provider: 'Emma Matthews',     initials: 'EM', duration: '00:37:15' },
  { x: 7,  y: 42, provider: 'Thomas White',      initials: 'TW', duration: '00:51:09' },
  { x: 8,  y: 58, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:44:20' },
  { x: 9,  y: 40, provider: 'Michael King',      initials: 'MK', duration: '00:19:38' },
  { x: 9,  y: 31, provider: 'Alice Newton',      initials: 'AN', duration: '00:22:51' },
  { x: 11, y: 53, provider: 'Laura Hill',        initials: 'LH', duration: '00:38:12' },
  { x: 12, y: 46, provider: 'Robert Collins',    initials: 'RC', duration: '00:59:44' },
  { x: 13, y: 62, provider: 'Henry James',       initials: 'HJ', duration: '00:46:05' },
  { x: 13, y: 35, provider: 'Cynthia Turner',    initials: 'CT', duration: '00:15:30' },
  { x: 14, y: 50, provider: 'James Peterson',    initials: 'JP', duration: '00:33:18' },
  { x: 15, y: 44, provider: 'Emma Matthews',     initials: 'EM', duration: '00:52:47' },
  { x: 17, y: 57, provider: 'Thomas White',      initials: 'TW', duration: '00:29:55' },
  { x: 18, y: 49, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:41:10' },
  { x: 19, y: 43, provider: 'Michael King',      initials: 'MK', duration: '00:24:33' },
  { x: 20, y: 56, provider: 'Laura Hill',        initials: 'LH', duration: '00:36:08' },
  { x: 21, y: 51, provider: 'Robert Collins',    initials: 'RC', duration: '01:04:22' },
  { x: 22, y: 48, provider: 'Henry James',       initials: 'HJ', duration: '00:49:17' },
  { x: 23, y: 54, provider: 'James Peterson',    initials: 'JP', duration: '00:31:44' },
  { x: 24, y: 60, provider: 'Emma Matthews',     initials: 'EM', duration: '00:58:30' },
  { x: 25, y: 52, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:43:55' },
];
const LISTEN_TREND = [
  { x: 1, trend: 42 }, { x: 5, trend: 44 }, { x: 9, trend: 45 },
  { x: 13, trend: 46 }, { x: 17, trend: 47 }, { x: 21, trend: 48 }, { x: 25, trend: 48 },
];

const LANG_SCATTER = [
  { x: 1,  y: 88, provider: 'Stephanie Jackson', initials: 'SJ', duration: '01:20:34' },
  { x: 1,  y: 82, provider: 'Michael King',      initials: 'MK', duration: '00:48:10' },
  { x: 2,  y: 94, provider: 'Laura Hill',        initials: 'LH', duration: '00:32:55' },
  { x: 3,  y: 78, provider: 'Alice Newton',      initials: 'AN', duration: '00:12:04' },
  { x: 3,  y: 97, provider: 'Robert Collins',    initials: 'RC', duration: '00:55:22' },
  { x: 4,  y: 91, provider: 'Henry James',       initials: 'HJ', duration: '01:02:18' },
  { x: 5,  y: 76, provider: 'Cynthia Turner',    initials: 'CT', duration: '00:41:33' },
  { x: 5,  y: 95, provider: 'James Peterson',    initials: 'JP', duration: '00:28:47' },
  { x: 6,  y: 89, provider: 'Emma Matthews',     initials: 'EM', duration: '00:37:15' },
  { x: 7,  y: 83, provider: 'Thomas White',      initials: 'TW', duration: '00:51:09' },
  { x: 8,  y: 98, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:44:20' },
  { x: 9,  y: 87, provider: 'Michael King',      initials: 'MK', duration: '00:19:38' },
  { x: 9,  y: 79, provider: 'Alice Newton',      initials: 'AN', duration: '00:22:51' },
  { x: 11, y: 93, provider: 'Laura Hill',        initials: 'LH', duration: '00:38:12' },
  { x: 12, y: 90, provider: 'Robert Collins',    initials: 'RC', duration: '00:59:44' },
  { x: 13, y: 96, provider: 'Henry James',       initials: 'HJ', duration: '00:46:05' },
  { x: 13, y: 77, provider: 'Cynthia Turner',    initials: 'CT', duration: '00:15:30' },
  { x: 14, y: 99, provider: 'James Peterson',    initials: 'JP', duration: '00:33:18' },
  { x: 15, y: 92, provider: 'Emma Matthews',     initials: 'EM', duration: '00:52:47' },
  { x: 17, y: 86, provider: 'Thomas White',      initials: 'TW', duration: '00:29:55' },
  { x: 18, y: 95, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:41:10' },
  { x: 19, y: 88, provider: 'Michael King',      initials: 'MK', duration: '00:24:33' },
  { x: 20, y: 97, provider: 'Laura Hill',        initials: 'LH', duration: '00:36:08' },
  { x: 21, y: 93, provider: 'Robert Collins',    initials: 'RC', duration: '01:04:22' },
  { x: 22, y: 91, provider: 'Henry James',       initials: 'HJ', duration: '00:49:17' },
  { x: 23, y: 98, provider: 'James Peterson',    initials: 'JP', duration: '00:31:44' },
  { x: 24, y: 94, provider: 'Emma Matthews',     initials: 'EM', duration: '00:58:30' },
  { x: 25, y: 99, provider: 'Stephanie Jackson', initials: 'SJ', duration: '00:43:55' },
];
const LANG_TREND = [
  { x: 1, trend: 87 }, { x: 5, trend: 88 }, { x: 9, trend: 89 },
  { x: 13, trend: 90 }, { x: 17, trend: 90 }, { x: 21, trend: 91 }, { x: 25, trend: 91 },
];

/* ── Per-metric stats + chart config ── */
const METRIC_DATA = {
  callAdh: {
    scatter: SCATTER_DATA, trend: TREND_DATA,
    score: '88%', good: true,
    trendDir: 'up', trendAmt: '12%',
    startVariance: '74%', endVariance: '32%',
    refLine: 80, yDomain: [0, 105], yTicks: [25, 50, 75, 100],
    yFmt: v => `${v}%`, tipLabel: 'Call Adh.',
  },
  noteAdh: {
    scatter: NOTE_SCATTER, trend: NOTE_TREND,
    score: '76%', good: false,
    trendDir: 'up', trendAmt: '8%',
    startVariance: '68%', endVariance: '41%',
    refLine: 80, yDomain: [0, 105], yTicks: [25, 50, 75, 100],
    yFmt: v => `${v}%`, tipLabel: 'Note Adh.',
  },
  pace: {
    scatter: PACE_SCATTER, trend: PACE_TREND,
    score: '142 WPM', good: true,
    trendDir: 'down', trendAmt: '3 WPM',
    startVariance: '28 WPM', endVariance: '11 WPM',
    refLine: 150, yDomain: [90, 175], yTicks: [100, 120, 140, 160],
    yFmt: v => `${v}`, tipLabel: 'Pace',
  },
  listen: {
    scatter: LISTEN_SCATTER, trend: LISTEN_TREND,
    score: '48%', good: false,
    trendDir: 'up', trendAmt: '6%',
    startVariance: '42%', endVariance: '24%',
    refLine: 50, yDomain: [0, 80], yTicks: [20, 40, 60, 80],
    yFmt: v => `${v}%`, tipLabel: 'Listen Ratio',
  },
  language: {
    scatter: LANG_SCATTER, trend: LANG_TREND,
    score: '91%', good: true,
    trendDir: 'up', trendAmt: '4%',
    startVariance: '87%', endVariance: '15%',
    refLine: 85, yDomain: [50, 105], yTicks: [60, 70, 80, 90, 100],
    yFmt: v => `${v}%`, tipLabel: 'Language',
  },
};

/* ── Custom hover tooltip ── */
function ScatterTooltip({ active, payload, tipLabel = 'Value', yFmt = v => `${v}%` }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d?.provider) return null;
  return (
    <div className="bg-white border border-[#ebebeb] rounded-[10px] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] px-[14px] py-[12px] flex flex-col gap-[8px] min-w-[180px]">
      <div className="flex items-center gap-[8px]">
        <div className="shrink-0 flex items-center justify-center size-[26px] rounded-full bg-[#e0eefe]">
          <span className="text-[10px] font-medium text-[#0055a3]">{d.initials}</span>
        </div>
        <span className="text-[12px] font-medium text-[#444]">{d.provider}</span>
      </div>
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[11px] text-[#888]">{tipLabel}</span>
          <span className="text-[11px] font-semibold text-[#444]">{yFmt(d.y)}</span>
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

  const data = METRIC_DATA[metric.key];

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
          <span className="text-[34px] font-medium text-[#555] leading-none">{data.score}</span>
          <span className="text-[18px] leading-none pb-0.5">{data.good ? '👍' : '👎'}</span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            {data.trendDir === 'up'
              ? <TrendingUp  size={11} strokeWidth={2} className="text-[#555]" />
              : <TrendingDown size={11} strokeWidth={2} className="text-[#555]" />}
            <span className="text-[10px] font-medium text-[#555]">
              {data.trendDir === 'up' ? 'Up' : 'Down'} {data.trendAmt}
            </span>
            <span className="text-[10px] font-medium text-[#555]">this month</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-[10px] font-medium text-[#888]">Starting variance: <span className="text-[#555]">{data.startVariance}</span></span>
            <span className="text-[10px] font-medium text-[#888]">Ending variance: <span className="text-[#555]">{data.endVariance}</span></span>
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
            domain={data.yDomain}
            ticks={data.yTicks}
            tickFormatter={data.yFmt}
            tick={{ fontSize: 11, fill: '#888', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <YAxis yAxisId="trend" type="number" domain={data.yDomain} hide />

          <ReferenceLine yAxisId="scatter" y={data.refLine} stroke="#e8e8ec" strokeDasharray="4 3" />
          <Tooltip
            content={(props) => <ScatterTooltip {...props} tipLabel={data.tipLabel} yFmt={data.yFmt} />}
            cursor={false}
          />

          <Scatter
            xAxisId="main"
            yAxisId="scatter"
            data={data.scatter}
            shape={(props) => <ScatterDot {...props} color={metric.color} />}
            isAnimationActive={false}
          />
          <Line
            xAxisId="main"
            yAxisId="trend"
            data={data.trend}
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
      <div className="flex items-center gap-[6px] w-full">
        <div className="flex items-center pr-5">
          <h1 className="text-2xl font-medium text-[#444] whitespace-nowrap">Calls</h1>
        </div>

        <ChecklistPicker />
        <FilterButton label="Status" />
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
