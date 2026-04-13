import { useLayoutEffect, useRef, useState } from 'react';
import { ListChecks, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/* ── Column widths ── */
export const COL = {
  date:      90,
  provider:  220,
  patient:   150,
  checklist: 250, // fallback only; actual width is computed dynamically
  callAdh:   100,
  noteAdh:   120,
  pace:      100,
  listen:    100,
  language:  100,
  duration:  100,
};

/* ── Responsive column system ── */

// Minimum width of the flexible Checklist column
export const CHECKLIST_MIN_W = 120;

// Priority: lower number = more important = last to drop.
// Drop order (first→last): Language(10) → Listen(9) → Pace(8) → Checklist(7)
//   → Duration(6) → Note Adherence(5) → Patient(4) → Date(3)
//   → Call Adherence(2) → Provider(1)
export const COLUMN_DEFS = [
  { key: 'date',      width: COL.date,     priority: 3  },
  { key: 'provider',  width: COL.provider, priority: 1  },
  { key: 'patient',   width: COL.patient,  priority: 4  },
  { key: 'checklist', width: 0,            priority: 7  }, // flex width; droppable
  { key: 'callAdh',   width: COL.callAdh,  priority: 2  },
  { key: 'noteAdh',   width: COL.noteAdh,  priority: 5  },
  { key: 'pace',      width: COL.pace,     priority: 8  },
  { key: 'listen',    width: COL.listen,   priority: 9  },
  { key: 'language',  width: COL.language, priority: 10 },
  { key: 'duration',  width: COL.duration, priority: 6  },
];

/**
 * Given available pixel width (container minus row padding),
 * returns a Set of column keys that should be rendered.
 * excludeKeys lets a page permanently hide certain columns (e.g. 'provider').
 */
export function computeVisibleCols(availableW, excludeKeys = []) {
  const cols = COLUMN_DEFS.filter(c => !excludeKeys.includes(c.key));
  const visible = new Set(cols.map(c => c.key));

  // Highest priority number drops first
  const droppable = [...cols].sort((a, b) => b.priority - a.priority);

  for (const col of droppable) {
    // Fixed-width cols currently visible
    const fixedSum = cols
      .filter(c => c.key !== 'checklist' && visible.has(c.key))
      .reduce((s, c) => s + c.width, 0);
    const checklistContrib = visible.has('checklist') ? CHECKLIST_MIN_W : 0;
    if (fixedSum + checklistContrib <= availableW) break;
    visible.delete(col.key);
  }

  return visible;
}

/**
 * Returns the pixel width the Checklist column should occupy,
 * filling remaining space after all visible fixed columns.
 * Returns 0 when checklist is not in visibleCols.
 */
export function getChecklistWidth(availableW, visibleCols) {
  if (!visibleCols.has('checklist')) return 0;
  const sum = COLUMN_DEFS
    .filter(c => c.key !== 'checklist' && visibleCols.has(c.key))
    .reduce((s, c) => s + c.width, 0);
  return Math.max(CHECKLIST_MIN_W, availableW - sum);
}

/**
 * Hook — measures the content width of a container element
 * and keeps it updated as the element resizes.
 * Initialises to Infinity so all columns show on first paint.
 */
export function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(Infinity);

  useLayoutEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}

/* ── Pill badge ── */
export const BADGE_STYLES = {
  green:  'bg-[rgba(52,176,180,0.1)] text-[#44605e]',
  orange: 'bg-[rgba(255,122,0,0.08)] text-[#ff7678]',
  ruby:   'bg-[rgba(255,95,124,0.1)] text-[#ff5f7c]',
};

export function Badge({ value, variant }) {
  return (
    <span className={`inline-flex items-center justify-center px-4 py-[7px] rounded-full text-[13px] font-medium whitespace-nowrap ${BADGE_STYLES[variant]}`}>
      {value}
    </span>
  );
}

/* ── Sort icon ── */
function SortIcon({ active, dir }) {
  if (!active) return <ChevronsUpDown size={12} strokeWidth={1.75} className="text-[#bbb] shrink-0" />;
  if (dir === 'asc')  return <ChevronUp   size={12} strokeWidth={2}    className="text-[#555] shrink-0" />;
  return                     <ChevronDown size={12} strokeWidth={2}    className="text-[#555] shrink-0" />;
}

