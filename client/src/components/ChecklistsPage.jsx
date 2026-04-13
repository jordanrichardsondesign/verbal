import { useState } from 'react';
import { Plus, Search, ListChecks, CircleCheckBig, PenLine } from 'lucide-react';
import Tooltip from './Tooltip';

/* ── Shared badge — same variants as TeamPage ── */
const BADGE_STYLES = {
  green:   'bg-[rgba(52,176,180,0.1)] text-[#44605e]',
  orange:  'bg-[rgba(255,122,0,0.08)] text-[#ff7678]',
  ruby:    'bg-[rgba(255,95,124,0.1)] text-[#ff5f7c]',
};

function Badge({ value, variant }) {
  if (!variant) {
    return <span className="text-[13px] font-medium text-[#888]">–</span>;
  }
  return (
    <span className={`inline-flex items-center justify-center px-5 py-[7px] rounded-full text-[13px] font-medium whitespace-nowrap ${BADGE_STYLES[variant]}`}>
      {value}
    </span>
  );
}

/* ── Shared checkbox — same as TeamPage ── */
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

/* ── Status dot ── */
function StatusDot({ status }) {
  return (
    <div className="flex items-center gap-[6px]">
      <div
        className="shrink-0 size-[8px] rounded-full"
        style={{ backgroundColor: status === 'Active' ? '#34b0b4' : '#9b9ba7' }}
      />
      <span className="text-[13px] text-[#777] whitespace-nowrap">{status}</span>
    </div>
  );
}

/* ── Edit button ── */
function EditBtn() {
  return (
    <button className="flex items-center justify-center shrink-0 size-[40px] rounded-[5px] text-[#9b9ba7] hover:text-[#555] hover:bg-[#f7f7f8] transition-colors cursor-pointer">
      <PenLine size={15} strokeWidth={1.75} />
    </button>
  );
}

/* ── Data ── */
const CHECKLISTS = [
  {
    id: 1,
    name: 'Behavioral Health Follow-up',
    status: 'Active',
    added: '03/12/2025',
    adherence: { value: '76%', variant: 'green' },
    actions: [
      { label: 'Perform HIPAA verification',          adherence: { value: '70%', variant: 'green'  } },
      { label: 'Review their condition',              adherence: { value: '84%', variant: 'green'  } },
      { label: 'Review discharge instructions',       adherence: { value: '94%', variant: 'green'  } },
      { label: 'Inquire about barriers',              adherence: { value: '33%', variant: 'ruby'   } },
      { label: 'Medication review',                   adherence: { value: '100%', variant: 'green' } },
      { label: 'Review items needed post discharge',  adherence: { value: '96%', variant: 'green'  } },
      { label: 'Schedule next follow-up or check-in', adherence: { value: '62%', variant: 'orange' } },
    ],
  },
  {
    id: 2,
    name: 'Chronic Condition Management Weekly Check In',
    status: 'Draft',
    added: '03/12/2025',
    adherence: null,
    actions: [
      { label: 'Perform HIPAA verification',   adherence: null },
      { label: 'Review their condition',       adherence: null },
      { label: 'Review discharge instructions', adherence: null },
      { label: 'Medication reconciliation',    adherence: null },
      { label: 'Inquire about barriers',       adherence: null },
    ],
  },
];

/* ── Column layout constants (must match header + rows) ── */
const COL = {
  checkbox:   20,
  name:       250,
  status:     90,
  added:      100,
  adherence:  100,
  edit:       40,
};

/* ── Checklist group header row ── */
function ChecklistRow({ checklist, checked, onCheck }) {
  return (
    <div className="flex items-center justify-between px-[10px] py-[22px] bg-[#f1f4f4]">
      {/* Checkbox */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.checkbox }}>
        <Checkbox checked={checked} onChange={onCheck} />
      </div>

      {/* Name with icon */}
      <div className="shrink-0 flex items-center gap-2 px-[10px]" style={{ width: COL.name }}>
        <ListChecks size={15} strokeWidth={1.75} className="text-[#777] shrink-0" />
        <span className="text-[13px] font-medium text-[#777] leading-tight">{checklist.name}</span>
      </div>

      {/* Flex gap */}
      <div className="flex-1 min-w-0" />

      {/* Status */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.status }}>
        <StatusDot status={checklist.status} />
      </div>

      {/* Date Added */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.added }}>
        <span className="text-[13px] text-[#777] whitespace-nowrap">{checklist.added}</span>
      </div>

      {/* Call Adherence */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.adherence }}>
        {checklist.adherence
          ? <Badge {...checklist.adherence} />
          : <span className="text-[13px] font-medium text-[#888]">–</span>
        }
      </div>

      {/* Edit */}
      <div className="shrink-0" style={{ width: COL.edit }}>
        <EditBtn />
      </div>
    </div>
  );
}

