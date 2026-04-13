import { useState } from 'react';
import { TriangleAlert, Clock } from 'lucide-react';

/* ── What to Act On ── */
const ACTION_ITEMS = [
  {
    icon: 'alert',
    title: 'HIPAA verification was missed on 8 calls yesterday',
    description: 'Up from 2/day avg last week. 5 of these were Kevin R. - this is a pattern, not a one-off.',
    tag: { label: 'Checklist gap', variant: 'neutral' },
  },
  {
    icon: 'alert',
    title: '"Discuss gaps in care" missed 37% of the time — up from 22% last week',
    description: "This is the #1 missed item and it's getting worse. 6 users are contributing, but Sarah M. accounts for the biggest single drop.",
    tag: { label: 'Checklist gap', variant: 'neutral' },
  },
  {
    icon: 'clock',
    title: '8 calls this week fell below the 5-minute billing threshold',
    description: 'Short calls may not qualify for reimbursement. Marcus J. (3), Nina L. (2), and Kevin R. (2) account for most. Review call content to confirm completeness.',
    tag: { label: 'Billing risk', variant: 'ruby' },
  },
];

function ActionIcon({ type }) {
  const isAlert = type === 'alert';
  return (
    <div
      className={`flex items-center justify-center rounded-lg shrink-0 size-[36px] ${
        isAlert ? 'bg-[#fef2f2]' : 'bg-[rgba(255,95,124,0.1)]'
      }`}
    >
      {isAlert ? (
        <TriangleAlert size={16} strokeWidth={1.75} className="text-[#ff5f7c]" />
      ) : (
        <Clock size={16} strokeWidth={1.75} className="text-[#ff5f7c]" />
      )}
    </div>
  );
}

function TagPill({ label, variant }) {
  return variant === 'ruby' ? (
    <span className="inline-flex items-center px-[9px] py-[2px] rounded-full bg-[rgba(255,95,124,0.1)] text-[11.5px] font-medium text-[#ff5f7c] whitespace-nowrap">
      {label}
    </span>
  ) : (
    <span className="inline-flex items-center px-[9px] py-[2px] rounded-full bg-[#f7f7f8] text-[11.5px] font-medium text-[#6b6b76] whitespace-nowrap">
      {label}
    </span>
  );
}