/* ── Table column header ── */
export function TableColHeader({ label, width, align = 'center', sortKey, activeSortKey, sortDir, onSort }) {
  const sortable = !!sortKey && !!onSort;
  const isActive = sortable && activeSortKey === sortKey;

  return (
    <div
      className={`shrink-0 h-[44px] flex items-center gap-[4px] px-[10px] ${align === 'center' ? 'justify-center' : ''} text-[12px] font-medium whitespace-nowrap select-none ${
        sortable
          ? 'cursor-pointer text-[#777] hover:text-[#444] transition-colors'
          : 'text-[#777]'
      } ${isActive ? 'text-[#444]' : ''}`}
      style={{ width }}
      onClick={sortable ? () => onSort(sortKey) : undefined}
    >
      {label}
      {sortable && <SortIcon active={isActive} dir={sortDir} />}
    </div>
  );
}

/* ── Call row ── */
export function CallRow({ call, onClick, visibleCols, checklistWidth = COL.checklist }) {
  const show = (key) => !visibleCols || visibleCols.has(key);

  return (
    <div
      onClick={onClick}
      className="flex items-center px-[10px] py-[18px] border-b border-[#ebebeb] hover:bg-white transition-colors cursor-pointer"
    >
      {/* Date + Time */}
      {show('date') && (
        <div className="shrink-0 flex flex-col px-[10px]" style={{ width: COL.date }}>
          <span className="text-[12px] text-[#777] leading-[17px]">{call.date}</span>
          {call.time && <span className="text-[11px] text-[#aaa] leading-[15px] mt-[1px]">{call.time}</span>}
        </div>
      )}

      {/* Provider */}
      {show('provider') && (
        <div className="shrink-0 flex items-center gap-2 px-[10px]" style={{ width: COL.provider }}>
          <div className="flex items-center justify-center shrink-0 size-[40px] rounded-full bg-[#e0eefe]">
            <span className="text-[16px] font-medium text-[#0055a3] tracking-[-0.18px]">{call.provider.initials}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#020817] leading-[18px] whitespace-nowrap">{call.provider.name}</span>
            <span className="text-[12px] text-[#777] leading-[18px] whitespace-nowrap">{call.provider.dept}</span>
          </div>
        </div>
      )}

      {/* Patient */}
      {show('patient') && (
        <div className="shrink-0 px-[10px]" style={{ width: COL.patient }}>
          <span className="text-[12px] text-[#777] whitespace-nowrap">{call.patient}</span>
        </div>
      )}

      {/* Checklist — flexible width, conditionally shown */}
      {show('checklist') && (
        <div className="shrink-0 flex items-center gap-2 px-[10px] min-w-0" style={{ width: checklistWidth }}>
          <ListChecks size={14} strokeWidth={1.75} className="text-[#9b9ba7] shrink-0" />
          <span className="text-[12px] text-[#777] truncate">{call.checklist}</span>
        </div>
      )}

      {/* Call Adherence */}
      {show('callAdh') && (
        <div className="shrink-0 flex items-center justify-center" style={{ width: COL.callAdh }}>
          <Badge {...call.callAdh} />
        </div>
      )}

      {/* Note Adherence */}
      {show('noteAdh') && (
        <div className="shrink-0 flex items-center justify-center" style={{ width: COL.noteAdh }}>
          <Badge {...call.noteAdh} />
        </div>
      )}

      {/* Pace */}
      {show('pace') && (
        <div className="shrink-0 flex items-center justify-center" style={{ width: COL.pace }}>
          <Badge {...call.pace} />
        </div>
      )}

      {/* Listen */}
      {show('listen') && (
        <div className="shrink-0 flex items-center justify-center" style={{ width: COL.listen }}>
          <Badge {...call.listen} />
        </div>
      )}

      {/* Language */}
      {show('language') && (
        <div className="shrink-0 flex items-center justify-center" style={{ width: COL.language }}>
          <Badge {...call.language} />
        </div>
      )}

      {/* Duration */}
      {show('duration') && (
        <div className="shrink-0 flex items-center justify-center" style={{ width: COL.duration }}>
          <Badge {...call.duration} />
        </div>
      )}
    </div>
  );
}
