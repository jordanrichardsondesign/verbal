import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ListChecks, ChevronDown, Check } from 'lucide-react';

/* ── Default checklist data ── */
export const DEFAULT_CHECKLISTS = [
  { id: 1, name: 'Nurse Discharge Call',      meta: '12 items · Primary',        active: true,  orange: false },
  { id: 2, name: 'HIPAA Compliance',           meta: '5 items · Required',         active: true,  orange: false },
  { id: 3, name: 'Post-Surgical Follow-up',    meta: '8 items',                    active: false, orange: false },
  { id: 4, name: 'Medication Reconciliation',  meta: '6 items',                    active: true,  orange: false },
  { id: 5, name: 'Recording Only',             meta: 'No checklist · Flag for review', active: true, orange: true },
];

/* ── Teal checkbox (purely visual — click handled by parent row) ── */
function CheckboxItem({ checked }) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center size-[16px] rounded-[4px] border transition-colors ${
        checked
          ? 'bg-[#618985] border-[#618985]'
          : 'bg-white border-[#c0c0ca]'
      }`}
    >
      {checked && <Check size={10} strokeWidth={3} className="text-white" />}
    </div>
  );
}

/* ── Popover menu ── */
export function ChecklistMenu({ items, onToggle, onSelectAll, single = false }) {
  return (
    <div className="flex flex-col w-[280px] bg-white rounded-[12px] border border-[#e8e8ec] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.10)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-[#f0f0f3]">
        <span className="text-[12px] font-medium text-[#888] tracking-[0.4px] uppercase">
          {single ? 'Select checklist' : 'Apply checklists'}
        </span>
        {!single && (
          <button
            onClick={onSelectAll}
            className="text-[12px] font-medium text-[#618985] cursor-pointer hover:text-[#4a6d6a] transition-colors"
          >
            Select all
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col py-[6px] px-[8px] gap-px">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`flex items-center gap-[10px] w-full px-[8px] py-[8px] rounded-[6px] transition-colors cursor-pointer text-left ${
              single && item.active
                ? 'bg-[#f0fafa] hover:bg-[#e8f6f6]'
                : 'hover:bg-[#f7f7f9]'
            }`}
          >
            {!single && <CheckboxItem checked={item.active} />}
            <div className="flex flex-col gap-px flex-1 min-w-0">
              <span
                className={`text-[13px] font-medium leading-normal truncate ${
                  item.orange
                    ? 'text-[#f76b15]'
                    : single && item.active
                    ? 'text-[#34b0b4]'
                    : 'text-[#1a1a1a]'
                }`}
              >
                {item.name}
              </span>
              <span
                className={`text-[11.5px] leading-normal ${
                  item.orange ? 'text-[#f76b15] opacity-70' : 'text-[#9b9ba7]'
                }`}
              >
                {item.meta}
              </span>
            </div>
            {single && item.active && (
              <Check size={13} strokeWidth={2.5} className="text-[#34b0b4] shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function ChecklistPicker({ single = false }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(DEFAULT_CHECKLISTS);

  const activeCount  = items.filter((i) => i.active).length;
  const totalCount   = items.length;
  const badgeLabel   = `${activeCount} of ${totalCount}`;

  const toggle = (id) => {
    if (single) {
      setItems((prev) => prev.map((i) => ({ ...i, active: i.id === id })));
      setOpen(false);
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    }
  };

  const selectAll = () =>
    setItems((prev) => prev.map((i) => ({ ...i, active: true })));

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-[6px] h-[42px] px-[13px] rounded-lg border border-[#e8e8ec] bg-white whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors">
          <ListChecks size={16} strokeWidth={1.75} className="text-[#555] shrink-0" />
          <span className="text-[12px] font-medium text-[#555]">Checklists</span>
          <span className="flex items-center px-[7px] py-px rounded-[10px] bg-[#ebf4f3] text-[11px] font-semibold text-[#4a6d6a]">
            {badgeLabel}
          </span>
          <ChevronDown
            size={11}
            strokeWidth={2}
            className={`text-[#888] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ChecklistMenu items={items} onToggle={toggle} onSelectAll={selectAll} single={single} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
