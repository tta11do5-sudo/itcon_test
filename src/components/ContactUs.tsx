import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { supabase } from '../supabase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Phone, Printer, MapPin, CheckCircle, Send, ShieldCheck, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactUs: React.FC = () => {
  const { config } = useApp();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'success' | 'failed' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !content.trim()) {
      alert('필수 작성란을 기입해 주세요.');
      return;
    }

    setSubmitting(true);
    setSupabaseStatus(null);

    try {
      // 1. Prepare Supabase Payload (standard snake_case for PostgreSQL)
      const supabasePayload = {
        name,
        email,
        phone: phone || '',
        company: company || '',
        subject,
        content,
        created_at: new Date().toISOString()
      };

      // 2. Submit to Supabase
      const { error: supabaseError } = await supabase
        .from('inquiries')
        .insert([supabasePayload]);

      if (supabaseError) {
        console.error("Supabase insert error (Ensure 'inquiries' table is created):", supabaseError);
        setSupabaseStatus('failed');
      } else {
        setSupabaseStatus('success');
      }

      // 3. Fallback/Dual-save to Firestore to sync statistics & preserve data
      const firestorePayload = {
        name,
        email,
        phone: phone || '',
        company: company || '',
        subject,
        content,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'inquiries'), firestorePayload);
      setSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSubject('');
      setContent('');
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      // Even if one database has a connection issue, try to be as informative as possible
      alert('문의 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16" id="contact-form-anchor">
      
      {/* Page header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">Contact Us</h1>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
          서버 증설, 대용량 스토리지 이전, 가상화 자동 제어 백업 솔루션 설계에 대한 세부 견적 및 무상 기술 분석을 요청하시면 담당 기술 영업 대표가 즉각 회신해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* Left column: Contact Info (2/5 size) */}
        <div className="lg:col-span-2 space-y-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-md">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">ITCON 공식 영업 지점</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              업무 시간 (평일 09:00 ~ 18:00) 중 대표전화로 유선 연락 주시면 현장 방문 예약 및 엔지니어 사전 정밀 진단 예약을 잡으실 수 있습니다.
            </p>
          </div>

          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand/5 rounded-xl text-brand shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">본사 소재지</h4>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  서울시 영등포구 양평로21길 26 아이에스BIZ타워 26층 2601호
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand/5 rounded-xl text-brand shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">대표 연락처</h4>
                <p className="text-sm font-semibold text-slate-800">
                  전화: 02-2070-3200
                </p>
              </div>
            </div>

            {/* Fax */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand/5 rounded-xl text-brand shrink-0">
                <Printer className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">팩스 송수신</h4>
                <p className="text-sm font-semibold text-slate-800">
                  팩스: 02-2070-3210
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand/5 rounded-xl text-brand shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">온라인 이메일 지원</h4>
                <a href="mailto:sales@itcon.kr" className="text-sm font-semibold text-brand hover:underline">
                  sales@itcon.kr
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center space-x-2 text-xs font-medium text-slate-400">
            <Landmark className="h-4.5 w-4.5 text-slate-300" />
            <span>사업자등록번호: 114-86-61445 | ITCON Corp.</span>
          </div>
        </div>

        {/* Right column: Form (3/5 size) */}
        <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-6"
              >
                <div className="inline-flex p-4 bg-emerald-50 rounded-full text-emerald-500 mb-2">
                  <CheckCircle className="h-14 w-14 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">문의 등록이 완료되었습니다.</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    작성해 주신 문의 사항은 당사 CRM 시스템으로 접수되었으며, 24시간 이내에 전문 엔지니어가 메일이나 전화로 신속하고 정확하게 회신해 드릴 것을 약속드립니다.
                  </p>
                  <div className="pt-2 flex flex-col items-center justify-center gap-1.5">
                    {supabaseStatus === 'success' && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1 border border-emerald-100">
                        ● Supabase 실시간 동기화 성공
                      </span>
                    )}
                    {supabaseStatus === 'failed' && (
                      <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1 border border-amber-100" title="Supabase 'inquiries' 테이블이 아직 존재하지 않거나 액세스 권한이 없을 수 있습니다.">
                        ▲ Supabase 테이블 구성 필요 (Firestore 보완 저장 완료)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none shadow-md shadow-brand/10"
                >
                  새 문의 등록하기
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">온라인 견적 상담 및 요구사항 등록</h3>
                  <p className="text-xs text-slate-400">아래 정보를 입력해 주시면 신속하게 검토하여 상담 제안을 드리겠습니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">성함 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동 대표"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">이메일 주소 <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="partner@company.com"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">연락처 (전화번호)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">회사명 / 소속 기관</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="(주) IT솔루션즈"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">문의 제목 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="x86 랙형 고밀도 서버 5대 신규 도입 및 스토리지 구성 견적 문의"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">문의 내용 <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="도입을 구상 중이신 하드웨어 제원(CPU 스펙, RAM 용량, SSD 수량), 가상 머신 구상 수량, 또는 백업 이중화 조건 등을 상세 기술해 주시면 보다 정확한 초기 시뮬레이션 견적이 가능합니다."
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                    <ShieldCheck className="h-4 w-4 text-brand shrink-0" />
                    <span>개인정보 수집 및 상담 수신 목적에 동의하게 됩니다.</span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center space-x-1.5 px-6 py-3 bg-brand hover:bg-brand-hover disabled:bg-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand/10 cursor-pointer focus:outline-none"
                    id="submit-inquiry-btn"
                  >
                    {submitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>상담 신청 메일 송신</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
