import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Popover from '@radix-ui/react-popover';
import {
  ArrowLeft, SkipBack, SkipForward, Link2, Trash2,
  Calendar, Clock, MoreHorizontal, Check, TriangleAlert,
  ChevronDown, Play, RotateCcw, PenLine, Gauge, Ear, Smile, ListChecks,
  CircleCheckBig, CircleX, CircleDashed, X, PanelLeftClose, PanelRightClose,
  ChevronsRight, ChevronsLeft, FilePen, Columns2,
} from 'lucide-react';
import Tooltip from './Tooltip';
import { ChecklistMenu, DEFAULT_CHECKLISTS } from './ChecklistPicker';
import { Badge } from './CallsTable';

/* ────────────────────────────────────────────────
   Shared atoms
───────────────────────────────────────────────── */
function Avatar({ initials, size = 30 }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-full bg-[#e0eefe]"
      style={{ width: size, height: size }}
    >
      <span className="font-medium text-[#0055a3] tracking-[-0.18px]" style={{ fontSize: size * 0.36 }}>
        {initials}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="w-px self-stretch bg-[#f0f0f3] shrink-0" />;
}

/* ────────────────────────────────────────────────
   Resizable panel primitives
───────────────────────────────────────────────── */
const MIN_W      = 300;
const COLLAPSED_W = 36;

function DragHandle({ disabled, ...props }) {
  return (
    <div
      {...props}
      className={`w-[10px] shrink-0 z-10 select-none ${disabled ? 'cursor-default' : 'cursor-col-resize'}`}
    />
  );
}

function CollapsedPanel({ label, onExpand, side }) {
  return (
    <div className="w-[36px] shrink-0 flex flex-col items-center justify-between bg-white rounded-lg py-4">
      <Tooltip label="Expand" side={side === 'right' ? 'left' : 'right'}>
        <button
          onClick={onExpand}
          className="p-1.5 rounded-md hover:bg-[#f0f0f3] cursor-pointer transition-colors"
        >
          {side === 'right'
            ? <ChevronsLeft  size={13} strokeWidth={2} className="text-[#9b9ba7]" />
            : <ChevronsRight size={13} strokeWidth={2} className="text-[#9b9ba7]" />}
        </button>
      </Tooltip>
      <span
        className="text-[11px] font-medium text-[#bbb] select-none"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {label}
      </span>
      <div className="size-[28px]" />
    </div>
  );
}

function StatBlock({ label, icon: Icon, value, variant }) {
  return (
    <div className="flex flex-col gap-[10px] px-4 py-4 min-w-0 flex-1">
      <div className="flex items-center gap-[6px]">
        <Icon size={13} strokeWidth={1.75} className="text-[#888] shrink-0" />
        <span className="text-[11px] font-medium text-[#888] whitespace-nowrap">{label}</span>
      </div>
      <Badge value={value} variant={variant} />
    </div>
  );
}

function AdherencePill({ color, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-[#fafafd] border border-[#ebebeb] rounded-full px-3 py-[5px] shrink-0">
      <div className="h-[4px] w-[20px] rounded-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex items-center gap-1.5 text-[12px] whitespace-nowrap">
        <span className="font-normal text-[#555]">{label}</span>
        <span className="font-bold text-[#555]">{value}</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Checklist panel
───────────────────────────────────────────────── */
const CHECKLIST_ITEMS = [
  { id: 1, label: 'Perform HIPAA Check',               done: false },
  { id: 2, label: 'Review their condition',             done: false },
  { id: 3, label: 'Review discharge instructions',      done: false },
  { id: 4, label: 'Inquire about barriers',             done: false },
  { id: 5, label: 'Medication review',                  done: true,  note: '"can you gather your medications so we can go over them?"' },
  { id: 6, label: 'Review items needed post discharge', done: false },
  { id: 7, label: 'Schedule next follow-up or check-in', done: true, note: '"same time next week work for you?"' },
];

/* ── Small checkbox atom ── */
function CheckItem({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      className={`shrink-0 flex items-center justify-center size-[18px] rounded-[4px] border cursor-pointer transition-colors ${
        checked ? 'bg-[#618985] border-[#618985]' : 'bg-white border-[#444]'
      }`}
    >
      {checked && <Check size={11} strokeWidth={3} className="text-white" />}
    </div>
  );
}

/* ── Styled action card for each checklist item ── */
function ActionCard({ item }) {
  if (item.done) {
    return (
      <div className="flex-1 min-w-0 flex flex-col gap-[6px] bg-[#e7fffd] rounded-[8px] p-[18px]">
        <div className="flex items-start gap-[12px]">
          <CircleCheckBig size={15} strokeWidth={1.75} className="text-[#44605e] shrink-0 mt-px" />
          <span className="flex-1 min-w-0 text-[12px] font-semibold text-[#44605e] leading-normal">
            {item.label}
          </span>
          <MoreHorizontal size={16} strokeWidth={1.75} className="text-[#ccc] shrink-0" />
        </div>
        {item.note && (
          <div className="ml-[25px] bg-[rgba(97,137,133,0.1)] px-[12px] py-[3px]">
            <span className="text-[12px] text-[#555] italic leading-none">{item.note}</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex-1 min-w-0 flex items-start gap-[12px] bg-[rgba(255,95,124,0.1)] rounded-[8px] p-[18px]">
      <CircleX size={14} strokeWidth={1.75} className="text-[#ff5f7c] shrink-0 mt-px" />
      <span className="flex-1 min-w-0 text-[12px] font-semibold text-[#ff5f7c] leading-normal">
        {item.label}
      </span>
      <MoreHorizontal size={16} strokeWidth={1.75} className="text-[#ccc] shrink-0" />
    </div>
  );
}

/* ── Bulk annotation modal (centered overlay) ── */
const ANNOTATION_REASONS = [
  'Patient ended call early',
  'Not appropriate for this call',
  'Patient already covered this',
  'Other',
];
const OTHER_MAX = 100;

function BulkAnnotationModal({ selectedMissedItems, onClose }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected,     setSelected]     = useState(null);
  const [otherText,    setOtherText]     = useState('');

  const isOther   = selected === 'Other';
  const canSave   = selected && (!isOther || otherText.trim().length > 0);
  const remaining = OTHER_MAX - otherText.length;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-[16px] p-[40px] w-[420px] max-h-[80vh] overflow-y-auto shadow-xl flex flex-col gap-[24px]">

        {/* Close */}
        <div className="flex items-center justify-end">
          <button onClick={onClose} className="text-[#aaa] hover:text-[#555] transition-colors cursor-pointer">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Heading */}
        <p className="text-[18px] font-medium text-[#444] text-center leading-normal">
          I didn't do this because…
        </p>

        {/* Selected missed items */}
        <div className="flex flex-col gap-[14px]">
          {selectedMissedItems.map(item => (
            <div key={item.id} className="flex items-center gap-[12px] py-[8px]">
              <CircleX size={14} strokeWidth={1.75} className="text-[#ff5f7c] shrink-0" />
              <span className="text-[12px] font-semibold text-[#ff5f7c] leading-normal">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Reason dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="w-full flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-[20px] py-[14px] cursor-pointer hover:bg-[#f1f5f9] transition-colors"
          >
            <span className={`text-[14px] font-medium ${selected ? 'text-[#333]' : 'text-[#aaa]'}`}>
              {selected ?? 'Select One'}
            </span>
            <ChevronDown
              size={13} strokeWidth={2}
              className={`text-[#888] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg z-10 overflow-hidden">
              {ANNOTATION_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => { setSelected(reason); setDropdownOpen(false); if (reason !== 'Other') setOtherText(''); }}
                  className={`w-full text-left px-[20px] py-[13px] text-[14px] font-medium transition-colors cursor-pointer
                    ${selected === reason
                      ? 'bg-[rgba(52,176,180,0.08)] text-[#34b0b4]'
                      : 'text-[#444] hover:bg-[#f8fafc]'
                    }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* "Other" free-text input */}
        {isOther && (
          <div className="flex flex-col gap-[8px]">
            <textarea
              autoFocus
              maxLength={OTHER_MAX}
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              placeholder="Enter your reason…"
              rows={3}
              className="w-full resize-none bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-[16px] py-[12px] text-[13px] text-[#333] placeholder-[#bbb] outline-none focus:border-[#34b0b4] transition-colors leading-relaxed"
            />
            <span className={`text-[11px] text-right ${remaining <= 10 ? 'text-[#ff5f7c]' : 'text-[#aaa]'}`}>
              {remaining} character{remaining !== 1 ? 's' : ''} remaining
            </span>
          </div>
        )}

        {/* Save */}
        <button
          disabled={!canSave}
          className="w-full flex items-center justify-center h-[54px] bg-[#618985] hover:bg-[#526f6b] active:bg-[#44605e] disabled:opacity-40 disabled:cursor-not-allowed rounded-[8px] text-white text-[14px] font-medium cursor-pointer transition-colors"
        >
          Save
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ── Main checklist panel ── */
function ChecklistPanel({ call, onCollapse }) {
  const completedItems = CHECKLIST_ITEMS.filter(i => i.done);
  const missedItems    = CHECKLIST_ITEMS.filter(i => !i.done);
  const allIds         = CHECKLIST_ITEMS.map(i => i.id);

  const [pickerOpen,     setPickerOpen]     = useState(false);
  const [clItems,        setClItems]        = useState(() => {
    let found = false;
    return DEFAULT_CHECKLISTS.map(i => {
      if (i.active && !found) { found = true; return i; }
      return { ...i, active: false };
    });
  });
  const [selectedIds,    setSelectedIds]    = useState(new Set());
  const [annotationOpen, setAnnotationOpen] = useState(false);

  const activeItem        = clItems.find(i => i.active) || clItems[0];
  const allSelected       = allIds.length > 0 && allIds.every(id => selectedIds.has(id));
  const hasSelectedMissed = missedItems.some(i => selectedIds.has(i.id));

  const handlePickerToggle = (id) => {
    setClItems(prev => prev.map(i => ({ ...i, active: i.id === id })));
    setPickerOpen(false);
  };

  const toggleItem = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const selectAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(allIds));

  const selectGroup = (items) => setSelectedIds(prev => {
    const next = new Set(prev);
    items.forEach(i => next.add(i.id));
    return next;
  });

  const selectedMissedItems = CHECKLIST_ITEMS.filter(i => !i.done && selectedIds.has(i.id));

  return (
    <div className="flex flex-col flex-1 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#f0f0f3]">
        <span className="text-[18px] font-medium text-[#555]">Checklist</span>
        <div className="flex items-center gap-1">
          <Tooltip label="Collapse" side="bottom">
            <button onClick={onCollapse} className="p-1.5 rounded-md hover:bg-[#f0f0f3] cursor-pointer transition-colors">
              <PanelLeftClose size={14} strokeWidth={1.75} className="text-[#9b9ba7]" />
            </button>
          </Tooltip>
          <MoreHorizontal size={16} strokeWidth={1.75} className="text-[#bbb] cursor-pointer" />
        </div>
      </div>

      {/* Checklist selector + adherence badge */}
      <div className="flex items-center gap-[10px] px-5 py-3">
        <Popover.Root open={pickerOpen} onOpenChange={setPickerOpen}>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-[8px] flex-1 min-w-0 px-[14px] py-[10px] rounded-[8px] bg-[#f6fbfb] border border-[#e9f3fb] cursor-pointer hover:bg-[#eef6f6] transition-colors">
              <ListChecks size={14} strokeWidth={1.75} className="text-[#44605e] shrink-0" />
              <span className="text-[13px] font-medium text-[#44605e] flex-1 min-w-0 truncate text-left">
                {activeItem?.name ?? call.checklist}
              </span>
              <ChevronDown size={11} strokeWidth={2} className={`text-[#44605e] shrink-0 transition-transform duration-200 ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="start" sideOffset={6} className="z-[250] outline-none" onOpenAutoFocus={e => e.preventDefault()}>
              <ChecklistMenu items={clItems} onToggle={handlePickerToggle} single />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <span className="shrink-0 text-[13px] font-medium text-[#44605e] bg-[rgba(52,176,180,0.1)] px-[14px] py-[7px] rounded-[30px] whitespace-nowrap">
          {call.callAdh.value}
        </span>
      </div>

      {/* Summary stats + Select All */}
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <Check size={13} strokeWidth={2.5} className="text-[#34b0b4] shrink-0" />
            <span className="text-[11px] font-medium text-[#888]">{completedItems.length}/{CHECKLIST_ITEMS.length} completed</span>
            <button onClick={() => selectGroup(completedItems)} className="text-[11px] font-medium text-[#888] underline cursor-pointer">Select</button>
          </div>
          <div className="flex items-center gap-[6px]">
            <TriangleAlert size={13} strokeWidth={1.75} className="text-[#ff5f7c] shrink-0" />
            <span className="text-[11px] font-medium text-[#ff5f7c]">{missedItems.length} missed</span>
            <button onClick={() => selectGroup(missedItems)} className="text-[11px] font-medium text-[#ff5f7c] underline cursor-pointer">Select</button>
          </div>
        </div>
        <Tooltip label="Select All" side="left">
          <div><CheckItem checked={allSelected} onChange={selectAll} /></div>
        </Tooltip>
      </div>

      {/* Action item rows */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 py-3 gap-[15px]">
        {CHECKLIST_ITEMS.map(item => (
          <div key={item.id} className="flex items-start gap-[10px]">
            <ActionCard item={item} />
            <div className="flex flex-col items-center justify-center w-[34px] self-stretch">
              <CheckItem checked={selectedIds.has(item.id)} onChange={() => toggleItem(item.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Floating bulk-action bar */}
      {selectedIds.size > 0 && (
        <div className="mx-5 mb-3 flex items-center justify-between px-4 py-3 bg-[#44605e] rounded-[8px] shrink-0">
          <span className="text-[12px] font-medium text-white">{selectedIds.size} selected</span>
          <div className="flex items-center gap-3">
            {hasSelectedMissed && (
              <button
                onClick={() => setAnnotationOpen(true)}
                className="text-[12px] font-medium text-white underline cursor-pointer whitespace-nowrap"
              >
                I didn't because…
              </button>
            )}
            <button onClick={() => setSelectedIds(new Set())} className="text-white/60 hover:text-white transition-colors cursor-pointer">
              <X size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* Annotation modal */}
      {annotationOpen && (
        <BulkAnnotationModal
          selectedMissedItems={selectedMissedItems}
          onClose={() => setAnnotationOpen(false)}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   Transcript panel
───────────────────────────────────────────────── */
const TRANSCRIPT_LINES = [
  { role: 'patient',  time: '00:02', text: 'Hello?' },
  { role: 'provider', time: '00:04', text: "Hi William. This is Jessica from Acme Health. I'm just following up from our previous call. And to ensure your privacy as usual would you be so kind as to confirm your date of birth please?" },
  { role: 'patient',  time: '00:08', text: 'Sure, my date of birth is January third, nineteen forty three.' },
  { role: 'provider', time: '00:02', text: 'Perfect, thanks' },
  { role: 'patient',  time: '00:08', text: 'No problem' },
  { role: 'provider', time: '00:02', text: 'And how are you feeling today?' },
  { role: 'patient',  time: '00:11', text: "Well, I've been having some trouble sleeping lately and my back has been bothering me a bit." },
  { role: 'provider', time: '00:04', text: "I'm sorry to hear that. Let's make sure we note those concerns. Have you had a chance to review your discharge instructions?" },
  { role: 'patient',  time: '00:06', text: 'Yes, I went through them. A little hard to follow but I think I understood the main points.' },
  { role: 'provider', time: '00:03', text: "Good. Let's go over any parts that were unclear and make sure you're set up for success." },
];

function TranscriptPanel({ call, onCollapse, onToast }) {
  return (
    <div className="flex flex-col flex-1 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#f0f0f3]">
        <span className="text-[15px] font-medium text-[#444]">Transcript</span>
        <div className="flex items-center gap-1">
          <Tooltip label="Collapse" side="bottom">
            <button onClick={onCollapse} className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer transition-colors">
              <PanelLeftClose size={13} strokeWidth={1.75} className="text-[#9b9ba7]" />
            </button>
          </Tooltip>
          <Tooltip label="Search" side="bottom">
            <button className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer transition-colors">
              <svg width="14" height="14" fill="none" stroke="#9b9ba7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </Tooltip>
          <Tooltip label="Copy" side="bottom">
            <button
              className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer transition-colors"
              onClick={() => {
                const text = TRANSCRIPT_LINES.map(
                  l => `[${l.time}] ${l.role === 'provider' ? 'Provider' : 'Patient'}: ${l.text}`
                ).join('\n');
                navigator.clipboard.writeText(text);
                onToast?.('Transcript copied to clipboard');
              }}
            >
              <svg width="14" height="14" fill="none" stroke="#9b9ba7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 py-4 gap-5">
        {TRANSCRIPT_LINES.map((msg, i) => {
          const isProvider = msg.role === 'provider';
          return (
            <div key={i} className="flex items-start gap-3">
              <Avatar initials={isProvider ? call.provider.initials : 'W'} size={28} />
              <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-[#555]">
                    {isProvider ? call.provider.name.split(' ')[0] : 'William'}
                  </span>
                  <span className="text-[11px] text-[#9b9ba7]">{msg.time}</span>
                </div>
                <p className="text-[13px] text-[#555] leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Chart note panel
───────────────────────────────────────────────── */

/* ── Audit data ── */
const AUDIT_FIELDS = [
  { field: 'Chief Complaint',         status: 'missing'  },
  { field: 'MDM Complexity',          status: 'partial'  },
  { field: 'Diagnosis Documentation', status: 'present'  },
  { field: 'Safety Concerns',         status: 'missing'  },
  { field: 'Billing Justification',   status: 'unclear'  },
];

const STATUS_META = {
  missing: { icon: CircleX,          color: '#ff5f7c', label: 'missing'  },
  partial: { icon: CircleDashed,     color: '#ff9848', label: 'partial'  },
  present: { icon: CircleCheckBig,   color: '#34b0b4', label: 'present'  },
  unclear: { icon: TriangleAlert,    color: '#f0a400', label: 'unclear'  },
};

function AuditView() {
  const presentCount  = AUDIT_FIELDS.filter(f => f.status === 'present').length;
  const totalRequired = 9;
  const includedCount = 7;
  const omitsCount    = 2;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      {/* Template selector + score badge */}
      <div className="flex items-center gap-[10px] px-5 py-3">
        <button className="flex items-center gap-[10px] flex-1 min-w-0 px-[20px] py-[13px] rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition-colors">
          <FilePen size={15} strokeWidth={1.75} className="text-[#555] shrink-0" />
          <span className="text-[14px] font-medium text-[#555] flex-1 text-left">Medication Management</span>
          <ChevronDown size={11} strokeWidth={2} className="text-[#888] shrink-0" />
        </button>
        <span className="shrink-0 text-[13px] font-medium text-[#374151] bg-[rgba(45,140,255,0.2)] px-[20px] py-[10px] rounded-[30px] whitespace-nowrap">
          60%
        </span>
      </div>

      {/* Stats + Edits button */}
      <div className="flex items-center justify-between px-5 pb-3">
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[6px]">
            <Check size={13} strokeWidth={2.5} className="text-[#888] shrink-0" />
            <span className="text-[11px] font-medium text-[#888]">{includedCount}/{totalRequired} required elements included</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <TriangleAlert size={13} strokeWidth={1.75} className="text-[#ff5f7c] shrink-0" />
            <span className="text-[11px] font-medium text-[#ff5f7c]">Omits {omitsCount} key elements</span>
          </div>
        </div>
        <button className="flex items-center gap-[6px] px-[15px] py-[8px] rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors cursor-pointer shrink-0">
          <PenLine size={12} strokeWidth={1.75} className="text-[#555] shrink-0" />
          <span className="text-[12px] font-medium text-[#555]">4 Edits</span>
          <ChevronDown size={11} strokeWidth={2} className="text-[#888] shrink-0" />
        </button>
      </div>

      {/* Audit table */}
      <div className="flex flex-col px-5 pb-4">
        {/* Table header */}
        <div className="flex items-center h-[32px]">
          <div className="flex-1 px-[12px]">
            <span className="text-[10px] font-medium text-[#64748b] uppercase tracking-[0.6px]">Field</span>
          </div>
          <div className="w-[110px] px-[12px]">
            <span className="text-[10px] font-medium text-[#64748b] uppercase tracking-[0.6px]">Status</span>
          </div>
        </div>
        {/* Rows */}
        <div className="flex flex-col border-t border-[#e2e8f0]">
          {AUDIT_FIELDS.map((row, i) => {
            const meta = STATUS_META[row.status];
            const Icon = meta.icon;
            return (
              <div
                key={i}
                className={`flex items-center h-[44px] ${i > 0 ? 'border-t border-[#e2e8f0]' : ''}`}
              >
                <div className="flex-1 px-[12px]">
                  <span className="text-[13px] text-[#555]">{row.field}</span>
                </div>
                <div className="w-[110px] px-[12px] flex items-center gap-[8px]">
                  <Icon size={15} strokeWidth={1.75} style={{ color: meta.color }} className="shrink-0" />
                  <span className="text-[13px] text-[#555]">{meta.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CHART_NOTE = `Subjective: The patient is experiencing significant emotional distress and exhaustion due to recent challenges, including a car accident and domestic violence issues with their husband. They have a 20-year history of mental health struggles, including mood fluctuations and a past hospitalization for self-harm threats. The patient and their husband plan to take a vacation for self-care.

Objective: No changes in medication occurred since the last visit. Therapy attendance remains steady.

Assessment: Patient presents with significant emotional distress characterized by fear for personal safety, loneliness, confusion, and overwhelm due to recent traumatic experiences, including domestic violence and a car accident. Patient states "I do have confidence but not necessarily to trust myself all of the time."

Plan: Client is encouraged to explore therapeutic options, including DBT and EMDR therapy, to address emotional challenges.`;

const TOOLBAR_BTNS = ['B', 'I', 'U'];

/* ── Shared note editor contents (used in both single and split views) ── */
function NoteEditor() {
  return (
    <>
      {/* Rich text toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#f0f0f3] overflow-x-auto shrink-0">
        {TOOLBAR_BTNS.map(t => (
          <button key={t} className="w-6 h-6 flex items-center justify-center rounded text-[11px] font-semibold text-[#555] hover:bg-[#f0f0f3] cursor-pointer shrink-0">{t}</button>
        ))}
        <div className="w-px h-4 bg-[#e8e8ec] mx-1 shrink-0" />
        {[
          <svg key="al" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>,
          <svg key="ac" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
          <svg key="ar" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>,
          <svg key="ul" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
          <svg key="ol" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
        ].map((icon, i) => (
          <button key={i} className="w-6 h-6 flex items-center justify-center rounded text-[#555] hover:bg-[#f0f0f3] cursor-pointer shrink-0">{icon}</button>
        ))}
        <div className="w-px h-4 bg-[#e8e8ec] mx-1 shrink-0" />
        {[
          <svg key="undo" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>,
          <svg key="redo" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>,
        ].map((icon, i) => (
          <button key={i} className="w-6 h-6 flex items-center justify-center rounded text-[#555] hover:bg-[#f0f0f3] cursor-pointer shrink-0">{icon}</button>
        ))}
      </div>

      {/* Note content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[13px] text-[#444] leading-relaxed whitespace-pre-line">{CHART_NOTE}</p>
      </div>

      {/* Approve button */}
      <div className="px-4 pb-4 pt-2 border-t border-[#f0f0f3] shrink-0">
        <button className="w-full flex items-center justify-center gap-2 h-[42px] bg-[#34b0b4] hover:bg-[#2d9a9e] active:bg-[#28888c] rounded-lg text-white text-[14px] font-medium cursor-pointer transition-colors">
          Approve Call
          <Check size={15} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}

function ChartNotePanel({ onCollapse }) {
  const [activeTab, setActiveTab] = useState('note');
  const isNote  = activeTab === 'note';
  const isAudit = activeTab === 'audit';
  const isBoth  = activeTab === 'both';

  const TABS = [
    { id: 'note',  label: 'Note' },
    { id: 'audit', label: 'Audit' },
    { id: 'both',  label: <Columns2 size={12} strokeWidth={2} /> },
  ];

  return (
    <div className="flex flex-col flex-1 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#f0f0f3] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-medium text-[#444]">Chart note</span>
          {/* Note / Audit / Both tabs */}
          <div className="flex items-center gap-[2px] px-[4px] py-[3px] rounded-[6px] bg-[#f0f0f3]">
            {TABS.map(({ id, label }) => (
              <Tooltip key={id} label={id === 'both' ? 'Side by side' : ''} side="bottom">
                <button
                  onClick={() => setActiveTab(id)}
                  className={`px-[8px] py-[3px] rounded-[4px] text-[11px] font-medium transition-colors cursor-pointer flex items-center justify-center ${
                    activeTab === id ? 'bg-white text-[#444] shadow-sm' : 'text-[#9b9ba7] hover:text-[#555]'
                  }`}
                >
                  {label}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip label="Collapse" side="bottom">
            <button onClick={onCollapse} className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer transition-colors">
              <PanelRightClose size={13} strokeWidth={1.75} className="text-[#9b9ba7]" />
            </button>
          </Tooltip>
          {(isNote || isBoth) && (
            <>
              <Tooltip label="Revert Changes" side="bottom">
                <button className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer">
                  <ArrowLeft size={13} strokeWidth={1.75} className="text-[#9b9ba7]" />
                </button>
              </Tooltip>
              <Tooltip label="Sign" side="bottom">
                <button className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer">
                  <PenLine size={13} strokeWidth={1.75} className="text-[#9b9ba7]" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* ── Note only ── */}
      {isNote && <NoteEditor />}

      {/* ── Audit only ── */}
      {isAudit && <AuditView />}

      {/* ── Side-by-side ── */}
      {isBoth && (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Note side */}
          <div className="flex flex-col flex-1 min-w-0 border-r border-[#f0f0f3]">
            <NoteEditor />
          </div>
          {/* Audit side */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <AuditView />
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   Resizable panel group
───────────────────────────────────────────────── */
function ResizablePanelGroup({ call, onToast }) {
  const containerRef = useRef(null);
  const dragRef      = useRef(null);

  const [widths,    setWidths]    = useState(null);
  const [collapsed, setCollapsed] = useState({ checklist: false, transcript: false, chartNote: false });
  const savedWidths = useRef({});

  // Measure container and set initial widths
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    // px-5 on each side = 20px, two handles at 10px each = 20px, gap-3 between groups not needed (handles replace gaps)
    const totalW  = containerRef.current.clientWidth - 40; // subtract px-5*2
    const handles = 20; // 2 handles × 10px
    const available = totalW - handles;
    const clW  = Math.min(400, available * 0.32);
    const rest = available - clW;
    setWidths({ checklist: clW, transcript: rest / 2, chartNote: rest / 2 });
  }, []);

  function makeHandleProps(side) {
    return {
      onPointerDown(e) {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = { side, startX: e.clientX, startWidths: { ...widths } };
      },
      onPointerMove(e) {
        if (!dragRef.current || dragRef.current.side !== side) return;
        const { startX, startWidths } = dragRef.current;
        const delta = e.clientX - startX;
        setWidths(() => {
          if (side === 'L') {
            // Keep checklist + transcript sum constant so total never grows
            const sum = startWidths.checklist + startWidths.transcript;
            const cl  = Math.max(MIN_W, Math.min(sum - MIN_W, startWidths.checklist + delta));
            return { ...startWidths, checklist: cl, transcript: sum - cl };
          } else {
            // Keep transcript + chartNote sum constant
            const sum = startWidths.transcript + startWidths.chartNote;
            const tr  = Math.max(MIN_W, Math.min(sum - MIN_W, startWidths.transcript + delta));
            return { ...startWidths, transcript: tr, chartNote: sum - tr };
          }
        });
      },
      onPointerUp(e) {
        e.currentTarget.releasePointerCapture(e.pointerId);
        dragRef.current = null;
      },
    };
  }

  function toggleCollapse(panel) {
    const isNowCollapsed = !collapsed[panel];
    const neighborMap = {
      checklist:  ['transcript', 'chartNote'],
      transcript: ['checklist',  'chartNote'],
      chartNote:  ['transcript', 'checklist'],
    };
    const openNeighbors = neighborMap[panel].filter(n => !collapsed[n]);

    if (isNowCollapsed) {
      savedWidths.current[panel] = widths[panel];
      const freed = widths[panel] - COLLAPSED_W;
      setWidths(prev => {
        const next = { ...prev, [panel]: COLLAPSED_W };
        const share = freed / (openNeighbors.length || 1);
        openNeighbors.forEach(n => { next[n] = prev[n] + share; });
        return next;
      });
    } else {
      const restore = savedWidths.current[panel] || MIN_W;
      const take    = restore - COLLAPSED_W;
      setWidths(prev => {
        const next = { ...prev, [panel]: restore };
        const share = take / (openNeighbors.length || 1);
        openNeighbors.forEach(n => { next[n] = Math.max(COLLAPSED_W, prev[n] - share); });
        return next;
      });
    }
    setCollapsed(prev => ({ ...prev, [panel]: isNowCollapsed }));
  }

  const leftHandleActive  = !collapsed.checklist  && !collapsed.transcript;
  const rightHandleActive = !collapsed.transcript  && !collapsed.chartNote;

  // Skeleton until widths are measured
  if (!widths) {
    return (
      <div ref={containerRef} className="flex flex-1 min-h-0 px-5 py-3 gap-3">
        <div className="w-[400px] shrink-0 bg-white rounded-lg" />
        <div className="flex-1 bg-white rounded-lg" />
        <div className="flex-1 bg-white rounded-lg" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-1 min-h-0 px-5 py-3">
      {/* Checklist */}
      {collapsed.checklist
        ? <CollapsedPanel label="Checklist" onExpand={() => toggleCollapse('checklist')} side="left" />
        : (
          <div style={{ width: widths.checklist, flexShrink: 0 }} className="flex flex-col min-h-0">
            <ChecklistPanel call={call} onCollapse={() => toggleCollapse('checklist')} />
          </div>
        )}

      <DragHandle
        {...(leftHandleActive ? makeHandleProps('L') : {})}
        disabled={!leftHandleActive}
      />

      {/* Transcript */}
      {collapsed.transcript
        ? <CollapsedPanel label="Transcript" onExpand={() => toggleCollapse('transcript')} side="left" />
        : (
          <div style={{ width: widths.transcript, flexShrink: 0 }} className="flex flex-col min-h-0">
            <TranscriptPanel call={call} onCollapse={() => toggleCollapse('transcript')} onToast={onToast} />
          </div>
        )}

      <DragHandle
        {...(rightHandleActive ? makeHandleProps('R') : {})}
        disabled={!rightHandleActive}
      />

      {/* Chart note */}
      {collapsed.chartNote
        ? <CollapsedPanel label="Chart note" onExpand={() => toggleCollapse('chartNote')} side="right" />
        : (
          <div style={{ width: widths.chartNote, flexShrink: 0 }} className="flex flex-col min-h-0">
            <ChartNotePanel onCollapse={() => toggleCollapse('chartNote')} />
          </div>
        )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   Audio player
───────────────────────────────────────────────── */
function AudioPlayer() {
  const [progress] = useState(8);
  return (
    <div className="flex items-center gap-4 px-8 py-[14px] bg-white border-t border-[#ebebeb] shrink-0">
      <span className="text-[11px] font-medium text-[#888] tabular-nums w-[34px]">00:00</span>

      {/* Scrubber */}
      <div className="flex-1 relative h-[3px] bg-[#e8e8ec] rounded-full cursor-pointer">
        <div className="absolute inset-y-0 left-0 bg-[#34b0b4] rounded-full" style={{ width: `${progress}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 size-[11px] bg-[#34b0b4] rounded-full shadow-sm"
          style={{ left: `calc(${progress}% - 5.5px)` }}
        />
      </div>

      <span className="text-[11px] font-medium text-[#888] tabular-nums w-[34px] text-right">23:50</span>

      {/* Controls */}
      <div className="flex items-center gap-3 ml-2">
        <button className="flex items-center justify-center size-[34px] rounded-full border border-[#e0e0e8] cursor-pointer hover:bg-[#f7f7f9] transition-colors">
          <Play size={13} strokeWidth={1.75} fill="#555" className="text-[#555] ml-0.5" />
        </button>
        <button className="text-[#9b9ba7] hover:text-[#555] transition-colors cursor-pointer">
          <RotateCcw size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Slide-down toast notification
───────────────────────────────────────────────── */
function Toast({ message, show }) {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        zIndex: 99999,
        pointerEvents: 'none',
        transform: show ? 'translate(-50%, 16px)' : 'translate(-50%, -60px)',
        transition: show
          ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.22s ease-in',
      }}
    >
      <div style={{
        background: '#222',
        color: '#fff',
        fontSize: 13,
        fontWeight: 500,
        padding: '9px 18px',
        borderRadius: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.01em',
      }}>
        {message}
      </div>
    </div>,
    document.body
  );
}

/* ────────────────────────────────────────────────
   Main modal
───────────────────────────────────────────────── */
export default function CallDetailModal({ call, callIndex, totalCalls, onClose, onNext, onPrev }) {
  const [visible, setVisible] = useState(false);

  // Toast notification
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef(null);
  function showToast(msg) {
    clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastShow(true);
    toastTimer.current = setTimeout(() => setToastShow(false), 3000);
  }

  // Slide in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const callId = `${93856000000 + callIndex * 759372}`;

  // Editable patient name
  const [patientName, setPatientName] = useState(call.patient);
  const [editingPatient, setEditingPatient] = useState(false);

  // Reset patient name when call changes
  useEffect(() => { setPatientName(call.patient); setEditingPatient(false); }, [call]);

  // Derive patient initials
  const patientInitials = patientName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const modal = createPortal(
    <div
      className={`fixed inset-0 z-[200] bg-[#f3f4f6] flex flex-col transition-transform duration-300 ease-in-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center gap-2 px-5 h-[54px] bg-white border-b border-[#ebebeb] shrink-0">
        {/* Back */}
        <Tooltip label="Exit" side="bottom">
          <button
            onClick={handleClose}
            className="flex items-center justify-center size-[32px] rounded-lg hover:bg-[#f0f0f3] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} strokeWidth={1.75} className="text-[#555]" />
          </button>
        </Tooltip>

        {/* Prev / Next */}
        <Tooltip label="Previous Call" side="bottom">
          <button
            onClick={onPrev}
            disabled={callIndex === 0}
            className="flex items-center justify-center size-[32px] rounded-lg hover:bg-[#f0f0f3] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <SkipBack size={15} strokeWidth={1.75} className="text-[#555]" />
          </button>
        </Tooltip>
        <Tooltip label="Next Call" side="bottom">
          <button
            onClick={onNext}
            disabled={callIndex === totalCalls - 1}
            className="flex items-center justify-center size-[32px] rounded-lg hover:bg-[#f0f0f3] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <SkipForward size={15} strokeWidth={1.75} className="text-[#555]" />
          </button>
        </Tooltip>

        <span className="text-[14px] font-medium text-[#444] ml-1">Call {callId}</span>

        <div className="flex-1" />

        <Tooltip label="Copy Link" side="bottom">
          <button
            className="flex items-center justify-center size-[32px] rounded-lg hover:bg-[#f0f0f3] cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href + '#call-' + callId);
              showToast('Call URL copied to clipboard');
            }}
          >
            <Link2 size={15} strokeWidth={1.75} className="text-[#9b9ba7]" />
          </button>
        </Tooltip>
        <Tooltip label="Move to Trash" side="bottom">
          <button className="flex items-center justify-center size-[32px] rounded-lg hover:bg-[#f0f0f3] cursor-pointer">
            <Trash2 size={15} strokeWidth={1.75} className="text-[#9b9ba7]" />
          </button>
        </Tooltip>
      </div>

      {/* ── Stats row ── */}
      <div className="flex items-stretch gap-3 px-5 pt-3 shrink-0">
        {/* Call details box — 500px, Figma design */}
        <div className="bg-white rounded-lg shrink-0 flex flex-col justify-center gap-[10px] px-[30px] py-[20px]" style={{ width: 450 }}>
          {/* Row 1: date + time pills */}
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[4px] h-[22px] px-[11px] py-[3px] rounded-full bg-[#e6f2f1]">
              <Calendar size={12} strokeWidth={1.75} className="text-[#44605e] shrink-0" />
              <span className="text-[12px] font-medium text-[#44605e] whitespace-nowrap">2025-04-24</span>
            </div>
            <div className="flex items-center gap-[4px] h-[22px] px-[11px] py-[3px] rounded-full bg-[#e6f2f1]">
              <Clock size={12} strokeWidth={1.75} className="text-[#44605e] shrink-0" />
              <span className="text-[12px] font-medium text-[#44605e] whitespace-nowrap">17:40</span>
            </div>
          </div>

          {/* Row 2: provider | vertical line | patient */}
          <div className="flex items-center gap-[30px]">
            {/* Provider */}
            <div className="flex items-center gap-[8px] py-px shrink-0">
              <Avatar initials={call.provider.initials} size={40} />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[#020817] whitespace-nowrap tracking-[-0.18px]">{call.provider.name}</span>
                <span className="text-[12px] text-[#777] tracking-[-0.18px]">Provider</span>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="w-px h-[25px] bg-[#e8e8ec] shrink-0" />

            {/* Patient */}
            <div className="flex items-center gap-[8px] py-px shrink-0">
              <Avatar initials={patientInitials} size={40} />
              <div className="flex flex-col">
                <div className="flex items-center gap-[8px]">
                  {editingPatient ? (
                    <input
                      autoFocus
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      onBlur={() => setEditingPatient(false)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingPatient(false); }}
                      className="text-[14px] font-medium text-[#020817] tracking-[-0.18px] border-b border-[#34b0b4] outline-none bg-transparent w-[160px]"
                    />
                  ) : (
                    <span className="text-[14px] font-medium text-[#020817] whitespace-nowrap tracking-[-0.18px]">{patientName}</span>
                  )}
                  <Tooltip label="Edit" side="top">
                    <button
                      onClick={() => setEditingPatient(true)}
                      className="text-[#bbb] hover:text-[#555] transition-colors cursor-pointer"
                    >
                      <PenLine size={14} strokeWidth={1.75} />
                    </button>
                  </Tooltip>
                </div>
                <span className="text-[12px] text-[#777] tracking-[-0.18px]">Patient</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat blocks — team-member-page style */}
        <div className="bg-white rounded-lg flex items-center gap-3 px-6 flex-1 min-w-0">
          {/* Adherence pills stacked */}
          <div className="flex flex-col gap-[8px] shrink-0 pr-3">
            <AdherencePill color="#34b0b4" label="Call adherence" value={call.callAdh.value} />
            <AdherencePill color="#3ba7ff" label="Note adherence" value={call.noteAdh.value} />
          </div>
          <div className="w-px self-stretch bg-[#f0f0f3] shrink-0" />
          <StatBlock label="Duration"     icon={Clock}  value={call.duration.value} variant={call.duration.variant} />
          <StatBlock label="Pace"         icon={Gauge}  value={call.pace.value}     variant={call.pace.variant} />
          <StatBlock label="Listen Ratio" icon={Ear}    value={call.listen.value}   variant={call.listen.variant} />
          <StatBlock label="Language"     icon={Smile}  value={call.language.value} variant={call.language.variant} />
        </div>
      </div>

      {/* ── Three-panel body ── */}
      <ResizablePanelGroup call={call} onToast={showToast} />

      {/* ── Audio player ── */}
      <AudioPlayer />
    </div>,
    document.body
  );
  return (
    <>
      {modal}
      <Toast message={toastMsg} show={toastShow} />
    </>
  );
}
