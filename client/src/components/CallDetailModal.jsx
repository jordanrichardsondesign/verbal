import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Popover from '@radix-ui/react-popover';
import {
  ArrowLeft, SkipBack, SkipForward, Link2, Trash2,
  Calendar, Clock, MoreHorizontal, Check, TriangleAlert,
  ChevronDown, Play, RotateCcw, PenLine, Gauge, Ear, Smile, ListChecks,
  CircleCheckBig, CircleX, X,
} from 'lucide-react';
import Tooltip from './Tooltip';
import { ChecklistMenu, DEFAULT_CHECKLISTS } from './ChecklistPicker';

/* ────────────────────────────────────────────────
   Animated adherence gauge (SVG semicircle arc)
───────────────────────────────────────────────── */
const ARC_R = 42;
const ARC_LEN = Math.PI * ARC_R; // π * r = half-circle arc length

function AdherenceGauge({ pct }) {
  const [animated, setAnimated] = useState(false);

  // Trigger animation after a brief delay so transition fires post-mount
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [pct]);

  // Reset + re-animate when call changes
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const color = pct >= 80 ? '#34b0b4' : pct >= 50 ? '#ff9848' : '#ff5f7c';
  const label = pct >= 80 ? 'Good 👍' : pct >= 50 ? 'Fair' : 'Needs Work';
  const dashOffset = animated ? ARC_LEN * (1 - pct / 100) : ARC_LEN;

  // Semicircle: M (cx-r, cy) A r r 0 0 1 (cx+r, cy)
  const cx = 50;
  const cy = 52;
  const d = `M ${cx - ARC_R} ${cy} A ${ARC_R} ${ARC_R} 0 0 1 ${cx + ARC_R} ${cy}`;

  return (
    <div className="flex flex-col items-center justify-center px-7 py-5 gap-1">
      <div className="relative w-[100px] h-[60px]">
        <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible">
          {/* Background track */}
          <path d={d} fill="none" stroke="#f0f0f3" strokeWidth="7" strokeLinecap="round" />
          {/* Animated foreground */}
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${ARC_LEN} ${ARC_LEN}`}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        {/* Centered label */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-[22px] font-semibold leading-none" style={{ color: '#444' }}>{pct}%</span>
        </div>
      </div>
      <span className="text-[12px] text-[#888]">Adherence</span>
      <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

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

function StatBlock({ label, icon: Icon, value }) {
  return (
    <div className="flex flex-col gap-[5px] justify-center h-[59px]">
      <span className="text-[10px] font-medium text-[#777] whitespace-nowrap leading-[12px]">{label}</span>
      <div className="flex items-center gap-[8px]">
        <Icon size={16} strokeWidth={1.75} className="text-[#555] shrink-0" />
        <span className="text-[14px] font-medium text-[#555] whitespace-nowrap">{value}</span>
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
      <div className="flex-1 min-w-0 flex flex-col gap-[10px] bg-[#e7fffd] rounded-[8px] p-[18px]">
        <div className="flex items-start gap-[12px]">
          <CircleCheckBig size={15} strokeWidth={1.75} className="text-[#44605e] shrink-0 mt-px" />
          <span className="flex-1 min-w-0 text-[12px] font-semibold text-[#44605e] leading-normal">
            {item.label}
          </span>
          <MoreHorizontal size={16} strokeWidth={1.75} className="text-[#ccc] shrink-0" />
        </div>
        {item.note && (
          <div className="ml-[25px] bg-[rgba(97,137,133,0.1)] px-[12px] py-[6px]">
            <span className="text-[12px] text-[#555] italic leading-[1.2]">{item.note}</span>
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
function BulkAnnotationModal({ selectedMissedItems, onClose }) {
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
        <button className="w-full flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-[20px] py-[14px] cursor-pointer hover:bg-[#f1f5f9] transition-colors">
          <span className="text-[14px] font-medium text-[#555]">Select One</span>
          <ChevronDown size={13} strokeWidth={2} className="text-[#888]" />
        </button>
        {/* Save */}
        <button className="w-full flex items-center justify-center h-[54px] bg-[#618985] hover:bg-[#526f6b] active:bg-[#44605e] rounded-[8px] text-white text-[14px] font-medium cursor-pointer transition-colors">
          Save
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ── Main checklist panel ── */
function ChecklistPanel({ call }) {
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
    <div className="flex flex-col w-[400px] shrink-0 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#f0f0f3]">
        <span className="text-[18px] font-medium text-[#555]">Checklist</span>
        <MoreHorizontal size={16} strokeWidth={1.75} className="text-[#bbb] cursor-pointer" />
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

function TranscriptPanel({ call }) {
  return (
    <div className="flex flex-col flex-1 min-w-0 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#f0f0f3]">
        <span className="text-[15px] font-medium text-[#444]">Transcript</span>
        <div className="flex items-center gap-1">
          <Tooltip label="Search" side="bottom">
            <button className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer transition-colors">
              <svg width="14" height="14" fill="none" stroke="#9b9ba7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </Tooltip>
          <Tooltip label="Copy" side="bottom">
            <button className="p-1.5 rounded-md hover:bg-[#f7f7f9] cursor-pointer transition-colors">
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
const CHART_NOTE = `Subjective: The patient is experiencing significant emotional distress and exhaustion due to recent challenges, including a car accident and domestic violence issues with their husband. They have a 20-year history of mental health struggles, including mood fluctuations and a past hospitalization for self-harm threats. The patient and their husband plan to take a vacation for self-care.

Objective: No changes in medication occurred since the last visit. Therapy attendance remains steady.

Assessment: Patient presents with significant emotional distress characterized by fear for personal safety, loneliness, confusion, and overwhelm due to recent traumatic experiences, including domestic violence and a car accident. Patient states "I do have confidence but not necessarily to trust myself all of the time."

Plan: Client is encouraged to explore therapeutic options, including DBT and EMDR therapy, to address emotional challenges.`;

const TOOLBAR_BTNS = ['B', 'I', 'U'];

function ChartNotePanel() {
  return (
    <div className="flex flex-col flex-1 min-w-0 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#f0f0f3]">
        <span className="text-[15px] font-medium text-[#444]">Chart note</span>
        <div className="flex items-center gap-1">
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
        </div>
      </div>

      {/* Rich text toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#f0f0f3]">
        {TOOLBAR_BTNS.map(t => (
          <button key={t} className="w-6 h-6 flex items-center justify-center rounded text-[11px] font-semibold text-[#555] hover:bg-[#f0f0f3] cursor-pointer">{t}</button>
        ))}
        <div className="w-px h-4 bg-[#e8e8ec] mx-1" />
        {/* Alignment */}
        {[
          <svg key="al" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>,
          <svg key="ac" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
          <svg key="ar" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>,
          <svg key="ul" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
          <svg key="ol" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
        ].map((icon, i) => (
          <button key={i} className="w-6 h-6 flex items-center justify-center rounded text-[#555] hover:bg-[#f0f0f3] cursor-pointer">{icon}</button>
        ))}
        <div className="w-px h-4 bg-[#e8e8ec] mx-1" />
        {/* Undo / Redo */}
        {[
          <svg key="undo" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>,
          <svg key="redo" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>,
        ].map((icon, i) => (
          <button key={i} className="w-6 h-6 flex items-center justify-center rounded text-[#555] hover:bg-[#f0f0f3] cursor-pointer">{icon}</button>
        ))}
      </div>

      {/* Note content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[13px] text-[#444] leading-relaxed whitespace-pre-line">{CHART_NOTE}</p>
      </div>

      {/* Approve button */}
      <div className="px-4 pb-4 pt-2 border-t border-[#f0f0f3]">
        <button className="w-full flex items-center justify-center gap-2 h-[42px] bg-[#34b0b4] hover:bg-[#2d9a9e] active:bg-[#28888c] rounded-lg text-white text-[14px] font-medium cursor-pointer transition-colors">
          Approve Call
          <Check size={15} strokeWidth={2.5} />
        </button>
      </div>
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
   Main modal
───────────────────────────────────────────────── */
export default function CallDetailModal({ call, callIndex, totalCalls, onClose, onNext, onPrev }) {
  const [visible, setVisible] = useState(false);

  // Slide in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const adherencePct = parseInt(call.callAdh.value) || 0;
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

  return createPortal(
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
          <button className="flex items-center justify-center size-[32px] rounded-lg hover:bg-[#f0f0f3] cursor-pointer">
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
      <div className="flex items-stretch gap-3 px-5 pt-4 shrink-0">
        {/* Adherence donut */}
        <div className="bg-white rounded-lg shrink-0">
          <AdherenceGauge pct={adherencePct} />
        </div>

        {/* Call details box — 500px, Figma design */}
        <div className="bg-white rounded-lg shrink-0 flex flex-col justify-center gap-[10px] px-[30px] py-[20px]" style={{ width: 500 }}>
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

        {/* Stat blocks — fill remaining width */}
        <div className="bg-white rounded-lg flex items-center gap-[60px] px-[30px] flex-1 min-w-0">
          <StatBlock label="Pace"              icon={Gauge} value={call.pace.value} />
          <StatBlock label="Listen Ratio"      icon={Ear}   value={`${call.listen.value} Listen`} />
          <StatBlock label="Provider Language" icon={Smile} value={`${call.language.value} Positive`} />
          <StatBlock label="Patient Language"  icon={Smile} value="74% Positive" />
        </div>
      </div>

      {/* ── Three-panel body ── */}
      <div className="flex flex-1 min-h-0 gap-3 px-5 py-3">
        <ChecklistPanel call={call} />
        <TranscriptPanel call={call} />
        <ChartNotePanel />
      </div>

      {/* ── Audio player ── */}
      <AudioPlayer />
    </div>,
    document.body
  );
}