/* ── Action item sub-row ── */
function ActionRow({ action, checked, onCheck }) {
  return (
    <div className="flex items-center justify-between px-[10px] py-[10px] border-b border-[#ebebeb] hover:bg-white transition-colors">
      {/* Checkbox */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.checkbox }}>
        <Checkbox checked={checked} onChange={onCheck} />
      </div>

      {/* Label — indented with icon */}
      <div className="shrink-0 flex items-center gap-[10px] pl-[20px] pr-[10px]" style={{ width: COL.name }}>
        <CircleCheckBig size={14} strokeWidth={1.75} className="text-[#9b9ba7] shrink-0" />
        <span className="text-[13px] font-medium text-[#777] leading-tight">{action.label}</span>
      </div>

      {/* Flex gap */}
      <div className="flex-1 min-w-0" />

      {/* Status — empty for action rows */}
      <div className="shrink-0" style={{ width: COL.status }} />

      {/* Added — empty for action rows */}
      <div className="shrink-0" style={{ width: COL.added }} />

      {/* Call Adherence */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: COL.adherence }}>
        <Badge {...(action.adherence ?? {})} variant={action.adherence?.variant} value={action.adherence?.value} />
      </div>

      {/* Edit */}
      <div className="shrink-0" style={{ width: COL.edit }}>
        <EditBtn />
      </div>
    </div>
  );
}

/* ── Page ── */
export default function ChecklistsPage() {
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState({});

  const toggle = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const filtered = CHECKLISTS.filter((cl) =>
    cl.name.toLowerCase().includes(search.toLowerCase()) ||
    cl.actions.some((a) => a.label.toLowerCase().includes(search.toLowerCase()))
  );

  const allVisibleKeys = filtered.flatMap((cl) => [
    `cl-${cl.id}`,
    ...cl.actions.map((_, i) => `action-${cl.id}-${i}`),
  ]);
  const allChecked = allVisibleKeys.length > 0 && allVisibleKeys.every((k) => checked[k]);
  const toggleAll = () => {
    if (allChecked) {
      setChecked((prev) => {
        const next = { ...prev };
        allVisibleKeys.forEach((k) => { next[k] = false; });
        return next;
      });
    } else {
      setChecked((prev) => {
        const next = { ...prev };
        allVisibleKeys.forEach((k) => { next[k] = true; });
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 px-10 py-[30px] gap-5">
      {/* Header */}
      <div className="flex items-center gap-[6px] w-full">
        <div className="flex items-center pr-5">
          <h1 className="text-2xl font-medium text-[#444] whitespace-nowrap">Checklists</h1>
        </div>

        <div className="flex-1" />

        {/* Add Checklist */}
        <button className="flex items-center gap-0.5 h-[42px] px-[14px] py-2 rounded-lg border border-[#ebebeb] bg-white text-[12px] font-medium text-[#555] whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center size-[30px]">
            <Plus size={16} strokeWidth={1.75} className="text-[#555]" />
          </div>
          Add Checklist
        </button>

        {/* Search */}
        <div className="relative flex items-center">
          <Search size={14} strokeWidth={1.75} className="absolute left-4 text-[#778393] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search checklists"
            className="h-[42px] w-[287px] pl-9 pr-4 bg-white rounded-lg border border-[#ebebeb] text-[14px] font-medium text-[#020817] placeholder:text-[#778393] placeholder:font-medium outline-none focus:border-[#34b0b4] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[10px] border-b border-[#ebebeb]">
          {/* Select-all checkbox */}
          <div className="shrink-0 h-[44px] flex items-center justify-center" style={{ width: COL.checkbox }}>
            <Tooltip label="Select All" side="bottom">
              <div><Checkbox checked={allChecked} onChange={toggleAll} /></div>
            </Tooltip>
          </div>

          {/* Checklist/Action */}
          <div className="shrink-0 h-[44px] flex items-center px-[10px]" style={{ width: COL.name }}>
            <span className="text-[12px] font-medium text-[#777] tracking-[-0.18px] whitespace-nowrap">Checklist / Action</span>
          </div>

          {/* Flex gap */}
          <div className="flex-1 min-w-0" />

          {/* Status */}
          <div className="shrink-0 h-[44px] flex items-center justify-center px-[10px]" style={{ width: COL.status }}>
            <span className="text-[12px] font-medium text-[#777] whitespace-nowrap">Status</span>
          </div>

          {/* Added */}
          <div className="shrink-0 h-[44px] flex items-center justify-center px-[10px]" style={{ width: COL.added }}>
            <span className="text-[12px] font-medium text-[#555] whitespace-nowrap">Added</span>
          </div>

          {/* Call Adherence */}
          <div className="shrink-0 h-[44px] flex items-center justify-center px-[10px]" style={{ width: COL.adherence }}>
            <span className="text-[12px] font-medium text-[#777] whitespace-nowrap">Call Adherence</span>
          </div>

          {/* Edit spacer */}
          <div className="shrink-0" style={{ width: COL.edit }} />
        </div>

        {/* Body */}
        <div>
          {filtered.map((checklist) => (
            <div key={checklist.id}>
              <ChecklistRow
                checklist={checklist}
                checked={!!checked[`cl-${checklist.id}`]}
                onCheck={() => toggle(`cl-${checklist.id}`)}
              />
              {checklist.actions.map((action, i) => (
                <ActionRow
                  key={i}
                  action={action}
                  checked={!!checked[`action-${checklist.id}-${i}`]}
                  onCheck={() => toggle(`action-${checklist.id}-${i}`)}
                />
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#9b9ba7]">
              No checklists match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
