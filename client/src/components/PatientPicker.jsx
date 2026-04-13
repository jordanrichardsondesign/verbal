import { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Search, X } from 'lucide-react';

/* ── Patient data (matches CALLS in CallsPage) ── */
const ALL_PATIENTS = [
  'Stephanie Jackson',
  'Ronald Carter',
  'Maria Santos',
  'James Wright',
  'Linda Park',
  'Thomas Rivera',
  'Barbara Evans',
  'William Chen',
  'Patricia Nguyen',
  'Charles Moore',
];

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ── Avatar bubble ── */
function PatientAvatar({ name }) {
  return (
    <div className="shrink-0 flex items-center justify-center size-[28px] rounded-full bg-[#e0eefe]">
      <span className="text-[11px] font-medium text-[#0055a3] tracking-[-0.18px]">{initials(name)}</span>
    </div>
  );
}

/* ── Main component ── */
export default function PatientPicker() {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [displayQuery, setDisplayQuery] = useState('');

  function handleQuery(val) {
    setQuery(val);
    if (val) {
      setLoading(true);
      setTimeout(() => {
        setDisplayQuery(val);
        setLoading(false);
      }, 300);
    } else {
      setDisplayQuery('');
      setLoading(false);
    }
  }

  const filtered = useMemo(() =>
    displayQuery
      ? ALL_PATIENTS.filter((name) =>
          name.toLowerCase().includes(displayQuery.toLowerCase())
        )
      : [],
    [displayQuery]
  );

  function handleSelect(name) {
    setSelected((prev) => (prev === name ? null : name));
    setOpen(false);
    setQuery('');
    setDisplayQuery('');
  }

  return (
    <Popover.Root open={open} onOpenChange={(o) => {
      setOpen(o);
      if (!o) { setQuery(''); setDisplayQuery(''); setLoading(false); }
    }}>
      <Popover.Trigger asChild>
        <button
          className={`flex items-center gap-[6px] h-[42px] px-[14px] rounded-lg border bg-white text-[12px] font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors ${
            selected
              ? 'border-[#618985] text-[#618985]'
              : 'border-[#ebebeb] text-[#555]'
          }`}
        >
          {selected ?? 'By Patient'}
          {selected && (
            <X
              size={13}
              strokeWidth={2}
              className="shrink-0 text-[#618985] hover:text-[#4a6d6a] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(null);
              }}
            />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col w-[313px] bg-white rounded-[9px] border border-[#ebebeb] shadow-[0px_14px_24px_0px_rgba(0,0,0,0.05)] overflow-hidden">

            {/* Search area */}
            <div className="flex flex-col gap-[6px] p-[20px]">
              <span className="text-[12px] font-normal text-[#444]">Search by Patient</span>
              <div className="relative flex items-center">
                <Search size={14} strokeWidth={1.75} className="absolute left-[14px] text-[#bbb] pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => handleQuery(e.target.value)}
                  placeholder=""
                  className="h-[42px] w-full pl-[38px] pr-[14px] rounded-[8px] border-[0.5px] border-[#bbb] text-[14px] font-medium text-[#555] outline-none focus:border-[#34b0b4] transition-colors"
                />
              </div>
            </div>

            {/* Results area — fixed height so panel doesn't jump */}
            <div className="h-[260px] overflow-y-auto px-[20px] pb-[12px]">

              {/* Loading spinner */}
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <svg className="animate-spin size-[16px] text-[#9b9ba7]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {/* Patient list */}
              {!loading && filtered.length > 0 && (
                <div className="flex flex-col gap-[18px] pt-[2px]">
                  {filtered.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleSelect(name)}
                      className={`flex items-center gap-[8px] w-full py-px rounded cursor-pointer hover:opacity-70 transition-opacity text-left ${
                        selected === name ? 'opacity-60' : ''
                      }`}
                    >
                      <PatientAvatar name={name} />
                      <span className="text-[12px] font-medium text-[#777] tracking-[-0.18px]">{name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state — typed but no results */}
              {!loading && displayQuery && filtered.length === 0 && (
                <div className="flex items-center justify-center h-full text-[13px] text-[#9b9ba7]">
                  No patients found
                </div>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
