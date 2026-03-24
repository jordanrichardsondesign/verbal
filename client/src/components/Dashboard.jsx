import { Funnel, Calendar } from 'lucide-react';

function FilterButton({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex items-center gap-0.5 h-[46px] px-[14px] py-2 rounded-lg border border-light-stroke text-xs font-medium text-dark-grey-5 whitespace-nowrap cursor-pointer transition-colors hover:bg-gray-50 ${
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

export default function Dashboard() {
  return (
    <div className="flex flex-col flex-1 px-10 py-[30px]">
      {/* Header row */}
      <div className="flex items-center gap-[10px] w-full">
        <div className="flex items-center pr-5">
          <h1 className="text-2xl font-medium text-dark-grey-4 whitespace-nowrap">
            Dashboard
          </h1>
        </div>

        <FilterButton icon={Funnel} label="All Calls (356)" />
        <FilterButton icon={Funnel} label="Status" />

        <div className="flex-1" />

        <FilterButton icon={Calendar} label="This month" />
      </div>

      {/* Content area placeholder */}
      <div className="flex-1 mt-8" />
    </div>
  );
}
