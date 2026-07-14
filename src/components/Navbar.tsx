import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';
import { Cpu, Menu, X, LogIn, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { page, setPage, user, login, logout, isAdmin, demoAdminMode, setDemoAdminMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home' as PageId, label: '홈' },
    { id: 'about' as PageId, label: '회사 소개' },
    { id: 'solutions' as PageId, label: '솔루션 & 서비스' },
    { id: 'boards' as PageId, label: '고객 지원' },
    { id: 'contact' as PageId, label: '문의하기' },
  ];

  const handleNavClick = (id: PageId) => {
    setPage(id);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center group cursor-pointer focus:outline-none"
              id="nav-logo"
            >
              <div className="flex flex-col items-start text-left select-none">
                <span className="text-3xl md:text-4xl font-extrabold tracking-[0.06em] text-[#2B3A8F] group-hover:text-brand transition-colors leading-none uppercase font-sans">
                  IT CON
                </span>
                <span className="text-[9px] md:text-[11px] text-slate-400 font-semibold tracking-[0.01em] mt-1.5 leading-none font-sans">
                  Information Technology Convergence
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none ${
                  page === item.id
                    ? 'text-[#0A2540]'
                    : 'text-slate-500 hover:text-[#0A2540]'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label}
                {page === item.id && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#0A2540]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}

            {/* Separator */}
            <div className="h-5 w-[1px] bg-slate-200 mx-2" />

            {/* Admin Dashboard */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center space-x-1.5 px-4.5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer focus:outline-none shadow-md shadow-blue-900/10 ${
                page === 'admin'
                  ? 'bg-[#0056b3] text-white'
                  : 'bg-[#0A2540] text-white hover:bg-[#0056b3]'
              }`}
              id="nav-admin-dashboard"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>ADMIN {isAdmin && <span className="ml-1 text-[9px] bg-emerald-500 text-white px-1 py-0.5 rounded font-bold">ON</span>}</span>
            </button>

            {/* Authentication */}
            {user ? (
              <div className="flex items-center space-x-3 pl-2">
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full border border-brand/20 shadow-inner"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs uppercase border border-brand/20">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 leading-none">
                      {user.displayName || '사용자'}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer focus:outline-none"
                  title="로그아웃"
                  id="nav-logout-btn"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPage('auth')}
                className="flex items-center space-x-1.5 ml-2 px-4 py-2 bg-[#0A2540] text-white hover:bg-brand text-sm font-semibold rounded-lg transition-all shadow-sm shadow-slate-950/10 hover:shadow-brand/20 cursor-pointer focus:outline-none"
                id="nav-login-btn"
              >
                <LogIn className="h-4 w-4" />
                <span>로그인 / 회원가입</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-brand hover:bg-slate-50 cursor-pointer focus:outline-none"
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer focus:outline-none ${
                    page === item.id
                      ? 'text-brand bg-brand/5 font-semibold'
                      : 'text-slate-600 hover:text-brand hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="h-[1px] bg-slate-100 my-2" />

              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center space-x-2 w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer focus:outline-none ${
                  page === 'admin'
                    ? 'text-brand bg-brand/5 font-semibold'
                    : 'text-slate-600 hover:text-brand hover:bg-slate-50'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>관리자 대시보드 {isAdmin && <span className="ml-2 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">ON</span>}</span>
              </button>

              <div className="h-[1px] bg-slate-100 my-2" />

              {/* Mobile Authentication */}
              {user ? (
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center space-x-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full border border-brand/20"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm border border-brand/20">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {user.displayName}
                      </div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer focus:outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2">
                  <button
                    onClick={() => { setPage('auth'); setMobileOpen(false); }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-[#0A2540] text-white hover:bg-brand rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer focus:outline-none"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>로그인 / 회원가입</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
