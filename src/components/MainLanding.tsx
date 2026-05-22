import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Megaphone, Key, User, Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface MainLandingProps {
  onLogin: () => void;
}

export default function MainLanding({ onLogin }: MainLandingProps) {
  const [email, setEmail] = useState('pourlui@ipartners.co.kr');
  const [password, setPassword] = useState('•••••••••');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Smooth transition simulation
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* 1. Ambient Background Grid & Glowing Orbs in style of digispot.ai */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70"></div>
      
      {/* Glowing Accents */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-gradient-to-tr from-[#FF4A22]/15 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8s]"></div>
      <div className="absolute bottom-[25%] right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#7C3AED]/15 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse duration-[12s]"></div>

      {/* Floating Sparkles for High Tech premium vibe */}
      <div className="absolute top-10 right-10 text-orange-500/30 animate-bounce duration-[4s]">
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-20 left-12 text-violet-500/20 animate-spin-slow">
        <Star size={20} />
      </div>

      {/* Header Bar */}
      <header className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 font-sans uppercase">
            IPARTNERS PR AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-400 font-medium hidden sm:inline-block">
            Beta Engine Active
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </header>

      {/* 2. Main Container holding Login content */}
      <main className="relative z-10 w-full max-w-[480px] px-6 flex flex-col items-center">
        
        {/* Intro Tagline / Title */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4A22]/10 border border-[#FF4A22]/20 text-[11px] font-bold text-[#FF4A22] uppercase tracking-widest leading-none">
            <ShieldCheck size={12} /> ENTERPRISE CORE ACTIVE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans max-w-sm mx-auto leading-tight">
           Launches AI PR Solution Designed
          </h1>
          <p className="text-[13px] text-neutral-400 font-medium max-w-xs mx-auto leading-relaxed">
            AI-powered Press Release & Copywriting Workspace. Unify your draft generation and SEO marketing in one interface.
          </p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full bg-black/40 backdrop-blur-xl border border-white/10 dark:border-neutral-800 p-8 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Accent light on top boundary */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF4A22]/50 to-transparent"></div>
          
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">계정 로그인</h2>
              <p className="text-xs text-neutral-500">워크스페이스 입장을 위해 인증 정보를 입력해 주세요.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                ID / Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <User size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-[#FF4A22] focus:ring-1 focus:ring-[#FF4A22] rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-neutral-600 focus:outline-none transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                   Password
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('안전한 데모 환경으로 임의의 비밀번호로도 로그인이 지원됩니다.'); }} className="text-[10px] text-neutral-500 hover:text-[#FF4A22] transition-colors font-medium">
                    임시 비밀번호 발급
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Key size={14} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-[#FF4A22] focus:ring-1 focus:ring-[#FF4A22] rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-neutral-600 focus:outline-none transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Remember Me checkbox & Stay sign in */}
              <div className="flex items-center justify-between pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 accent-[#FF4A22] bg-neutral-900 border-neutral-800 rounded focus:ring-0"
                  />
                  <span className="text-[11px] text-neutral-400 font-medium">보안 유지 로그인 적용</span>
                </label>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  SSL Secured
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative py-3.5 px-4 bg-gradient-to-r from-[#FF4A22] to-[#7C3AED] hover:opacity-95 text-xs text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF4A22]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>워크스페이스 원격 접속 중...</span>
                  </>
                ) : (
                  <>
                    <span>엔터프라이즈 오피스 입장하기</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Informative credentials hints context below */}
        <p className="text-[10px] text-neutral-600 mt-6 text-center select-text leading-relaxed">
        
          비밀번호 변경 없이 바로 <strong className="text-neutral-500">엔터프라이즈 오피스 입장하기</strong> 버튼을 누르면 즉시 내부 워크스페이스가 열립니다.
        </p>
      </main>

      {/* Footer copyright */}
      <footer className="absolute bottom-6 text-center text-[10px] text-neutral-600 z-10 w-full">
        &copy; 2026 IPARTNERS NX AGENT AI Inc. All rights reserved.
      </footer>
    </div>
  );
}
