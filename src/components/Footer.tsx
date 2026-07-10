import React from 'react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';
import { Linkedin, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPage } = useApp();

  const handleNavClick = (id: PageId) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white px-6 md:px-10 py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Left Column: Corporate Info */}
      <div className="text-[11px] text-slate-400 space-y-1">
        <p className="font-bold text-slate-600 flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-[#2B3A8F] rounded-full inline-block" />
          <span>주식회사 아이티콘</span>
          <span className="text-slate-300">|</span>
          <span className="font-normal text-slate-400">대표자: 이준형 | 사업자등록번호: 114-86-61445</span>
        </p>
        <p>서울시 영등포구 양평로21길 26 아이에스BIZ타워 26층 2601호</p>
        <p>
          전화: <span className="font-semibold text-slate-500">02-2070-3200</span> | 
          팩스: <span className="font-semibold text-slate-500">02-2070-3210</span> | 
          이메일: <a href="mailto:sales@itcon.kr" className="text-slate-500 hover:text-[#0056b3] font-semibold underline">sales@itcon.kr</a>
        </p>
      </div>

      {/* Right Column: Social icons & nav buttons */}
      <div className="flex flex-col items-start md:items-end gap-3.5 w-full md:w-auto">
        {/* Simple navigation menu links */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
          <button onClick={() => handleNavClick('about')} className="hover:text-slate-700 cursor-pointer">회사소개</button>
          <button onClick={() => handleNavClick('solutions')} className="hover:text-slate-700 cursor-pointer">솔루션</button>
          <button onClick={() => handleNavClick('boards')} className="hover:text-slate-700 cursor-pointer">고객지원</button>
          <button onClick={() => handleNavClick('contact')} className="hover:text-slate-700 cursor-pointer">영업문의</button>
        </div>

        {/* Social Network Icons */}
        <div className="flex gap-3">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 border border-slate-150 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 border border-slate-150 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 border border-slate-150 rounded-full flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-[10px] text-slate-300 font-mono">© 2026 ITCON Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};