function WhatToActOn() {
  return (
    <div className="dashboard-action-left bg-white rounded-lg p-[30px] flex flex-col gap-[10px] flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9b9ba7]">
          What to act on
        </span>
        <span className="flex items-center justify-center px-[9px] py-[3px] rounded-full bg-[#ff5f7c] text-[11px] font-semibold text-white tracking-[0.5px] uppercase leading-none">
          3
        </span>
      </div>

      {/* Alert cards */}
      {ACTION_ITEMS.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-[12px] p-[20px] bg-white border border-[#e8e8ec] rounded-lg"
        >
          <ActionIcon type={item.icon} />

          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#1a1a1a] leading-[1.4]">{item.title}</p>
            <p className="text-[13px] font-normal text-[#6b6b76] leading-[1.5]">{item.description}</p>
            <div className="pt-[6px]">
              <TagPill {...item.tag} />
            </div>
          </div>

          <div className="shrink-0 w-[93px] flex items-start justify-center pt-[2px]">
            <button className="w-full flex items-center justify-center px-[15px] py-[8px] bg-white border border-[#e8e8ec] rounded-[6px] text-[13px] font-medium text-[#1a1a1a] whitespace-nowrap hover:bg-gray-50 transition-colors cursor-pointer">
              View calls
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Coaching Roster ── */
const TABS = [
  { key: 'below', label: 'Below goal', count: 5 },
  { key: 'improving', label: 'Improving', count: 2 },
  { key: 'above', label: 'Above goal', count: 9 },
];

const ROSTER = {
  below: [
    { initials: 'NL', name: 'Nina Lopez',      description: 'Missed 4 of 5 checklist items on avg',    score: '58%', prev: 'was 75%' },
    { initials: 'SM', name: 'Sarah Mitchell',   description: 'Missed "Gaps in care" on 6 of 8 calls',   score: '62%', prev: 'was 84%' },
    { initials: 'KR', name: 'Kevin Rodriguez',  description: 'HIPAA verification missed on 5 calls',     score: '68%', prev: 'was 81%' },
    { initials: 'PD', name: 'Priya Desai',      description: 'Low note adherence — 52% this week',       score: '70%', prev: 'was 82%' },
    { initials: 'MJ', name: 'Marcus Johnson',   description: 'Speaking pace high — 168 WPM avg',         score: '76%', prev: 'was 78%' },
  ],
  improving: [
    { initials: 'BR', name: 'Brian Kim',        description: 'Note adherence up to 88% this week',       score: '88%', prev: 'was 71%' },
    { initials: 'JP', name: 'Joanne Park',      description: 'Checklist coverage improved to 91%',        score: '91%', prev: 'was 79%' },
  ],
  above: [
    { initials: 'SS', name: 'Stephanie S.',     description: '100% call adherence this week',             score: '100%', prev: 'was 98%' },
  ],
};

function Avatar({ initials }) {
  return (
    <div className="flex items-center justify-center shrink-0 size-[32px] rounded-full bg-[#ff5f7c]">
      <span className="text-[12px] font-semibold text-white">{initials}</span>
    </div>
  );
}

function CoachingRoster({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('below');
  const agents = ROSTER[activeTab] ?? [];

  return (
    <div className="dashboard-action-right bg-white rounded-lg p-[30px] flex flex-col flex-1 min-w-0 self-stretch">
      {/* Header */}
      <div className="flex items-start justify-between w-full mb-3">
        <div className="flex flex-col gap-[2px]">
          <span className="text-[15px] font-semibold text-[#020817]">Coaching Roster</span>
          <span className="text-[12px] text-[#9b9ba7]">Based on this week's calls</span>
        </div>
        <button
          onClick={() => onNavigate('Team')}
          className="text-[13px] font-medium text-[#555] hover:text-[#333] transition-colors cursor-pointer whitespace-nowrap"
        >
          View all
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-end border-b border-[#e8e8ec] w-full mb-2">
        {TABS.map(({ key, label, count }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-[6px] px-4 py-[12px] text-[13px] whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-px ${
                active
                  ? 'border-[#020817] font-semibold text-[#020817]'
                  : 'border-transparent font-medium text-[#9b9ba7] hover:text-[#555]'
              }`}
            >
              {label}
              <span
                className={`text-[11px] font-semibold px-[6px] py-px rounded-full ${
                  active
                    ? 'bg-[rgba(255,95,124,0.1)] text-[#ff5f7c]'
                    : 'bg-[#f7f7f8] text-[#9b9ba7]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Agent list */}
      <div className="flex flex-col py-2">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="flex items-center gap-3 px-2 py-[10px] rounded-lg hover:bg-[#fafafd] transition-colors"
          >
            <Avatar initials={agent.initials} />
            <div className="flex flex-col gap-px flex-1 min-w-0">
              <span className="text-[13.5px] font-medium text-[#020817] leading-normal">{agent.name}</span>
              <span className="text-[12px] text-[#777] leading-normal">{agent.description}</span>
            </div>
            <div className="flex flex-col gap-px items-end shrink-0">
              <span className="text-[14px] font-semibold text-[#ff5f7c] text-right whitespace-nowrap">{agent.score}</span>
              <span className="text-[11px] text-[#9b9ba7] text-right whitespace-nowrap">{agent.prev}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardActionRow({ onNavigate }) {
  return (
    <div className="dashboard-action-row flex flex-row gap-3 w-full">
      <WhatToActOn />
      <CoachingRoster onNavigate={onNavigate} />
    </div>
  );
}
