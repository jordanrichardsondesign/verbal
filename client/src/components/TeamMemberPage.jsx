import { useState } from 'react';
import { ArrowLeft, Trophy, Globe, Gauge, Ear, Smile, Clock } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import ChecklistPicker from './ChecklistPicker';
import PatientPicker from './PatientPicker';
import { SearchInput } from './PageControls';
import CallDetailModal from './CallDetailModal';
import { COL, Badge, TableColHeader, CallRow, useContainerWidth, computeVisibleCols, getChecklistWidth } from './CallsTable';
import { CALLS } from '../data/calls';

/* ── Stat card ── */
function StatCard({ label, icon: Icon, value, variant }) {
  return (
    <div className="flex flex-col gap-[10px] px-6 py-4 min-w-0 flex-1">
      <div className="flex items-center gap-[6px]">
        <Icon size={13} strokeWidth={1.75} className="text-[#888] shrink-0" />
        <span className="text-[11px] font-medium text-[#888] whitespace-nowrap">{label}</span>
      </div>
      <Badge value={value} variant={variant} />
    </div>
  );
}

/* ── Adherence pill (mirrors Dashboard LegendPill) ── */
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

/* ── Page ── */
export default function TeamMemberPage({ member, onBack }) {
  const [activePeriod, setActivePeriod] = useState('1M');
  const [activeTab,    setActiveTab]    = useState('calls');
  const [search,       setSearch]       = useState('');
  const [selectedCall, setSelectedCall] = useState(null);
  const [sortKey,      setSortKey]      = useState('date');
  const [sortDir,      setSortDir]      = useState('desc');

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  /* Filter calls belonging to this provider */
  const memberCalls = CALLS.filter((c) => c.provider.name === member.name);
  const filtered    = memberCalls.filter((c) =>
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

  // Responsive table — provider always excluded on member page
  const ROW_PAD = 20;
  const [tableRef, containerW] = useContainerWidth();
  const availableW  = containerW - ROW_PAD;
  const visibleCols = computeVisibleCols(availableW, ['provider']);
  const checklistW  = getChecklistWidth(availableW, visibleCols);

  const TABS = [
    { id: 'calls',      label: 'Calls',      icon: null        },
    { id: 'checklists', label: 'Checklists', icon: null        },
    { id: 'settings',   label: 'Settings',   icon: null        },
  ];

  const STATS = [
    { label: 'Avg Duration', icon: Clock,  ...member.duration },
    { label: 'Pace',         icon: Gauge,  ...member.pace     },
    { label: 'Listen Ratio', icon: Ear,    ...member.listen   },
    { label: 'Positivity',   icon: Smile,  ...member.language },
  ];

  return (
    <div className="flex flex-col flex-1 px-10 py-[30px] gap-5">

      {/* ── Header bar ── */}
      <div className="flex items-center gap-[6px] w-full">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center justify-center size-[38px] rounded-lg border border-[#ebebeb] bg-white hover:bg-[#f7f7f9] transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} strokeWidth={1.75} className="text-[#555]" />
        </button>

        <ChecklistPicker />
        <PatientPicker />

        <div className="flex-1" />

        <DateRangePicker activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search calls"
        />
      </div>

      {/* ── Profile + Stats ── */}
      <div className="flex items-stretch gap-4">
        {/* Profile card — large avatar from Figma */}
        <div className="bg-white rounded-lg px-8 py-6 flex items-center gap-6 shrink-0">
          {/* 80px avatar */}
          <div className="flex items-center justify-center size-[80px] rounded-full bg-[#e0eefe] shrink-0">
            <span className="text-[28px] font-medium text-[#0055a3] tracking-[-0.18px]">{member.initials}</span>
          </div>
          {/* Info */}
          <div className="flex flex-col gap-[5px]">
            <span className="text-[24px] font-medium text-[#020817] tracking-[-0.18px] whitespace-nowrap leading-[30px]">
              {member.name}
            </span>
            <div className="flex items-center gap-[6px]">
              <span className="text-[13px] text-[#777]">{member.dept}</span>
              <span className="text-[#ccc]">·</span>
              <span className="text-[13px] text-[#777]">{member.role}</span>
            </div>
            <div className="flex items-center gap-[14px] mt-1">
              <div className="flex items-center gap-[5px]">
                <Trophy size={13} strokeWidth={1.75} className="text-[#f59e0b] shrink-0" />
                <span className="text-[12px] text-[#555]">Rank #2 in Org</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <Globe size={13} strokeWidth={1.75} className="text-[#9b9ba7] shrink-0" />
                <span className="text-[12px] text-[#555]">Rank #124 Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="flex-1 bg-white rounded-lg px-6 py-6 flex items-center gap-3">
          {/* Adherence pills — stacked vertically */}
          <div className="flex flex-col gap-[8px] shrink-0 pr-3">
            <AdherencePill color="#34b0b4" label="Call adherence" value={member.callAdh.value} />
            <AdherencePill color="#3ba7ff" label="Note adherence" value={member.noteAdh.value} />
          </div>
          <div className="w-px self-stretch bg-[#f0f0f3] shrink-0" />
          {/* Remaining stat cards */}
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── Tab navigation (pill switcher) ── */}
      <div className="flex items-center">
        <div className="flex items-center gap-[2px] px-[4px] py-[3px] rounded-[6px] bg-[#f0f0f3]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-[12px] py-[5px] rounded-[4px] text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === id
                  ? 'bg-white text-[#444] shadow-sm'
                  : 'text-[#9b9ba7] hover:text-[#555]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Calls tab ── */}
      {activeTab === 'calls' && (() => {
        const sh = { activeSortKey: sortKey, sortDir, onSort: handleSort };
        return (
          <div ref={tableRef} className="rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="flex items-center px-[10px] border-b border-[#ebebeb]">
              {visibleCols.has('date')     && <TableColHeader label="Date"           width={COL.date}    align="left" sortKey="date"      {...sh} />}
              {visibleCols.has('patient')  && <TableColHeader label="Patient"        width={COL.patient} align="left" sortKey="patient"   {...sh} />}
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
                  No calls found for this provider.
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Checklists tab ── */}
      {activeTab === 'checklists' && (
        <div className="flex items-center justify-center py-20 text-[14px] text-[#9b9ba7]">
          Checklist analytics coming soon.
        </div>
      )}

      {/* ── Settings tab ── */}
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center py-20 text-[14px] text-[#9b9ba7]">
          Member settings coming soon.
        </div>
      )}

      {/* ── Call detail modal ── */}
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
