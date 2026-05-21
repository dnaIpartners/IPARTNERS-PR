import React, { useState } from 'react';
import { CopywritingRequestParams } from '../types';
import { Sparkles, PenTool, Hash, Users, MessageSquare } from 'lucide-react';

interface CopywritingInputFormProps {
  onGenerate: (params: CopywritingRequestParams) => void;
  isGenerating: boolean;
}

export default function CopywritingInputForm({ onGenerate, isGenerating }: CopywritingInputFormProps) {
  const [params, setParams] = useState<CopywritingRequestParams>({
    keywords: '',
    platform: 'SNS 광고 카피 (인스타그램, 페이스북)',
    tone: '센스 있고 트렌디한 (MZ 타겟)',
    count: 3,
    targetAudience: '',
    length: '보통',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, count: parseInt(e.target.value, 10) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.keywords.trim()) {
      alert('제품/서비스 설명 또는 후킹할 특징을 적어주세요.');
      return;
    }
    onGenerate(params);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-6 h-full">
      <div className="space-y-4 flex-1">
        
        {/* Copywriting Pitch Ingredients (Keywords) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-[#7C3AED] dark:text-[#A1A1AA] flex items-center gap-1.5">
            <PenTool size={11} className="text-[#7C3AED]" /> Product / Service Pitch <span className="text-[#7C3AED]">*</span>
          </label>
          <textarea
            name="keywords"
            value={params.keywords}
            onChange={handleChange}
            placeholder="제품 또는 서비스의 구체적인 특징, 혜택, 페인포인트 해결을 적어주세요. (예: '직장인을 위한 10분 스트레칭 앱, 매일 아침 맞춤형 목/어깨 코칭 제공, 출시 기념 1달 무료')"
            className="w-full h-44 p-3 text-sm border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#ECECEC] resize-none focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] rounded transition-colors duration-200"
            required
          />
        </div>

        {/* Platform & Target Audience */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA] flex items-center gap-1.5">
              <Hash size={11} /> Marketing Platform
            </label>
            <select
              name="platform"
              value={params.platform}
              onChange={handleChange}
              className="w-full p-2 text-xs border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#ECECEC] focus:outline-none focus:border-[#7C3AED] rounded transition-colors duration-200"
            >
              <option value="SNS 광고 카피 (인스타그램, 페이스북)">SNS 광고 카피 (인스타그램/페이스북)</option>
              <option value="브랜드 슬로건 및 캐치프레이즈">브랜드 슬로건 / 캐치프레이즈</option>
              <option value="블로그 포스트 헤드라인 & 리드문">블로그 헤드라인 & 리드문</option>
              <option value="이메일 마케팅 헤드라인 & 메인 본문">이메일 뉴스레터 / DM 카피</option>
              <option value="쇼핑몰 상품 상세 페이지 후킹 라이팅">쇼핑몰 상세페이지 후킹 카피</option>
              <option value="유튜브 영상 제목 & 오프닝 스크립트">유튜브 타이틀 & 오프닝 카피</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA] flex items-center gap-1.5">
              <Users size={11} /> Target Audience
            </label>
            <input
              type="text"
              name="targetAudience"
              value={params.targetAudience}
              onChange={handleChange}
              placeholder="예: 2030 직장인, 육아 입문 부모, 홈트족"
              className="w-full p-2 text-xs border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#ECECEC] focus:outline-none focus:border-[#7C3AED] rounded transition-colors duration-200"
            />
          </div>
        </div>

        {/* Tone of Voice */}
        <div className="space-y-2 pt-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA] flex items-center gap-1.5">
            <MessageSquare size={11} /> Tone of Voice
          </label>
          <select
             name="tone"
             value={params.tone}
             onChange={handleChange}
             className="w-full p-2 text-xs border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#ECECEC] focus:outline-none focus:border-[#7C3AED] rounded transition-colors duration-200"
          >
            <option value="센스 있고 트렌디한 (MZ 타겟)">센스 있고 트렌디한 (MZ 세대 타겟)</option>
            <option value="정중하고 설득력 있는 (신뢰감 부여)">정중하고 설득력 있는 (신뢰감 & 전문적)</option>
            <option value="감성적이고 서정적인 (감성을 자극하는)">감성적이고 서정적인 (따뜻한 스토리형)</option>
            <option value="위트 있고 유머러스한 (시선 고정)">위트 있고 유머러스한 (유머 & 화제성)</option>
            <option value="직관적이고 확실한 (직설적 혜택 강조)">직관적이고 확실한 (단도직입 혜택 강조)</option>
          </select>
        </div>

        {/* Copy Options Count */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
              Generation Count (시안 수)
            </label>
            <span className="text-xs font-bold text-[#7C3AED]">{params.count}개 시안</span>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            step="1"
            name="count"
            value={params.count}
            onChange={handleSliderChange}
            className="w-full h-1 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
          />
        </div>

        {/* Length Selection */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-[#333] transition-colors duration-200">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
            Copy Length
          </label>
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#333] rounded divide-y divide-gray-200 dark:divide-[#333] overflow-hidden transition-colors duration-200">
            {[
              { id: '단문형', label: '단문형', desc: '짧고 강렬한 한 줄 메인 뉴스, 한 줄 기사 제목 스타일' },
              { id: '보통', label: '혼합형(보통)', desc: '한 줄 타이틀 + 상세 설명 카피 및 광고 본문', badge: '추천' },
              { id: '스토리텔링형', label: '스토리텔링형', desc: '더 긴 맥락의 포스팅 본문 및 장문 카드뉴스용' }
            ].map(item => (
              <label key={item.id} className="flex flex-row items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111] transition-colors">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-gray-900 dark:text-[#ECECEC] transition-colors duration-200">{item.label}</span>
                    {item.badge && <span className="text-[9px] text-white font-bold uppercase tracking-wide px-1.5 py-0.5 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] rounded-sm">{item.badge}</span>}
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-[#A1A1AA] mt-0.5 transition-colors duration-200">{item.desc}</span>
                </div>
                <input
                  type="radio"
                  name="length"
                  value={item.id}
                  checked={params.length === item.id}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#7C3AED] border-gray-300 dark:border-[#555] focus:ring-[#7C3AED] checked:bg-[#7C3AED] bg-white dark:bg-black appearance-none rounded-full checked:border-[4px] checked:border-[#7C3AED] transition-all"
                />
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* Submit Button */}
      <div className="pt-4 flex-none">
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-90 text-white font-bold uppercase tracking-[0.2em] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded animate-fade-in"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
               <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
               GENERATING...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={16} /> GENERATE COPYWRITING
            </span>
          )}
        </button>
      </div>

      <div className="flex-none">
        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 p-3 flex items-start space-x-3 rounded">
          <div className="w-2 h-2 rounded-full bg-[#7C3AED] mt-1.5 shrink-0 shadow-[0_0_8px_#7C3AED]"></div>
          <p className="text-[11px] text-[#C084FC] leading-relaxed">
            <strong>Copy Pro Tip:</strong> Specify your target audience details clearly to get ultra-personalized highly converting headlines.
          </p>
        </div>
      </div>
    </form>
  );
}
