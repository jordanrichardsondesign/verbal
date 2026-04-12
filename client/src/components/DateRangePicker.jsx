import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Period helpers
───────────────────────────────────────────────────────────── */
export const PERIODS = ['1W', '2W', '1M', '3M'];

function periodToRange(period) {
  const end = new Date();
  const start = new Date();
  if (period === '1W')  start.setDate(end.getDate() - 7);
  if (period === '2W')  start.setDate(end.getDate() - 14);
  if (period === '1M')  start.setMonth(end.getMonth() - 1);
  if (period === '3M')  start.setMonth(end.getMonth() - 3);
  return { start, end };
}

function fmtDate(d, showMonth = true) {
  return d.toLocaleDateString('en-US', showMonth ? { month: 'short', day: 'numeric' } : { day: 'numeric' });
}

export function getDateRange(period) {
  const { start, end } = periodToRange(period);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  return `${fmtDate(start)} – ${fmtDate(end, !sameMonth)}`;
}

function fmtCustomRange(start, end) {
  if (!start) return 'Select range';
  if (!end) return `${fmtDate(start)} – ...`;
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  return `${fmtDate(start)} – ${fmtDate(end, !sameMonth)}`;
}

/* ─────────────────────────────────────────────────────────────
   Calendar grid helpers
───────────────────────────────────────────────────────────── */
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function startOfDay(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(d, a, b) {
  if (!a || !b) return false;
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return d > lo && d < hi;
}

/** Returns array of Date objects (including leading/trailing blanks as null) for a month grid */
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/* ─────────────────────────────────────────────────────────────
   Single-month calendar panel
───────────────────────────────────────────────────────────── */
function MonthPanel({ year, month, rangeStart, rangeEnd, hoverDate, onDayClick, onDayHover, hideLeft, hideRight, onPrev, onNext }) {
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const grid = buildMonthGrid(year, month);
  const today = startOfDay(new Date());

  // Effective end for highlighting (use hover if no end picked yet)
  const effectiveEnd = rangeStart && !rangeEnd ? hoverDate : rangeEnd;
  const [lo, hi] = rangeStart && effectiveEnd
    ? (rangeStart <= effectiveEnd ? [startOfDay(rangeStart), startOfDay(effectiveEnd)] : [startOfDay(effectiveEnd), startOfDay(rangeStart)])
    : [null, null];

  return (
    <div className="flex flex-col gap-3 w-[200px]">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          className={`p-1 rounded-md hover:bg-[#f0f0f3] transition-colors cursor-pointer ${hideLeft ? 'invisible' : ''}`}
        >
          <ChevronLeft size={14} strokeWidth={2} className="text-[#555]" />
        </button>
        <span className="text-[13px] font-semibold text-[#333]">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={onNext}
          className={`p-1 rounded-md hover:bg-[#f0f0f3] transition-colors cursor-pointer ${hideRight ? 'invisible' : ''}`}
        >
          <ChevronRight size={14} strokeWidth={2} className="text-[#555]" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map(d => (
          <div key={d} className="flex items-center justify-center h-6">
            <span className="text-[10px] font-medium text-[#9b9ba7]">{d}</span>
          </div>
        ))}

        {/* Day cells */}
        {grid.map((day, i) => {
          if (!day) return <div key={i} />;
          const s = startOfDay(day);
          const isStart   = isSameDay(s, lo);
          const isEnd     = isSameDay(s, hi);
          const inRange   = lo && hi && s > lo && s < hi;
          const isToday   = isSameDay(s, today);
          const isSelected = isStart || isEnd;

          return (
            <div
              key={i}
              className={`relative flex items-center justify-center h-7 cursor-pointer select-none
                ${inRange ? 'bg-[rgba(52,176,180,0.08)]' : ''}
                ${isStart && hi && !isSameDay(lo, hi) ? 'rounded-l-full' : ''}
                ${isEnd   && lo && !isSameDay(lo, hi) ? 'rounded-r-full' : ''}
              `}
              onClick={() => onDayClick(day)}
              onMouseEnter={() => onDayHover(day)}
            >
              <span className={`flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-medium transition-colors
                ${isSelected
                  ? 'bg-[#34b0b4] text-white'
                  : isToday
                  ? 'text-[#34b0b4] font-semibold hover:bg-[rgba(52,176,180,0.12)]'
                  : 'text-[#444] hover:bg-[rgba(52,176,180,0.12)]'
                }
              `}>
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Calendar popover content
───────────────────────────────────────────────────────────── */
function CalendarPopover({ rangeStart, rangeEnd, onApply, onClose }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() === 0 ? 0 : today.getMonth() - 1);
  const [selStart,  setSelStart]  = useState(rangeStart || null);
  const [selEnd,    setSelEnd]    = useState(rangeEnd   || null);
  const [hover,     setHover]     = useState(null);

  // Right panel is always one month ahead
  const rightMonth = viewMonth === 11 ? 0  : viewMonth + 1;
  const rightYear  = viewMonth === 11 ? viewYear + 1 : viewYear;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(day) {
    if (!selStart || (selStart && selEnd)) {
      // Start fresh
      setSelStart(startOfDay(day));
      setSelEnd(null);
    } else {
      // Second click — set end (swap if needed)
      const s = startOfDay(selStart);
      const e = startOfDay(day);
      if (e < s) { setSelStart(e); setSelEnd(s); }
      else        { setSelEnd(e); }
    }
  }

  return (
    <div className="flex flex-col gap-4 bg-white rounded-[14px] border border-[#e8e8ec] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] p-5">
      {/* Two-month grid */}
      <div className="flex items-start gap-6">
        <MonthPanel
          year={viewYear} month={viewMonth}
          rangeStart={selStart} rangeEnd={selEnd} hoverDate={hover ? startOfDay(hover) : null}
          onDayClick={handleDayClick} onDayHover={d => selStart && !selEnd && setHover(d)}
          hideLeft={false} hideRight={true}
          onPrev={prevMonth} onNext={nextMonth}
        />
        <div className="w-px self-stretch bg-[#f0f0f3]" />
        <MonthPanel
          year={rightYear} month={rightMonth}
          rangeStart={selStart} rangeEnd={selEnd} hoverDate={hover ? startOfDay(hover) : null}
          onDayClick={handleDayClick} onDayHover={d => selStart && !selEnd && setHover(d)}
          hideLeft={true} hideRight={false}
          onPrev={prevMonth} onNext={nextMonth}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[#f0f0f3]">
        <span className="text-[12px] text-[#9b9ba7]">
          {selStart && selEnd
            ? fmtCustomRange(selStart, selEnd)
            : selStart
            ? 'Select end date'
            : 'Select start date'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-[6px] text-[12px] font-medium text-[#555] hover:bg-[#f0f0f3] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => selStart && selEnd && onApply(selStart, selEnd)}
            disabled={!selStart || !selEnd}
            className="px-3 py-1.5 rounded-[6px] text-[12px] font-medium bg-[#34b0b4] text-white hover:bg-[#2d9a9e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main DateRangePicker
───────────────────────────────────────────────────────────── */
export default function DateRangePicker({ activePeriod, setActivePeriod }) {
  const [calOpen,     setCalOpen]     = useState(false);
  const [customStart, setCustomStart] = useState(null);
  const [customEnd,   setCustomEnd]   = useState(null);

  const hasCustom = customStart && customEnd;
  const dateLabel = hasCustom
    ? fmtCustomRange(customStart, customEnd)
    : getDateRange(activePeriod);

  function handleApply(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
    setCalOpen(false);
    // Don't touch activePeriod — consumers may rely on it being a valid string
  }

  function handlePeriod(p) {
    setActivePeriod(p);
    // Clearing custom range returns control to the period tabs
    setCustomStart(null);
    setCustomEnd(null);
  }

  return (
    <div className="flex items-center gap-[6px] px-[13px] py-[5px] rounded-[8px] border border-light-stroke bg-white">

      {/* Calendar trigger */}
      <Popover.Root open={calOpen} onOpenChange={setCalOpen}>
        <Popover.Trigger asChild>
          <button className={`flex items-center gap-[6px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
            calOpen || hasCustom ? 'bg-[rgba(52,176,180,0.08)]' : 'hover:bg-gray-50'
          }`}>
            <Calendar size={14} strokeWidth={1.75} className={hasCustom ? 'text-[#34b0b4]' : 'text-[#555]'} />
            <span className={`text-[12px] font-medium whitespace-nowrap ${hasCustom ? 'text-[#34b0b4]' : 'text-[#555]'}`}>
              {dateLabel}
            </span>
            <ChevronDown
              size={12} strokeWidth={1.75}
              className={`transition-transform duration-200 ${calOpen ? 'rotate-180' : ''} ${hasCustom ? 'text-[#34b0b4]' : 'text-[#555]'}`}
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={8}
            className="z-[100] outline-none"
            onOpenAutoFocus={e => e.preventDefault()}
            onMouseLeave={() => {}}
          >
            <CalendarPopover
              rangeStart={customStart}
              rangeEnd={customEnd}
              onApply={handleApply}
              onClose={() => setCalOpen(false)}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Vertical divider + period tabs */}
      <div className="flex items-center pl-[8px] border-l border-light-stroke gap-[2px]">
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => handlePeriod(p)}
            className={`px-[8px] py-[6px] rounded-[6px] text-[12px] whitespace-nowrap transition-colors cursor-pointer ${
              !hasCustom && activePeriod === p
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
