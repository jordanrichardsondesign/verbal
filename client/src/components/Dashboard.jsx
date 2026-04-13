import { useState } from 'react';
import { Funnel } from 'lucide-react';
import DashboardHeroGroup from './DashboardHeroGroup';
import DashboardSecondRow from './DashboardSecondRow';
import StatRow from './StatRow';
import DashboardActionRow from './DashboardActionRow';
import DateRangePicker from './DateRangePicker';
import ChecklistPicker from './ChecklistPicker';
import ProviderPicker from './ProviderPicker';
import PatientPicker from './PatientPicker';

function FilterButton({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex items-center gap-0.5 h-[42px] px-[14px] py-2 rounded-lg border border-light-stroke text-xs font-medium text-dark-grey-5 whitespace-nowrap cursor-pointer transition-colors hover:bg-gray-50 ${
        active ? 'bg-white' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-center size-[30px]">
        <Icon size={16} strokeWidth={1.75} className="text-dark-grey-5" />
      </div>
      {label}
    </button>
  );
}

export default function Dashboard({ onNavigate }) {
  const [activePeriod, setActivePeriod] = useState('1W');

  return (
    <div className="flex flex-col flex-1 px-10 py-[30px] gap-3 [container-type:inline-size]">
      {/* Header row */}
      <div className="flex items-center gap-[10px] w-full">
        <div className="flex items-center pr-5">
          <h1 className="text-2xl font-medium text-dark-grey-4 whitespace-nowrap">
            Dashboard
          </h1>
        </div>

        <ChecklistPicker />
        <FilterButton icon={Funnel} label="Status" />
        <ProviderPicker />
        <PatientPicker />

        <div className="flex-1" />

        <DateRangePicker activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
      </div>

      {/* Hero group — chart + missed items */}
      <DashboardHeroGroup period={activePeriod} />

      {/* Second row — avg call duration + checklist coverage */}
      <DashboardSecondRow />

      {/* Stat row — team performance highlights */}
      <StatRow />

      {/* Action row — what to act on + coaching roster */}
      <DashboardActionRow onNavigate={onNavigate} />
    </div>
  );
}
