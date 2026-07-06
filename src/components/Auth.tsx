import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User as UserIcon, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Auth: React.FC = () => {
  const { supabaseSignUp, supabaseSignIn, login: loginWithGoogle, setPage, user } = useApp();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Reset
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Basic Validation
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    if (!isLogin) {
      if (!displayName) {
        setErrorMsg('이름을 입력해 주세요.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        // Supabase login
        const { error, data } = await supabaseSignIn(email, password);
        if (error) {
          console.error("Login error:", error);
          setErrorMsg(getKoreanErrorMessage(error.message));
        } else {
          setSuccessMsg('로그인에 성공했습니다! 대시보드로 이동합니다.');
          setTimeout(() => {
            setPage('home');
          }, 1500);
        }
      } else {
        // Supabase sign up (Requires email verification confirmation)
        const { error, data } = await supabaseSignUp(email, password, displayName);
        if (error) {
          console.error("Sign up error:", error);
          setErrorMsg(getKoreanErrorMessage(error.message));
        } else {
          setSuccessMsg('회원가입이 완료되었습니다! 입력하신 이메일로 인증 메일을 발송했습니다. 메일함의 링크를 클릭하여 인증을 완료해 주세요.');
          // Reset form fields
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: any) {
      setErrorMsg('서버와 통신 중 문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  // Human friendly error message mapper
  const getKoreanErrorMessage = (msg: string): string => {
    if (msg.includes('Invalid login credentials')) {
      return '이메일 또는 비밀번호가 일치하지 않습니다.';
    }
    if (msg.includes('User already registered')) {
      return '이미 가입된 이메일 주소입니다.';
    }
    if (msg.includes('Email not confirmed')) {
      return '이메일 인증이 완료되지 않았습니다. 메일 수신함을 확인해 주세요.';
    }
    if (msg.includes('Signup requires a valid email')) {
      return '올바른 이메일 형식을 입력해 주세요.';
    }
    return msg;
  };

  // If already logged in, show dynamic card
  if (user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6"
        >
          <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">이미 로그인된 상태입니다</h2>
            <p className="text-xs text-slate-500 font-medium">
              현재 <span className="text-brand font-bold">{user.displayName}</span>({user.email}) 계정으로 인증되어 있습니다.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setPage('home')}
              className="w-full py-3 bg-[#0A2540] hover:bg-brand text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer focus:outline-none"
            >
              <span>메인 홈으로 가기</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage('boards')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              고객 게시판 둘러보기
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full space-y-8">
        
        {/* Brand identity header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand/60 bg-brand/5 px-3 py-1 rounded-full border border-brand/10">
            ITCON Cloud Authentication
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {isLogin ? '로그인' : '회원가입'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'ITCON 인프라 플랫폼에 오신 것을 환영합니다' : '새로운 ITCON 계정을 생성하여 전문 솔루션을 경험하세요'}
          </p>
        </div>

        {/* Main Card container */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          
          {/* Action Tabs switcher */}
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                isLogin ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                !isLogin ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              회원가입
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name Field (Sign up only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500 tracking-wide uppercase">이름</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-500 tracking-wide uppercase">이메일 주소</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@itcon.co.kr"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-500 tracking-wide uppercase">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Confirm Password Field (Sign up only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500 tracking-wide uppercase">비밀번호 확인</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
              )}

              {/* Alerts container */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-start space-x-2 animate-shake">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-medium space-y-1.5 leading-relaxed">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">성공 및 안내</span>
                  </div>
                  <div>{successMsg}</div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#0A2540] hover:bg-brand text-white text-xs font-bold rounded-xl shadow-md shadow-brand/10 hover:shadow-brand/20 transition-all flex items-center justify-center space-x-1 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? '로그인' : '회원가입 요청'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Social login divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Alternate Google sign in login helper */}
          <button
            onClick={loginWithGoogle}
            className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer focus:outline-none"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.72v3.08h3.95c2.31-2.13 3.64-5.26 3.64-8.65z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.51 1.18-3.98 1.18-3.08 0-5.69-2.08-6.62-4.88H1.32v3.19A11.98 11.98 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.38 14.31A7.16 7.16 0 0 1 5 12c0-.81.14-1.61.38-2.31V6.5H1.32A11.96 11.96 0 0 0 0 12c0 2.12.55 4.12 1.32 5.5l4.06-3.19z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.31 2.69 1.32 6.5l4.06 3.19c.93-2.8 3.54-4.94 6.62-4.94z"
              />
            </svg>
            <span>Google 계정으로 계속하기</span>
          </button>
        </div>
        
        {/* Footer info text */}
        <p className="text-center text-[10px] text-slate-400 font-medium leading-relaxed px-6">
          가입하거나 로그인 시 귀사는 ITCON 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};
