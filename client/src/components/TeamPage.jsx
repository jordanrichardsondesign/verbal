import { useState } from 'react';
import { Funnel, UserPlus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Tooltip from './Tooltip';
import { FilterButton, SearchInput } from './PageControls';

/* ── Data ── */
export const MEMBERS = [
  {
    initials: 'SJ', name: 'Stephanie Jackson', dept: 'Neurology',       role: 'Counselor',
    callAdh:  { value: '100%',     variant: 'green'  },
    noteAdh:  { value: '100%',     variant: 'green'  },
    pace:     { value: '135 WPM',  variant: 'green'  },
    listen:   { value: '56%',      variant: 'orange' },
    language: { value: '98%',      variant: 'green'  },
    duration: { value: '01:20:34', variant: 'green'  },
    calls: 13,
  },
  {
    initials: 'MK', name: 'Michael King',       dept: 'Cardiology',     role: 'Surgeon',
    callAdh:  { value: '100%',     variant: 'green'  },
    noteAdh:  { value: '56%',      variant: 'orange' },
    pace:     { value: '150 WPM',  variant: 'green'  },
    listen:   { value: '70%',      variant: 'green'  },
    language: { value: '92%',      variant: 'green'  },
    duration: { value: '00:48:10', variant: 'green'  },
    calls: 26,
  },
  {
    initials: 'LH', name: 'Laura Hill',         dept: 'Pediatrics',     role: 'Nurse',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '95%',      variant: 'green' },
    pace:     { value: '140 WPM',  variant: 'green' },
    listen:   { value: '80%',      variant: 'green' },
    language: { value: '100%',     variant: 'green' },
    duration: { value: '00:32:55', variant: 'green' },
    calls: 3,
  },
  {
    initials: 'RC', name: 'Robert Collins',     dept: 'Oncology',       role: 'Researcher',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '88%',      variant: 'green' },
    pace:     { value: '130 WPM',  variant: 'green' },
    listen:   { value: '65%',      variant: 'green' },
    language: { value: '95%',      variant: 'green' },
    duration: { value: '00:55:22', variant: 'green' },
    calls: 28,
  },
  {
    initials: 'AN', name: 'Alice Newton',       dept: 'Dermatology',    role: 'Technician',
    callAdh:  { value: '45%',      variant: 'ruby'   },
    noteAdh:  { value: '46%',      variant: 'orange' },
    pace:     { value: '160 WPM',  variant: 'green'  },
    listen:   { value: '90%',      variant: 'ruby'   },
    language: { value: '88%',      variant: 'green'  },
    duration: { value: '00:12:04', variant: 'orange' },
    calls: 5,
  },
  {
    initials: 'HJ', name: 'Henry James',        dept: 'Orthopedics',    role: 'Physician',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '85%',      variant: 'green' },
    pace:     { value: '125 WPM',  variant: 'green' },
    listen:   { value: '60%',      variant: 'green' },
    language: { value: '97%',      variant: 'green' },
    duration: { value: '01:02:18', variant: 'green' },
    calls: 6,
  },
  {
    initials: 'CT', name: 'Cynthia Turner',     dept: 'Gastroenterology', role: 'Specialist',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '93%',      variant: 'green' },
    pace:     { value: '145 WPM',  variant: 'green' },
    listen:   { value: '75%',      variant: 'green' },
    language: { value: '100%',     variant: 'green' },
    duration: { value: '00:41:33', variant: 'green' },
    calls: 7,
  },
  {
    initials: 'JP', name: 'James Peterson',     dept: 'Endocrinology',  role: 'Consultant',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '90%',      variant: 'green' },
    pace:     { value: '120 WPM',  variant: 'green' },
    listen:   { value: '68%',      variant: 'green' },
    language: { value: '91%',      variant: 'green' },
    duration: { value: '00:28:47', variant: 'green' },
    calls: 8,
  },
  {
    initials: 'EM', name: 'Emma Matthews',      dept: 'Urology',        role: 'Therapist',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '98%',      variant: 'green' },
    pace:     { value: '155 WPM',  variant: 'green' },
    listen:   { value: '82%',      variant: 'green' },
    language: { value: '99%',      variant: 'green' },
    duration: { value: '00:37:15', variant: 'green' },
    calls: 9,
  },
  {
    initials: 'TW', name: 'Thomas White',       dept: 'Ophthalmology',  role: 'Optometrist',
    callAdh:  { value: '100%',     variant: 'green' },
    noteAdh:  { value: '87%',      variant: 'green' },
    pace:     { value: '110 WPM',  variant: 'green' },
    listen:   { value: '73%',      variant: 'green' },
    language: { value: '96%',      variant: 'green' },
    duration: { value: '00:51:09', variant: 'green' },
    calls: 10,
  },
];

