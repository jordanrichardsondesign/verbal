/**
 * Shared page-level control components.
 * Canonical style reference: the "Status" filter button.
 *   h-[42px] · px-[14px] · rounded-lg · border border-[#ebebeb] · bg-white
 *   text-[12px] font-medium text-[#555] · icon text-[#555] 16px
 */
import { Search } from 'lucide-react';

/* ── Filter button — icon + label ── */
export function FilterButton({ icon: Icon, label, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[6px] h-[42px] px-[14px] rounded-lg border border-[#ebebeb] bg-white text-[12px] font-medium text-[#555] whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors ${
        active ? 'border-[#34b0b4]' : ''
      }`}
    >
      {Icon && <Icon size={16} strokeWidth={1.75} className="text-[#555] shrink-0" />}
      {label}
      {children}
    </button>
  );
}

/* ── Search input ── */
export function SearchInput({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="relative flex items-center">
      <Search
        size={14}
        strokeWidth={1.75}
        className="absolute left-[14px] text-[#555] pointer-events-none shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[42px] w-[240px] pl-[36px] pr-[14px] bg-white rounded-lg border border-[#ebebeb] text-[12px] font-medium text-[#555] placeholder:text-[#aaa] placeholder:font-medium outline-none focus:border-[#34b0b4] transition-colors"
      />
    </div>
  );
}
