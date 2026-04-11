import { Bell } from 'lucide-react';

export default function TopNav({ user = { name: 'Jonathan Doe', role: 'Manager', initials: 'JD' } }) {
  return (
    <header className="flex items-center justify-end gap-[30px] h-[80px] px-10 bg-pale-white border-b border-[#ebebeb] shrink-0 w-full">
      {/* Notification bell */}
      <button className="relative flex items-center justify-center size-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
        <span className="absolute top-[6px] right-[6px] size-2 rounded-full bg-ruby z-10" />
        <Bell size={16} className="text-dark-grey-5" strokeWidth={1.75} />
      </button>

      {/* User */}
      <div className="flex items-center gap-0">
        <div className="flex items-center justify-center size-8 rounded-full bg-[#616d89] overflow-hidden shrink-0">
          <span className="text-white text-sm font-semibold tracking-wide">{user.initials}</span>
        </div>
        <div className="flex flex-col items-start pl-2">
          <span className="text-[13px] font-medium text-[#555] leading-tight whitespace-nowrap tracking-[-0.011em]">
            {user.name}
          </span>
          <span className="text-[10px] text-[#64748b] leading-tight">
            {user.role}
          </span>
        </div>
      </div>
    </header>
  );
}