/* ── Badge ── */
const BADGE_STYLES = {
  green:  'bg-[rgba(52,176,180,0.1)] text-[#44605e]',
  orange: 'bg-[rgba(255,122,0,0.08)] text-[#ff7678]',
  ruby:   'bg-[rgba(255,95,124,0.1)] text-[#ff5f7c]',
};
function Badge({ value, variant }) {
  return (
    <span className={`inline-flex items-center justify-center px-5 py-[7px] rounded-full text-[13px] font-medium whitespace-nowrap ${BADGE_STYLES[variant]}`}>
      {value}
    </span>
  );
}

/* ── Avatar ── */
function Avatar({ initials }) {
  return (
    <div className="flex items-center justify-center shrink-0 size-[40px] rounded-full bg-[#e0eefe]">
      <span className="text-[16px] font-medium text-[#0055a3] tracking-[-0.18px]">{initials}</span>
    </div>
  );
}

/* ── Checkbox ── */
function Checkbox({ checked, onChange }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 size-[18px] rounded-[4px] border border-[#888] bg-white cursor-pointer"
      onClick={onChange}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 3.5L3.8 6.5L9 1" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* ── Table Header ── */
function SortIcon({ active, dir }) {
  if (!active) return <ChevronsUpDown size={12} strokeWidth={1.75} className="text-[#bbb] shrink-0" />;
  if (dir === 'asc')  return <ChevronUp   size={12} strokeWidth={2}    className="text-[#555] shrink-0" />;
  return                     <ChevronDown size={12} strokeWidth={2}    className="text-[#555] shrink-0" />;
}

function ColHeader({ label, width, flex = false, centered = true, sortKey, activeSortKey, sortDir, onSort }) {
  const sortable = !!sortKey && !!onSort;
  const isActive = sortable && activeSortKey === sortKey;
  return (
    <div
      className={`h-[44px] flex items-center gap-[4px] ${flex ? 'flex-1 min-w-0' : 'shrink-0'} ${centered ? 'justify-center' : ''} px-[10px] text-[12px] font-medium whitespace-nowrap select-none ${
        sortable ? 'cursor-pointer text-[#777] hover:text-[#444] transition-colors' : 'text-[#777]'
      } ${isActive ? 'text-[#444]' : ''}`}
      style={flex ? undefined : { width }}
      onClick={sortable ? () => onSort(sortKey) : undefined}
    >
      {label}
      {sortable && <SortIcon active={isActive} dir={sortDir} />}
    </div>
  );
}

/* ── Sort helper ── */
function memberSortVal(m, key) {
  switch (key) {
    case 'name':    return m.name;
    case 'role':    return m.role;
    case 'callAdh': return parseFloat(m.callAdh.value) || 0;
    case 'noteAdh': return parseFloat(m.noteAdh.value) || 0;
    case 'pace':    return parseFloat(m.pace.value) || 0;
    case 'listen':  return parseFloat(m.listen.value) || 0;
    case 'calls':   return m.calls;
    default:        return '';
  }
}

/* ── Table Row ── */
function MemberRow({ member, checked, onCheck, onSelect }) {
  return (
    <div
      onClick={() => onSelect(member)}
      className="flex items-center justify-between px-[10px] py-[18px] border-b border-[#ebebeb] hover:bg-white transition-colors cursor-pointer group"
    >
      {/* Checkbox — stop propagation so clicking it doesn't open member page */}
      <div
        className="shrink-0 w-[20px] flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); onCheck(); }}
      >
        <Checkbox checked={checked} onChange={() => {}} />
      </div>

      {/* Provider */}
      <div className="shrink-0 w-[220px] flex items-center gap-2 px-[10px]">
        <Avatar initials={member.initials} />
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[#020817] leading-[18px] whitespace-nowrap">{member.name}</span>
          <span className="text-[12px] text-[#777] leading-[18px] whitespace-nowrap">{member.dept}</span>
        </div>
      </div>

      {/* Role */}
      <div className="flex-1 min-w-0 px-[10px]">
        <span className="text-[13px] text-[#777] whitespace-nowrap">{member.role}</span>
      </div>

      <div className="flex-1 min-w-0" />

      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <Badge {...member.callAdh} />
      </div>
      <div className="shrink-0 w-[120px] flex items-center justify-center">
        <Badge {...member.noteAdh} />
      </div>
      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <Badge {...member.pace} />
      </div>
      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <Badge {...member.listen} />
      </div>
      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <span className="text-[13px] font-medium text-[#555] text-center">{member.calls}</span>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function TeamPage({ onSelectMember }) {
  const [search, setSearch]   = useState('');
  const [checked, setChecked] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.dept.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = memberSortVal(a, sortKey);
        const bv = memberSortVal(b, sortKey);
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const toggleCheck = (name) =>
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }));

  const allChecked = sorted.length > 0 && sorted.every((m) => checked[m.name]);
  const toggleAll = () => {
    if (allChecked) {
      setChecked((prev) => {
        const next = { ...prev };
        sorted.forEach((m) => { next[m.name] = false; });
        return next;
      });
    } else {
      setChecked((prev) => {
        const next = { ...prev };
        sorted.forEach((m) => { next[m.name] = true; });
        return next;
      });
    }
  };

  const sh = { activeSortKey: sortKey, sortDir, onSort: handleSort };

  return (
    <div className="flex flex-col flex-1 px-10 py-[30px] gap-5">
      {/* Header row */}
      <div className="flex items-center gap-[10px] w-full">
        <div className="flex items-center pr-5">
          <h1 className="text-2xl font-medium text-[#444] whitespace-nowrap">Team</h1>
        </div>
        <FilterButton icon={Funnel} label="All members" />
        <FilterButton icon={Funnel} label="Status" />
        <div className="flex-1" />
        <span className="text-[14px] font-normal text-[#778393] tracking-[-0.18px] px-[10px] whitespace-nowrap">
          154 team members
        </span>
        <FilterButton icon={UserPlus} label="Add members" />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[10px] border-b border-[#ebebeb]">
          <div className="shrink-0 w-[20px] h-[44px] flex items-center justify-center">
            <Tooltip label="Select All" side="bottom">
              <div><Checkbox checked={allChecked} onChange={toggleAll} /></div>
            </Tooltip>
          </div>
          <div
            className="shrink-0 w-[220px] h-[44px] flex items-center gap-[5px] px-[10px] cursor-pointer select-none hover:text-[#444] transition-colors"
            onClick={() => handleSort('name')}
          >
            <span className={`text-[12px] font-medium tracking-[-0.18px] whitespace-nowrap ${sortKey === 'name' ? 'text-[#444]' : 'text-[#555]'}`}>Provider</span>
            <SortIcon active={sortKey === 'name'} dir={sortDir} />
          </div>
          <ColHeader label="Role" flex centered={false} sortKey="role" {...sh} />
          <ColHeader label="Call Adherence" width="100px" sortKey="callAdh" {...sh} />
          <ColHeader label="Note Adherence" width="120px" sortKey="noteAdh" {...sh} />
          <ColHeader label="Pace"           width="100px" sortKey="pace"    {...sh} />
          <ColHeader label="Listen"         width="100px" sortKey="listen"  {...sh} />
          <ColHeader label="Calls"          width="100px" sortKey="calls"   {...sh} />
        </div>

        {/* Body */}
        <div>
          {sorted.map((member) => (
            <MemberRow
              key={member.name}
              member={member}
              checked={!!checked[member.name]}
              onCheck={() => toggleCheck(member.name)}
              onSelect={onSelectMember}
            />
          ))}
          {sorted.length === 0 && (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#9b9ba7]">
              No members match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
