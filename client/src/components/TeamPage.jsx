import { useState } from 'react';
import { Funnel, UserPlus } from 'lucide-react';
import Tooltip from './Tooltip';
import { FilterButton, SearchInput } from './PageControls';

/* ── Data ── */
const MEMBERS = [
  {
    initials: 'SJ', name: 'Stephanie Jackson', dept: 'Neurology',    role: 'Counselor',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '100%', variant: 'green'   },
    pace:    { value: '135 WPM', variant: 'green' },
    listen:  { value: '56%',  variant: 'orange'  },
    calls:   13,
  },
  {
    initials: 'MK', name: 'Michael King',       dept: 'Cardiology',  role: 'Surgeon',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '56%',  variant: 'orange'  },
    pace:    { value: '150 WPM', variant: 'green' },
    listen:  { value: '70%',  variant: 'green'   },
    calls:   26,
  },
  {
    initials: 'LH', name: 'Laura Hill',         dept: 'Pediatrics',  role: 'Nurse',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '95%',  variant: 'green'   },
    pace:    { value: '140 WPM', variant: 'green' },
    listen:  { value: '80%',  variant: 'green'   },
    calls:   3,
  },
  {
    initials: 'RC', name: 'Robert Collins',     dept: 'Oncology',    role: 'Researcher',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '88%',  variant: 'green'   },
    pace:    { value: '130 WPM', variant: 'green' },
    listen:  { value: '65%',  variant: 'green'   },
    calls:   28,
  },
  {
    initials: 'AN', name: 'Alice Newton',       dept: 'Dermatology', role: 'Technician',
    callAdh: { value: '45%',  variant: 'ruby'    },
    noteAdh: { value: '46%',  variant: 'orange'  },
    pace:    { value: '160 WPM', variant: 'green' },
    listen:  { value: '90%',  variant: 'ruby'    },
    calls:   5,
  },
  {
    initials: 'HJ', name: 'Henry James',        dept: 'Orthopedics', role: 'Physician',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '85%',  variant: 'green'   },
    pace:    { value: '125 WPM', variant: 'green' },
    listen:  { value: '60%',  variant: 'green'   },
    calls:   6,
  },
  {
    initials: 'CT', name: 'Cynthia Turner',     dept: 'Gastroenterology', role: 'Specialist',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '93%',  variant: 'green'   },
    pace:    { value: '145 WPM', variant: 'green' },
    listen:  { value: '75%',  variant: 'green'   },
    calls:   7,
  },
  {
    initials: 'JP', name: 'James Peterson',     dept: 'Endocrinology', role: 'Consultant',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '90%',  variant: 'green'   },
    pace:    { value: '120 WPM', variant: 'green' },
    listen:  { value: '68%',  variant: 'green'   },
    calls:   8,
  },
  {
    initials: 'EM', name: 'Emma Matthews',      dept: 'Urology',     role: 'Therapist',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '98%',  variant: 'green'   },
    pace:    { value: '155 WPM', variant: 'green' },
    listen:  { value: '82%',  variant: 'green'   },
    calls:   9,
  },
  {
    initials: 'TW', name: 'Thomas White',       dept: 'Ophthalmology', role: 'Optometrist',
    callAdh: { value: '100%', variant: 'green'   },
    noteAdh: { value: '87%',  variant: 'green'   },
    pace:    { value: '110 WPM', variant: 'green' },
    listen:  { value: '73%',  variant: 'green'   },
    calls:   10,
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
function ColHeader({ label, width, centered = true }) {
  return (
    <div
      className={`shrink-0 h-[44px] flex items-center ${centered ? 'justify-center' : ''} px-[10px] text-[12px] font-medium text-[#777] whitespace-nowrap`}
      style={{ width }}
    >
      {label}
    </div>
  );
}

/* ── Table Row ── */
function MemberRow({ member, checked, onCheck }) {
  return (
    <div className="flex items-center justify-between px-[10px] py-[18px] border-b border-[#ebebeb] hover:bg-white transition-colors group">
      {/* Checkbox */}
      <div className="shrink-0 w-[20px] flex items-center justify-center">
        <Checkbox checked={checked} onChange={onCheck} />
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
      <div className="shrink-0 w-[100px] px-[10px]">
        <span className="text-[13px] text-[#777] whitespace-nowrap">{member.role}</span>
      </div>

      {/* Flex gap */}
      <div className="flex-1 min-w-0" />

      {/* Call Adherence */}
      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <Badge {...member.callAdh} />
      </div>

      {/* Note Adherence */}
      <div className="shrink-0 w-[120px] flex items-center justify-center">
        <Badge {...member.noteAdh} />
      </div>

      {/* Pace */}
      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <Badge {...member.pace} />
      </div>

      {/* Listen */}
      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <Badge {...member.listen} />
      </div>

      {/* Calls */}
      <div className="shrink-0 w-[100px] flex items-center justify-center">
        <span className="text-[13px] font-medium text-[#555] text-center">{member.calls}</span>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function TeamPage() {
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState({});

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.dept.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCheck = (name) =>
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }));

  const allChecked = filtered.length > 0 && filtered.every((m) => checked[m.name]);
  const toggleAll = () => {
    if (allChecked) {
      setChecked((prev) => {
        const next = { ...prev };
        filtered.forEach((m) => { next[m.name] = false; });
        return next;
      });
    } else {
      setChecked((prev) => {
        const next = { ...prev };
        filtered.forEach((m) => { next[m.name] = true; });
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 px-10 py-[30px] gap-5">
      {/* Header row */}
      <div className="flex items-center gap-[10px] w-full">
        {/* Title */}
        <div className="flex items-center pr-5">
          <h1 className="text-2xl font-medium text-[#444] whitespace-nowrap">Team</h1>
        </div>

        {/* Filter buttons */}
        <FilterButton icon={Funnel} label="All members" />
        <FilterButton icon={Funnel} label="Status" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Member count */}
        <span className="text-[14px] font-normal text-[#778393] tracking-[-0.18px] px-[10px] whitespace-nowrap">
          154 team members
        </span>

        {/* Add members */}
        <FilterButton icon={UserPlus} label="Add members" />

        {/* Search */}
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
          {/* Select-all checkbox */}
          <div className="shrink-0 w-[20px] h-[44px] flex items-center justify-center">
            <Tooltip label="Select All" side="bottom">
              <div><Checkbox checked={allChecked} onChange={toggleAll} /></div>
            </Tooltip>
          </div>

          {/* Provider header — sorted */}
          <div className="shrink-0 w-[220px] h-[44px] flex items-center gap-[5px] px-[10px]">
            <span className="text-[12px] font-medium text-[#555] tracking-[-0.18px] whitespace-nowrap">Provider</span>
          </div>

          <ColHeader label="Role" width="100px" centered={false} />

          {/* Flex gap */}
          <div className="flex-1 min-w-0" />

          <ColHeader label="Call Adherence" width="100px" />
          <ColHeader label="Note Adherence" width="120px" />
          <ColHeader label="Pace" width="100px" />
          <ColHeader label="Listen" width="100px" />
          <ColHeader label="Calls" width="100px" />
        </div>

        {/* Body */}
        <div>
          {filtered.map((member) => (
            <MemberRow
              key={member.name}
              member={member}
              checked={!!checked[member.name]}
              onCheck={() => toggleCheck(member.name)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#9b9ba7]">
              No members match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
