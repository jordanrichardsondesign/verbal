import * as RadixTooltip from '@radix-ui/react-tooltip';

/* Wrap the entire app once at the root — but we also export Provider here
   so it can be used standalone in App.jsx */
export function TooltipProvider({ children }) {
  return (
    <RadixTooltip.Provider delayDuration={400} skipDelayDuration={100}>
      {children}
    </RadixTooltip.Provider>
  );
}

/* ── Main Tooltip wrapper ──
   Usage:
     <Tooltip label="Exit">
       <button>...</button>
     </Tooltip>
*/
export default function Tooltip({ label, side = 'bottom', children }) {
  if (!label) return children;
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className="z-[300] select-none outline-none"
        >
          {/* Dark pill */}
          <div className="flex items-center justify-center px-[8px] py-[5px] rounded-[4px] bg-[#020817] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.14)]">
            <span className="text-[10px] font-semibold text-white whitespace-nowrap leading-normal">
              {label}
            </span>
          </div>
          {/* Arrow */}
          <RadixTooltip.Arrow
            width={10}
            height={5}
            className="fill-[#020817]"
          />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
