import React, { useState } from 'react';
import { PRRequestParams } from '../types';
import { Sparkles, Building2, Calendar, Target, PenLine } from 'lucide-react';

interface InputFormProps {
  onGenerate: (params: PRRequestParams) => void;
  isGenerating: boolean;
}

export default function InputForm({ onGenerate, isGenerating }: InputFormProps) {
  const [params, setParams] = useState<PRRequestParams>({
    keywords: '',
    type: '신제품 출시',
    embargo: '즉시 배포',
    companyName: '',
    companyLink: '',
    contact: '',
    tone: '권위 있는 기사체 (스트레이트 뉴스 형식)',
    length: '보통',
    generateImage: true,
    imageStyle: '실사 기반의 정밀 이미지',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.keywords.trim()) {
      alert('핵심 내용(5W1H)을 입력해주세요.');
      return;
    }
    onGenerate(params);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-6 h-full">
      <div className="space-y-4 flex-1">
        
        {/* Keywords */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
            5W1H Information <span className="text-[#7C3AED]">*</span>
          </label>
          <textarea
            name="keywords"
            value={params.keywords}
            onChange={handleChange}
            placeholder="누가, 언제, 어디서, 무엇을, 어떻게, 왜 했는지 간략히 적어주세요. (최대 300~500자)"
            className="w-full h-48 p-3 text-sm border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#ECECEC] resize-none focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] rounded transition-colors duration-200"
            required
          />
        </div>

        {/* PR Type */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
            Release Type
          </label>
          <select
            name="type"
            value={params.type}
            onChange={handleChange}
            className="w-full p-2 text-xs border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#ECECEC] focus:outline-none focus:border-[#7C3AED] rounded transition-colors duration-200"
          >
            <option value="신제품 출시">신제품 출시</option>
            <option value="투자 유치">투자 유치</option>
            <option value="MOU 체결 (업무협약)">MOU 체결</option>
            <option value="이벤트 및 행사">이벤트 및 행사</option>
            <option value="실적 발표">실적 발표</option>
            <option value="인사 동정">인사 동정</option>
          </select>
        </div>

        {/* Company Info */}
        <div className="space-y-2 pt-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
            Company Details
          </label>
          <div className="space-y-2 border border-gray-200 dark:border-[#333] p-3 bg-white dark:bg-[#0A0A0A] rounded transition-colors duration-200">
            <input
              type="text"
              name="companyName"
              value={params.companyName}
              onChange={handleChange}
              placeholder="회사명 / 기관명"
              className="w-full p-2 border-b border-gray-200 dark:border-[#333] bg-transparent text-xs text-gray-900 dark:text-[#ECECEC] focus:outline-none placeholder:text-gray-400 dark:placeholder:text-[#666] transition-colors duration-200"
            />
            <input
              type="text"
              name="companyLink"
              value={params.companyLink}
              onChange={handleChange}
              placeholder="웹사이트 또는 관련 링크"
              className="w-full p-2 border-b border-gray-200 dark:border-[#333] bg-transparent text-xs text-gray-900 dark:text-[#ECECEC] focus:outline-none placeholder:text-gray-400 dark:placeholder:text-[#666] transition-colors duration-200"
            />
            <input
              type="text"
              name="contact"
              value={params.contact}
              onChange={handleChange}
              placeholder="담당자명/연락처"
              className="w-full p-2 bg-transparent text-xs text-gray-900 dark:text-[#ECECEC] focus:outline-none placeholder:text-gray-400 dark:placeholder:text-[#666] transition-colors duration-200"
            />
          </div>
        </div>

        {/* Tone */}
        <div className="space-y-2 pt-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
            News Tone
          </label>
          <select
             name="tone"
             value={params.tone}
             onChange={handleChange}
             className="w-full p-2 text-xs border border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#ECECEC] focus:outline-none focus:border-[#7C3AED] rounded transition-colors duration-200"
          >
            <option value="권위 있는 기사체 (스트레이트 뉴스 형식)">권위 있는 기사체 (스트레이트 뉴스)</option>
            <option value="세련된 뉴스레터 및 스토리텔링체">세련된 뉴스레터 (스토리텔링)</option>
            <option value="인터뷰/르포 스타일">인터뷰/르포 스타일</option>
          </select>
        </div>

        {/* Release Length */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-[#333] transition-colors duration-200">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
            Article Length
          </label>
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#333] rounded divide-y divide-gray-200 dark:divide-[#333] overflow-hidden transition-colors duration-200">
            {[
              { id: '매우 짧게', label: '매우 짧게', desc: '700~900자 · 속보형, 단신, 공지형' },
              { id: '짧게', label: '짧게', desc: '1,000~1,300자 · 간단한 MOU·출시 기사' },
              { id: '보통', label: '보통', desc: '1,500~1,800자 · 가장 표준적인 보도자료', badge: '추천' },
              { id: '길게', label: '길게', desc: '2,000~2,300자 · 서비스·기술 소개' },
              { id: '매우 길게', label: '매우 길게', desc: '2,500~3,000자 · 기획형, 인터뷰 포함형' }
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

        {/* Image Generation */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-[#333] transition-colors duration-200">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
            Media Assets
          </label>
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#333] rounded overflow-hidden transition-colors duration-200">
            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111] transition-colors">
              <span className="text-[13px] font-bold text-gray-900 dark:text-[#ECECEC] transition-colors duration-200">이미지도 함께 생성</span>
              <div className={`w-10 h-5 rounded-full flex items-center transition-colors px-0.5 ${params.generateImage ? 'bg-[#7C3AED]' : 'bg-gray-300 dark:bg-[#333]'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${params.generateImage ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <input
                type="checkbox"
                name="generateImage"
                checked={params.generateImage}
                onChange={(e) => setParams(prev => ({ ...prev, generateImage: e.target.checked }))}
                className="hidden"
              />
            </label>
            {params.generateImage && (
              <div className="divide-y divide-gray-200 dark:divide-[#333] border-t border-gray-200 dark:border-[#333] bg-white dark:bg-[#0A0A0A] transition-colors duration-200">
                {[
                  '실사 기반의 정밀 이미지',
                  '브랜드 로고 중심 이미지',
                  '텍스트 요소 제외',
                  '핵심 메시지 시각화',
                  '스토리텔링 중심 현장 묘사'
                ].map(style => (
                  <label key={style} className="flex items-center justify-between p-3.5 pl-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111] transition-colors">
                    <span className="text-[13px] text-gray-600 dark:text-[#A1A1AA] font-medium transition-colors duration-200">{style}</span>
                    <input
                      type="radio"
                      name="imageStyle"
                      value={style}
                      checked={params.imageStyle === style}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#7C3AED] border-gray-300 dark:border-[#555] focus:ring-[#7C3AED] bg-white dark:bg-black appearance-none rounded-full checked:border-[4px] checked:border-[#7C3AED] transition-all"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="pt-4 flex-none">
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-90 text-white font-bold uppercase tracking-[0.2em] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
               <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
               GENERATING...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={16} /> GENERATE RELEASE
            </span>
          )}
        </button>
      </div>

      <div className="flex-none">
        <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/20 p-3 flex items-start space-x-3 rounded">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6] mt-1.5 shrink-0 shadow-[0_0_8px_#3B82F6]"></div>
          <p className="text-[11px] text-[#93C5FD] leading-relaxed">
            <strong>Gemini Pro Tip:</strong> Include actual quotes from your CEO to increase pick-up rate by media outlets.
          </p>
        </div>
      </div>
    </form>
  );
}
