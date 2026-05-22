import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Wand2, Edit3, Eye } from 'lucide-react';

interface PreviewEditorProps {
  content: string;
  isGenerating: boolean;
  setContent: (val: string) => void;
  currentTab?: string;
}

export default function PreviewEditor({ content, isGenerating, setContent, currentTab }: PreviewEditorProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [refineQuery, setRefineQuery] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('클립보드에 복사되었습니다.');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '보도자료.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefine = async () => {
    if (!textareaRef.current) return;
    
    if (viewMode === 'preview') {
      alert("에디터 모드에서 수정할 부분을 드래그한 뒤 사용해주세요.");
      setViewMode('edit');
      return;
    }

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText.trim()) {
      alert('수정할 텍스트를 마우스로 드래그하여 선택해주세요.');
      return;
    }

    if (!refineQuery.trim()) {
      alert('어떻게 수정할지 지시사항을 입력해주세요. (예: 조금 더 부드럽게)');
      return;
    }

    setIsRefining(true);
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetBlock: selectedText,
          instruction: refineQuery
        })
      });

      if (!response.ok || !response.body) {
        const errText = await response.text();
        let errMsg = errText;
        try {
          const json = JSON.parse(errText);
          if (json.error) errMsg = json.error;
        } catch (e) {}
        throw new Error(errMsg || 'API Request Failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let newBlock = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        newBlock += decoder.decode(value, { stream: true });
      }

      const newContent = content.substring(0, start) + newBlock + content.substring(end);
      setContent(newContent);
      setRefineQuery('');
    } catch (e) {
      console.error(e);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsRefining(false);
    }
  };

  if (!content && !isGenerating) {
    return (
      <div className="w-full max-w-[580px] h-full shadow-2xl border border-gray-200 dark:border-[#222] flex flex-col items-center justify-center text-gray-500 dark:text-[#888] font-sans bg-white dark:bg-[#0A0A0A] transition-colors duration-200">
        <Wand2 size={48} className="mb-4 text-gray-300 dark:text-[#333]" />
        <p className="text-lg font-bold uppercase tracking-widest text-gray-400 dark:text-[#A1A1AA]">Awaiting Input</p>
        <p className="text-sm mt-2 text-gray-400 dark:text-[#888]">Enter data to generate editorial markdown</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center flex-1 min-h-0 overflow-hidden">
      <div className="w-full max-w-[580px] flex justify-between items-center mb-4 text-gray-500 dark:text-[#A1A1AA] font-sans shrink-0 transition-colors duration-200">
        <div className="flex border border-gray-200 dark:border-[#333] rounded bg-gray-100 dark:bg-[#000000] p-0.5 transition-colors duration-200">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${viewMode === 'preview' ? 'bg-white dark:bg-[#222] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-[#ECECEC]'}`}
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${viewMode === 'edit' ? 'bg-white dark:bg-[#222] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-[#ECECEC]'}`}
          >
            <Edit3 size={14} /> Editor
          </button>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleCopy} className="p-2 text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] rounded transition-colors" title="Copy">
            <Copy size={14} />
          </button>
          <button onClick={handleDownload} className="p-2 text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] rounded transition-colors" title="Download">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-[580px] h-full flex-1 shadow-2xl border border-gray-200 dark:border-[#222] flex flex-col font-serif bg-white dark:bg-[#0A0A0A] overflow-hidden relative min-h-0 transition-colors duration-200">
        {viewMode === 'preview' ? (
          <div className="p-12 overflow-y-auto flex-1 prose prose-slate dark:prose-invert max-w-none text-[15px] leading-relaxed text-gray-800 dark:text-[#D4D4D8] transition-colors duration-200">
            <ReactMarkdown
               components={{
                 h1: ({node, ...props}) => {
                   const label = currentTab === 'copywriting' ? 'AI Copywriting Pitch' : 'Immediate Release';
                   return (
                     <div className="border-b border-gray-200 dark:border-[#333] pb-4 mb-8 transition-colors duration-200">
                       <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#7C3AED]">{label}</span>
                       <h1 className="text-3xl font-bold leading-tight mt-2 text-gray-900 dark:text-white font-serif transition-colors duration-200" {...props} />
                     </div>
                   );
                 },
                 h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-[#E4E4E7] italic font-serif transition-colors duration-200" {...props} />,
                 blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#7C3AED] pl-4 py-1 my-4 bg-[#7C3AED]/10 text-gray-800 dark:text-[#D4D4D8] italic font-serif transition-colors duration-200" {...props} />,
                 p: ({node, ...props}) => {
                    const childrenArray = React.Children.toArray(props.children);
                    const hasElement = childrenArray.some(child => typeof child !== 'string' && typeof child !== 'number');
                    
                    if (!hasElement) {
                       const contentStr = childrenArray.join('');
                       if (contentStr.startsWith('[') && contentStr.includes(']')) {
                           if (contentStr.includes('[미디어 문의') || contentStr.includes('[미디어 문의처') || contentStr.includes('[회사 소개]')) {
                              return <p className="mt-4 pt-4 border-t border-gray-200 dark:border-[#333] font-sans text-xs text-gray-500 dark:text-[#A1A1AA] transition-colors duration-200" {...props} />;
                           }
                           if (contentStr.includes(' =')) {
                              const parts = contentStr.split(' =');
                              return (
                                 <p className="mb-6 leading-relaxed text-gray-800 dark:text-[#D4D4D8] text-[15px] font-serif transition-colors duration-200">
                                    <strong className="font-sans font-bold text-gray-900 dark:text-white mr-1 transition-colors duration-200">{parts[0] + ' ='}</strong>
                                    {parts.slice(1).join(' =')}
                                 </p>
                              );
                           }
                       }
                    }
                    return <p className="mb-6 leading-relaxed text-gray-800 dark:text-[#D4D4D8] text-[15px] font-serif transition-colors duration-200" {...props} />;
                 },
                 strong: ({node, ...props}) => <strong className="font-sans font-bold text-gray-900 dark:text-white transition-colors duration-200" {...props} />,
                 img: ({node, ...props}) => {
                   if (!props.src) return null;
                   return (
                     <span className="block w-full text-center my-6">
                       <img 
                         className="max-w-full rounded-lg shadow-md inline-block" 
                         {...props} 
                         referrerPolicy="no-referrer" 
                         alt={props.alt || "Generated Preview Image"} 
                       />
                     </span>
                   );
                 }
               }}
            >
              {content || (isGenerating ? 'Drafting release...' : '')}
            </ReactMarkdown>
            {isGenerating && (
               <span className="inline-block w-2 h-4 bg-[#3B82F6] animate-pulse ml-1 align-middle"></span>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative group h-full">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-12 resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-800 dark:text-[#ECECEC] bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-200"
              placeholder="Edit markdown source..."
            />
            {/* AI Refine Tool */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1A1A1A] p-2 flex items-center gap-2 w-11/12 max-w-md shadow-2xl transition-opacity opacity-50 focus-within:opacity-100 hover:opacity-100 border border-gray-200 dark:border-[#333] rounded">
               <Wand2 size={16} className="text-[#3B82F6] ml-2 shrink-0" />
               <input 
                 type="text" 
                 value={refineQuery}
                 onChange={(e) => setRefineQuery(e.target.value)}
                 placeholder="Select block, then type requested tone..." 
                 className="flex-1 text-xs p-1.5 focus:outline-none bg-transparent text-gray-900 dark:text-white font-sans placeholder:text-gray-400 dark:placeholder:text-[#888]"
                 onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
               />
               <button 
                 onClick={handleRefine}
                 disabled={isRefining}
                 className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-90 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 shrink-0 disabled:opacity-50 transition-all rounded"
               >
                 {isRefining ? 'Refining...' : 'Refine'}
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
