import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, 
  PenTool, 
  Sun, 
  Moon,
  Feather,
  Monitor,
  Check
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'press-release' | 'copywriting' | string;
  onTabChange: (tab: 'press-release' | 'copywriting' | string) => void;
  theme: 'light' | 'dark' | 'system';
  onChangeTheme: (theme: 'light' | 'dark' | 'system') => void;
  isSystemDark: boolean;
  recheckSystemDark?: () => void;
  onLogoClick?: () => void;
}

export default function Sidebar({ currentTab, onTabChange, theme, onChangeTheme, isSystemDark, recheckSystemDark, onLogoClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && recheckSystemDark) {
      recheckSystemDark();
    }
  }, [isOpen, recheckSystemDark]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'press-release', label: '보도자료', icon: Megaphone, active: true }, 
    { id: 'copywriting', label: '카피라이팅', icon: PenTool, active: true },
   
  ];

  return (
    <aside className="w-[100px] bg-[#FAF9F6] dark:bg-[#070707] flex flex-col shrink-0 border-r border-gray-200 dark:border-[#1E1E1E] transition-colors duration-200 text-center select-none">
      {/* Brand Logo Area */}
      <div 
        className="py-6 border-b border-gray-200 dark:border-[#1E1E1E] flex flex-col items-center justify-center gap-1 cursor-pointer transition-opacity hover:opacity-80"
        onClick={onLogoClick}
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 shadow-md">
          <img 
            src="/src/assets/images/ipartners_pr_ai_logo_1779364022084.png" 
            alt="Logo" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-[11px] font-black tracking-tight text-gray-900 dark:text-neutral-200 mt-1 uppercase block leading-tight">
          IPARTNERS<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#3B82F6]">NX Agent</span>
        </span>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-1 space-y-1.5 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full py-4 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-200 cursor-pointer group ${
                isSelected 
                  ? 'bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#1A1A1A] dark:to-[#222] text-gray-950 dark:text-white shadow-sm border-r-4 border-[#7C3AED]' 
                  : 'text-gray-500 dark:text-[#888] hover:bg-gray-100/50 dark:hover:bg-[#111] hover:text-gray-900 dark:hover:text-neutral-300'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform duration-200 group-hover:scale-110 ${
                isSelected ? 'text-[#7C3AED] dark:text-[#C084FC]' : ''
              }`}>
                <Icon size={20} strokeWidth={2.1} />
              </div>
              <span className={`text-[10px] font-bold ${
                isSelected ? 'text-gray-900 dark:text-neutral-100 font-extrabold' : 'text-gray-500 dark:text-[#888]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Utility Area */}
      <div className="py-4 border-t border-gray-200 dark:border-[#1E1E1E] flex justify-center relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2.5 rounded-lg transition-all cursor-pointer ${
            isOpen 
              ? 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white' 
              : 'text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#111]'
          }`}
          title="테마 설정"
        >
          {theme === 'light' ? (
            <Sun size={15} />
          ) : theme === 'dark' ? (
            <Moon size={15} />
          ) : (
            <Monitor size={15} />
          )}
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-4 mb-2 w-48 bg-white dark:bg-[#0C0C0C] border border-gray-200/80 dark:border-zinc-800/80 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 select-none text-left">
            {/* 1. Light Mode */}
            <button
              onClick={() => {
                onChangeTheme('light');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Sun size={15} className="text-gray-400 dark:text-neutral-500 shrink-0" />
                <span className="truncate">Light Mode</span>
              </div>
              {theme === 'light' && (
                <Check size={14} className="text-[#FF4A22] stroke-[2.5] shrink-0 ml-2" />
              )}
            </button>

            {/* 2. Dark Mode */}
            <button
              onClick={() => {
                onChangeTheme('dark');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Moon size={15} className="text-gray-400 dark:text-neutral-500 shrink-0" />
                <span className="truncate">Dark Mode</span>
              </div>
              {theme === 'dark' && (
                <Check size={14} className="text-[#FF4A22] stroke-[2.5] shrink-0 ml-2" />
              )}
            </button>

            {/* 3. System Theme */}
            <button
              onClick={() => {
                onChangeTheme('system');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Monitor size={15} className="text-gray-400 dark:text-neutral-500 shrink-0" />
                <span className="truncate">
                  System <span className="text-gray-400 dark:text-neutral-500 text-[10px] font-normal">({isSystemDark ? 'Dark' : 'Light'})</span>
                </span>
              </div>
              {theme === 'system' && (
                <Check size={14} className="text-[#FF4A22] stroke-[2.5] shrink-0 ml-2" />
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
