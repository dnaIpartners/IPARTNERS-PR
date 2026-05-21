import React from 'react';
import { PRHistoryItem } from '../types';
import { Clock, Trash2, X, FileText, FileSignature } from 'lucide-react';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: PRHistoryItem[];
  currentTab: 'press-release' | 'copywriting' | string;
  onLoadItem: (item: PRHistoryItem) => void;
  onDeleteItem: (id: string, e: React.MouseEvent) => void;
}

export default function HistoryPanel({ 
  isOpen, 
  onClose, 
  history, 
  currentTab, 
  onLoadItem, 
  onDeleteItem 
}: HistoryPanelProps) {
  if (!isOpen) return null;

  // Filter history based on current tab
  const filteredHistory = history.filter(item => {
    if (currentTab === 'press-release') {
      return item.type === 'press-release' || !item.type; // Backward compatibility
    } else if (currentTab === 'copywriting') {
      return item.type === 'copywriting';
    }
    return false;
  });

  return (
    <div className="w-[300px] border-r border-gray-200 dark:border-[#1E1E1E] bg-[#FAFAF9] dark:bg-[#090909] flex flex-col h-full animate-slide-in shrink-0 transition-all duration-200">
      <div className="p-5 border-b border-gray-200 dark:border-[#1E1E1E] flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#7C3AED] dark:text-[#C084FC] flex items-center gap-2">
          <Clock size={14} />이전 생성내역
        </h3>
        <button 
          onClick={onClose}
          className="p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1C1C1D] hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="p-3 bg-gray-100 dark:bg-[#111] rounded-full text-gray-300 dark:text-[#333] mb-3">
              {currentTab === 'press-release' ? <FileText size={20} /> : <FileSignature size={20} />}
            </span>
            <p className="text-xs text-gray-400 dark:text-[#555] font-medium leading-relaxed">
              최근 생성한 내역이 없습니다.<br />새로운 초안을 작성해보세요.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div 
              key={item.id}
              onClick={() => onLoadItem(item)}
              className="group p-3 border border-gray-200 dark:border-[#1E1E1E] bg-white dark:bg-[#0D0D0D] hover:border-[#7C3AED]/50 dark:hover:border-[#7C3AED]/50 rounded-lg cursor-pointer transition-all flex flex-col gap-1.5 shadow-sm hover:shadow-[0_4px_12px_rgba(124,58,237,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] bg-[#7C3AED]/5 dark:bg-[#7C3AED]/10 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {item.type === 'copywriting' ? '카피라이팅' : '보도자료'}
                </span>
                <button
                  onClick={(e) => onDeleteItem(item.id, e)}
                  aria-label="삭제"
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded bg-gray-50 hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p className="text-xs font-bold text-gray-800 dark:text-neutral-100 line-clamp-2 leading-relaxed transition-colors group-hover:text-[#7C3AED]">
                {item.title}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-[#666] tracking-wider font-semibold">
                {item.date}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
