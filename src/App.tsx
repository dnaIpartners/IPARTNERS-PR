import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InputForm from './components/InputForm';
import CopywritingInputForm from './components/CopywritingInputForm';
import HistoryPanel from './components/HistoryPanel';
import PreviewEditor from './components/PreviewEditor';
import MainLanding from './components/MainLanding';
import { PRRequestParams, CopywritingRequestParams, PRHistoryItem } from './types';
import { Sparkles, Calendar, ChevronRight, MessageSquareText, Layers, TrendingUp } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('pulitzer_is_logged_in') === 'true';
  });
  const [history, setHistory] = useState<PRHistoryItem[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('press-release');
  const [currentContent, setCurrentContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark' | 'system') || 'system';
  });
  
  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const recheckSystemDark = () => {
    try {
      const matches = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsSystemDark(matches);
    } catch (e) {
      console.warn('System prefers-color-scheme check mismatch:', e);
    }
  };

  useEffect(() => {
    recheckSystemDark();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const listener = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSystemDark(e.matches);
    };
    
    // Support both modern addEventListener and legacy addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener as any);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(listener);
    }

    const handleFocus = () => {
      recheckSystemDark();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener as any);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(listener);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const isDarkMode = theme === 'system' ? isSystemDark : theme === 'dark';
  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('pulitzer_is_logged_in', 'true');
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('pulitzer_is_logged_in');
  };
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(true); // Opened by default to match screenshot view

  // Specific content for coming-soon tabs
  const [subscribedTabs, setSubscribedTabs] = useState<Record<string, boolean>>({});

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('pr_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Update theme tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save to localStorage safely, optimizing storage if quota is exceeded
  const safeSaveToLocalStorage = (key: string, data: PRHistoryItem[]): PRHistoryItem[] => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (e: any) {
      if (
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        e.code === 22 ||
        e.number === -2147024882
      ) {
        console.warn('Storage quota exceeded, optimizing history data by replacing heavy inline base64 images with placeholder...');
        
        // Optimize data by replacing large inline base64 images under item.content with high quality business unsplash URL
        const optimizedData = data.map(item => {
          if (item.content && item.content.includes('data:image/')) {
            const cleanedContent = item.content.replace(
              /data:image\/[^;]+;base64,[^)]+/g,
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1024&h=576'
            );
            return {
              ...item,
              content: cleanedContent
            };
          }
          return item;
        });

        try {
          localStorage.setItem(key, JSON.stringify(optimizedData));
          return optimizedData;
        } catch (e2) {
          console.warn('Still exceeding quota, reducing history items...');
          let sliceSize = Math.floor(optimizedData.length / 2);
          while (sliceSize > 0) {
            const sliced = optimizedData.slice(0, sliceSize);
            try {
              localStorage.setItem(key, JSON.stringify(sliced));
              return sliced;
            } catch (e3) {
              sliceSize = Math.floor(sliceSize / 2);
            }
          }
          localStorage.removeItem(key);
          return [];
        }
      } else {
        console.error('Failed to save to localStorage:', e);
        return data;
      }
    }
  };

  // Save Press Release content to history
  const savePRToHistory = (content: string) => {
    if (!content.trim()) return;
    const titleMatch = content.match(/\[제목\] (.*?)\n/);
    const title = titleMatch ? titleMatch[1] : '새 보도자료';
    
    const newItem: PRHistoryItem = {
      id: Date.now().toString(),
      type: 'press-release',
      date: new Date().toLocaleDateString(),
      title: title.replace(/[#*`_]/g, '').trim(),
      content
    };
    
    const newHistory = [newItem, ...history].slice(0, 50);
    const savedHistory = safeSaveToLocalStorage('pr_history', newHistory);
    setHistory(savedHistory);
  };

  // Save Copywriting content to history
  const saveCopyToHistory = (content: string, platformType: string) => {
    if (!content.trim()) return;
    
    // Extract a nice title or use platform
    const cleanPlatform = platformType.split(' (')[0];
    const newItem: PRHistoryItem = {
      id: Date.now().toString(),
      type: 'copywriting',
      date: new Date().toLocaleDateString(),
      title: `[${cleanPlatform}] 마케팅 문구 제안`,
      content,
      platform: platformType
    };

    const newHistory = [newItem, ...history].slice(0, 50);
    const savedHistory = safeSaveToLocalStorage('pr_history', newHistory);
    setHistory(savedHistory);
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    const savedHistory = safeSaveToLocalStorage('pr_history', newHistory);
    setHistory(savedHistory);
  };

  // Press Release Generation API Call
  const handlePRGenerate = async (params: PRRequestParams) => {
    setIsGenerating(true);
    setCurrentContent('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
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
      let fullContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setCurrentContent(prev => prev + chunk);
      }
      
      savePRToHistory(fullContent);
    } catch (error: any) {
      console.error('Error generating PR:', error);
      alert(`보도자료 생성 중 오류가 발생했습니다.\n${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copywriting Generation API Call
  const handleCopyGenerate = async (params: CopywritingRequestParams) => {
    setIsGenerating(true);
    setCurrentContent('');
    
    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
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
      let fullContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setCurrentContent(prev => prev + chunk);
      }
      
      saveCopyToHistory(fullContent, params.platform);
    } catch (error: any) {
      console.error('Error generating copywriting:', error);
      alert(`마케팅 카피 생성 중 오류가 발생했습니다.\n${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadHistoryItem = (item: PRHistoryItem) => {
    setCurrentContent(item.content);
  };

  const handleSubscribe = (tabId: string) => {
    setSubscribedTabs(prev => ({ ...prev, [tabId]: true }));
    alert('구독이 완료되었습니다! 프리미엄 베타 출시 일정과 초대장을 등록된 메일로 보내드릴게요.');
  };

  // Quick helper to translate category tab labels
  const getTabLabel = () => {
    switch (currentTab) {
      case 'press-release': return '보도자료 초안 생성';
      case 'copywriting': return '인공지능 마케팅 카피라이팅';
      case 'news-clipping': return '실시간 뉴스 클리핑';
      case 'crisis-management': return '위기 관리 센터';
      case 'media-bridge': return '미디어 브릿지 매칭';
      case 'pr-calendar': return 'PR 캘린더 배포';
      case 'blog': return '공식 소셜/블로그 포스트';
      case 'prompt': return '커스텀 프롬프트 랩';
      case 'all-tools': return ' AI 전체 도구 상자';
      default: return ' AI Pro';
    }
  };

  return (
    !isLoggedIn ? (
      <MainLanding onLogin={handleLogin} />
    ) : (
      <div className="flex h-screen bg-[#F4F1ED] dark:bg-[#050505] font-sans text-gray-900 dark:text-[#ECECEC] overflow-hidden transition-colors duration-200">
        {/* 1. Left Narrow Side Navigation */}
        <Sidebar 
          currentTab={currentTab} 
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setCurrentContent(''); // Clear preview when switching modes
          }} 
          theme={theme}
          onChangeTheme={setTheme}
          isSystemDark={isSystemDark}
          recheckSystemDark={recheckSystemDark}
          onLogoClick={handleLogout}
        />

        {/* 2. Middle Slide-out History Panel */}
        <HistoryPanel 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          currentTab={currentTab}
          onLoadItem={handleLoadHistoryItem}
          onDeleteItem={handleDeleteHistoryItem}
        />
      
      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="h-16 bg-white dark:bg-[#070707] border-b border-gray-200 dark:border-[#1E1E1E] px-8 flex items-center justify-between shrink-0 transition-colors duration-200 select-none">
          {/* Header left: History Drawer state & Current Title / Mode */}
          <div className="flex items-center gap-4">
            {!isHistoryOpen && (
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 dark:border-zinc-800 bg-[#FAFAFAF6] hover:bg-neutral-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all rounded-lg cursor-pointer"
              >
                이전 생성내역 <ChevronRight size={13} className="text-[#7C3AED]" />
              </button>
            )}
            <h2 className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-neutral-700 to-gray-500 dark:from-white dark:to-[#888]">
              {getTabLabel()}
            </h2>
          </div>

          {/* Header right: Export/Actions */}
          <div className="flex space-x-3.5">
             <button 
               onClick={() => {
                 if (!currentContent) {
                   alert('먼저 콘텐츠를 작성해주세요.');
                   return;
                 }
                 navigator.clipboard.writeText(currentContent);
                 alert('초안 텍스트가 복사되었습니다!');
               }}
               className="px-4 py-2 border border-gray-200 dark:border-zinc-800 text-xs font-bold uppercase hover:bg-gray-100 dark:hover:bg-zinc-800 tracking-wide text-gray-700 dark:text-gray-300 transition-colors rounded-lg cursor-pointer"
             >
               클립보드 복사
             </button>
             <button 
               onClick={() => alert('조원 배포 및 발행 연동 모듈로 실시간 준비 중입니다.')}
               className="px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 text-xs font-bold uppercase tracking-wide transition-colors rounded-lg shadow-sm cursor-pointer"
             >
               발행 연동하기
             </button>
          </div>
        </header>
        
        {/* Main Work Area split depending on active tab */}
        {currentTab === 'press-release' || currentTab === 'copywriting' ? (
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left Column: Config Panel */}
            <div className="w-[380px] bg-[#FAF9F6] dark:bg-[#070707] border-r border-gray-200 dark:border-[#1E1E1E] overflow-y-auto shrink-0 flex flex-col transition-colors duration-200 scrollbar-thin">
              {currentTab === 'press-release' ? (
                <InputForm onGenerate={handlePRGenerate} isGenerating={isGenerating} />
              ) : (
                <CopywritingInputForm onGenerate={handleCopyGenerate} isGenerating={isGenerating} />
              )}
            </div>
            
            {/* Right Column: Real-time Live Document Preview Panel */}
            <div className="flex-1 bg-[#F4F1ED] dark:bg-[#050505] p-8 lg:p-12 overflow-hidden flex flex-col items-center transition-colors duration-300">
              <PreviewEditor 
                content={currentContent} 
                isGenerating={isGenerating} 
                setContent={setCurrentContent}
                currentTab={currentTab}
              />
            </div>
          </div>
        ) : (
          /* Feature Coming Soon Placeholder Dashboard Card */
          <div className="flex-1 bg-[#F4F1ED] dark:bg-[#050505] overflow-y-auto flex items-center justify-center p-8 transition-colors">
            <div className="w-full max-w-xl bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-10 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden transition-all duration-300">
              {/* Background ambient gradient flare */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#7C3AED]/10 blur-[80px] rounded-full"></div>
              
              <div className="w-16 h-16 bg-gradient-to-tr from-[#7C3AED]/20 to-[#3B82F6]/20 border border-[#7C3AED]/30 rounded-full flex items-center justify-center text-[#7C3AED] dark:text-[#C084FC] relative animate-pulse shadow-md">
                <Sparkles size={28} className="animate-spin-slow" />
              </div>
              
              <div className="space-y-2 relative">
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-200 tracking-tight">
                  {getTabLabel()} 모듈 준비 중
                </h3>
                <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] font-bold uppercase tracking-widest">
                  Pulitzer AI Premium Core
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-md leading-relaxed transition-colors">
                요청하신 미팅 조율 및 AI 리액션 보조 분석 등 마케팅 허브 배포 최적화를 마치는 대로 해당 모듈 서비스를 프리미엄 베타 등급 사용자분들께 배포할 예정입니다.
              </p>

              <div className="w-full max-w-xs border-t border-gray-100 dark:border-neutral-900/60 pt-6">
                {subscribedTabs[currentTab] ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 py-3 px-5 rounded-lg text-xs font-bold uppercase tracking-wide">
                    ✓ 우선 알림 예약이 완료되었습니다
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(currentTab)}
                    className="w-full py-3 bg-neutral-900 dark:bg-neutral-100 hover:opacity-90 text-white dark:text-black text-xs font-bold uppercase tracking-[0.15em] rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    출시 알림 및 베타 참여 예약하기
                  </button>
                )}
              </div>

              {/* Dynamic Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-4 w-full pt-4 text-left">
                <div className="p-4 border border-gray-100 dark:border-zinc-900/60 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-800 dark:text-zinc-300 flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-[#7C3AED]" /> 실시간 통합 AI
                  </span>
                  <p className="text-[10px] text-gray-400 dark:text-[#666] leading-relaxed">
                    국내 및 해외 주요 배포 전략을 실시간 분석 후 미디어 최적화 시나리오를 구성합니다.
                  </p>
                </div>
                <div className="p-4 border border-gray-100 dark:border-zinc-900/60 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-800 dark:text-zinc-300 flex items-center gap-1.5">
                    <Layers size={12} className="text-[#3B82F6]" /> 다차원 검증
                  </span>
                  <p className="text-[10px] text-gray-400 dark:text-[#666] leading-relaxed">
                    팩트 유효성 검증 필터링 및 오독 여부 자가 조정을 통해 신뢰 높은 배포를 보장합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    )
  );
}
