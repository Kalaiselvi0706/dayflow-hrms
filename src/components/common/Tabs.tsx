import React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex border-b border-[#464554]/30 ${className}`}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-all relative top-[2px] ${
              isActive
                ? 'border-[#8083ff] text-white'
                : 'border-transparent text-[#908fa0] hover:text-[#e2e2eb]'
            }`}
          >
            {item.icon && (
              <span className="material-symbols-outlined text-base">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
