import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { supabase } from '../supabase';
import { collection, getDocs, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Inquiry, Notice, BoardPost } from '../types';
import { Palette, MailOpen, Layers3, ShieldCheck, Play, ArrowRight, Trash2, Sliders, RefreshCw, Eye, Type, Lock, Check, ToggleLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'customize' | 'inquiries' | 'boards';

export const Admin: React.FC = () => {
  const { isAdmin, user, login, config, updateConfig, demoAdminMode, setDemoAdminMode } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('customize');

  // Database lists
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [posts, setPosts] = useState<BoardPost[]>([]);

  // Detailed views
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Customization local states
  const [localTitle, setLocalTitle] = useState(config.sloganTitle);
  const [localSubtitle, setLocalSubtitle] = useState(config.sloganSubtitle);
  const [localColor, setLocalColor] = useState(config.primaryColor);
  const [localFont, setLocalFont] = useState(config.fontFamily);
  const [savingSettings, setSavingSettings] = useState(false);

  // Status lists
  const [loading, setLoading] = useState(true);

  // Curated elegant theme presets
  const colorPresets = [
    { name: 'Classic Executive Blue', hex: '#0A2540' },
    { name: 'Digital Azure', hex: '#0056b3' },
    { name: 'Midnight Charcoal', hex: '#1E293B' },
    { name: 'Emerald Trust', hex: '#065F46' },
    { name: 'Royal Cyber Indigo', hex: '#4338CA' },
  ];

  useEffect(() => {
    // Sync states when config loads
    setLocalTitle(config.sloganTitle);
    setLocalSubtitle(config.sloganSubtitle);
    setLocalColor(config.primaryColor);
    setLocalFont(config.fontFamily);
  }, [config]);

  // Load Admin Data when authorized
  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);

    // 1. Fetch Inquiries (Try Supabase first, fallback to Firestore)
    let unsubscribeInquiries = () => {};
    let isMounted = true;

    const syncInquiries = async () => {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (isMounted && data) {
          const list: Inquiry[] = data.map((item: any) => ({
            id: String(item.id),
            name: item.name || '',
            email: item.email || '',
            phone: item.phone || '',
            company: item.company || '',
            subject: item.subject || '',
            content: item.content || '',
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          }));
          setInquiries(list);
        }
      } catch (err) {
        console.warn("Could not fetch inquiries from Supabase, falling back to Firestore:", err);
        
        // Fallback: Bind real-time snapshot to Firestore
        const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
        unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
          const list: Inquiry[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            list.push({
              id: docSnapshot.id,
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              company: data.company || '',
              subject: data.subject || '',
              content: data.content || '',
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          });
          if (isMounted) setInquiries(list);
        }, (firestoreError) => {
          console.error("Firestore inquiry fallback error:", firestoreError);
        });
      }
    };

    syncInquiries();

    // Supabase Real-time listener
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        () => {
          syncInquiries();
        }
      )
      .subscribe();

    // 2. Fetch Notices
    const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribeNotices = onSnapshot(noticesQuery, (snapshot) => {
      const list: Notice[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          id: docSnapshot.id,
          title: data.title || '',
          content: data.content || '',
          authorName: data.authorName || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      if (isMounted) setNotices(list);
    });

    // 3. Fetch Board Posts
    const postsQuery = query(collection(db, 'board'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const list: BoardPost[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          id: docSnapshot.id,
          title: data.title || '',
          content: data.content || '',
          authorName: data.authorName || '',
          authorId: data.authorId || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      if (isMounted) {
        setPosts(list);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeInquiries();
      channel.unsubscribe();
      unsubscribeNotices();
      unsubscribePosts();
    };
  }, [isAdmin]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateConfig({
        sloganTitle: localTitle,
        sloganSubtitle: localSubtitle,
        primaryColor: localColor,
        fontFamily: localFont,
      });
      alert('설정이 실시간 저장 및 배포되었습니다! 사이트 전체 테마와 타이틀이 전역 변경되었습니다.');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteInquiry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('이 문의건을 영구 삭제하시겠습니까?')) return;
    try {
      // 1. Delete from Supabase (graceful fail if table doesn't exist or ID format differs)
      try {
        const { error: supabaseErr } = await supabase.from('inquiries').delete().eq('id', id);
        if (supabaseErr) {
          console.warn("Supabase inquiry delete warning:", supabaseErr);
        }
      } catch (err) {
        console.warn("Could not delete from Supabase:", err);
      }

      // 2. Delete from Firestore
      await deleteDoc(doc(db, 'inquiries', id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  const handleDeleteBoardItem = async (type: 'notice' | 'board', id: string) => {
    if (!window.confirm('이 게시글을 삭제하시겠습니까?')) return;
    try {
      const col = type === 'notice' ? 'notices' : 'board';
      await deleteDoc(doc(db, col, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${type === 'notice' ? 'notices' : 'board'}/${id}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-red-50 rounded-2xl text-red-500">
            <Lock className="h-10 w-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">관리자 전용 구역</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            이곳은 ITCON의 웹 콘텐츠 커스터마이징 및 고객 견적 문의를 제어하는 관리자 대시보드입니다.
          </p>
        </div>

        {/* Demo Admin Activation Trigger */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-brand font-mono">Reviewer Playground Bypassing</div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>테스터용 혜택:</strong> 구글 로그인 없이도 모든 대시보드 기능(실시간 테마 스위처, 문의글 모니터링, 게시글 CRUD)을 즉시 조작 및 관찰할 수 있도록 <strong>데모 관리자 모드</strong> 우회 기능을 지원합니다.
          </p>
          <button
            onClick={() => setDemoAdminMode(true)}
            className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand/10 cursor-pointer focus:outline-none flex justify-center items-center space-x-1.5"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>데모 관리자 모드 활성화</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-150"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or authenticate with</span>
          <div className="flex-grow border-t border-slate-150"></div>
        </div>

        <button
          onClick={login}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer focus:outline-none flex justify-center items-center space-x-2 shadow-inner"
        >
          <span>Google 관리자 인증 진행</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-brand text-white px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider">Admin Space</span>
            {demoAdminMode && (
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded font-bold">Demo Mode Active</span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">ITCON 통합 제어 관리자센터</h1>
          <p className="text-xs text-slate-500">테마 변경, 슬로건 커스텀, 고객 이메일 견적 내역 모니터링을 실시간 조작합니다.</p>
        </div>

        <div className="flex items-center space-x-3">
          {demoAdminMode && (
            <button
              onClick={() => setDemoAdminMode(false)}
              className="px-4 py-2 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
            >
              데모 모드 끄기
            </button>
          )}
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
            {user?.displayName || '데모관리자님'}
          </span>
        </div>
      </div>

      {/* Main Admin Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Rail: Dashboard tabs switcher */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'customize' as AdminTab, label: '콘텐츠 커스터마이징', icon: <Palette className="h-4.5 w-4.5" /> },
            { id: 'inquiries' as AdminTab, label: '영업문의 목록 수신함', icon: <MailOpen className="h-4.5 w-4.5" />, badge: inquiries.length },
            { id: 'boards' as AdminTab, label: '전체 게시글 CRUD 통제', icon: <Layers3 className="h-4.5 w-4.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedInquiry(null); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                activeTab === tab.id
                  ? 'bg-brand text-white shadow-md shadow-brand/15'
                  : 'bg-white text-slate-600 hover:text-brand hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-brand' : 'bg-red-500 text-white'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Side: Tab content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CUSTOMIZE */}
            {activeTab === 'customize' && (
              <motion.div
                key="customize"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-md space-y-8"
              >
                <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Sliders className="h-5 w-5 text-brand" />
                    <h3 className="text-lg font-bold text-slate-900">사이트 비주얼 및 문구 전역 변경</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-brand font-mono bg-brand/5 px-2 py-1 rounded">No Code Editing</span>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  {/* Point Color Choice */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      1. 핵심 포인트 컬러 (Theme Brand Color)
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => setLocalColor(preset.hex)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer focus:outline-none ${
                            localColor.toLowerCase() === preset.hex.toLowerCase()
                              ? 'border-slate-900 ring-2 ring-slate-950/20'
                              : 'border-slate-150 hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: preset.hex }} />
                          <span className="text-[9px] font-bold text-slate-600 truncate w-full">{preset.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <span className="text-xs text-slate-400">커스텀 헥사코드 선택:</span>
                      <input
                        type="color"
                        value={localColor}
                        onChange={(e) => setLocalColor(e.target.value)}
                        className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded uppercase">
                        {localColor}
                      </span>
                    </div>
                  </div>

                  {/* Fonts Switch */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      2. 메인 글꼴 테마 (Typography Preset)
                    </label>
                    <div className="flex space-x-2">
                      {[
                        { id: 'sans', label: 'Inter + Noto Sans (기본 산세리프)' },
                        { id: 'serif', label: 'Playfair + Noto (고전 세리프)' },
                        { id: 'mono', label: 'JetBrains Mono (인프라 테크 모노)' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setLocalFont(f.id)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                            localFont === f.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slogan title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      3. 메인 슬로건 대타이틀 (Hero Slogan)
                    </label>
                    <input
                      type="text"
                      required
                      value={localTitle}
                      onChange={(e) => setLocalTitle(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                    />
                  </div>

                  {/* Slogan Subtitle */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      4. 메인 슬로건 소타이틀 (Hero Subtitle)
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={localSubtitle}
                      onChange={(e) => setLocalSubtitle(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand leading-relaxed"
                    />
                  </div>

                  {/* Save buttons */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-6 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer focus:outline-none shadow-md shadow-brand/10 disabled:bg-slate-400"
                    >
                      {savingSettings ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>설정값 저장 및 전역 배포</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* TAB 2: RECEIVED INQUIRIES */}
            {activeTab === 'inquiries' && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {selectedInquiry ? (
                  
                  /* INDIVIDUAL INQUIRY DETAIL */
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-lg space-y-6">
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="text-xs font-bold text-slate-500 hover:text-brand cursor-pointer focus:outline-none flex items-center space-x-1"
                    >
                      <span>← 수신함 리스트로 돌아가기</span>
                    </button>

                    <div className="pb-4 border-b border-slate-100 space-y-2">
                      <div className="text-[10px] font-bold text-brand uppercase tracking-wider bg-brand/5 px-2 py-1 rounded w-fit">
                        Client Quotation Request
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">
                        {selectedInquiry.subject}
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs font-medium text-slate-500">
                        <div>
                          <div className="text-[10px] text-slate-400">송신 고객</div>
                          <div className="text-slate-800">{selectedInquiry.name}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">기관/회사명</div>
                          <div className="text-slate-800">{selectedInquiry.company || '-'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">연락 이메일</div>
                          <a href={`mailto:${selectedInquiry.email}`} className="text-brand hover:underline">{selectedInquiry.email}</a>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">수신 일시</div>
                          <div className="text-slate-800 font-mono">
                            {selectedInquiry.createdAt.toLocaleDateString('ko-KR', {
                              year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-400">상세 요청 명세</h4>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {selectedInquiry.content}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between">
                      <button
                        onClick={(e) => { handleDeleteInquiry(selectedInquiry.id, e); }}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer focus:outline-none"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>영구 삭제</span>
                      </button>
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=[ITCON] 문의하신 내용에 대한 기술 제안서 회신`}
                        className="px-5 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        아웃룩/메일 답장하기
                      </a>
                    </div>
                  </div>
                ) : (
                  
                  /* INBOX LISTING */
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MailOpen className="h-5 w-5 text-brand" />
                        <h3 className="font-bold text-slate-900 text-sm">고객 인프라 문의 메일 수신함</h3>
                      </div>
                      <span className="text-xs font-medium text-slate-400">전체 {inquiries.length}건</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {inquiries.length === 0 ? (
                        <div className="py-20 text-center text-xs text-slate-400 space-y-1.5">
                          <MailOpen className="h-8 w-8 text-slate-300 mx-auto" />
                          <div>현재 수신된 견적 신청 건이 없습니다.</div>
                        </div>
                      ) : (
                        inquiries.map((inquiry) => (
                          <div
                            key={inquiry.id}
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-5 hover:bg-slate-50/50 transition-all duration-150 cursor-pointer flex justify-between items-center gap-4"
                          >
                            <div className="space-y-1 text-left flex-1">
                              <div className="flex items-center space-x-2 text-slate-500 text-xs">
                                <span className="font-bold text-slate-800">{inquiry.name}</span>
                                <span>|</span>
                                <span className="text-slate-400 font-mono text-[11px]">{inquiry.company || '개인'}</span>
                              </div>
                              <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                                {inquiry.subject}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {inquiry.content}
                              </p>
                            </div>

                            <div className="flex items-center space-x-4 shrink-0">
                              <span className="text-[10px] font-mono text-slate-400">
                                {inquiry.createdAt.toLocaleDateString('ko-KR', {
                                  month: '2-digit', day: '2-digit'
                                })}
                              </span>
                              <button
                                onClick={(e) => handleDeleteInquiry(inquiry.id, e)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer focus:outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: BOARD CONTROLS */}
            {activeTab === 'boards' && (
              <motion.div
                key="boards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Notices oversight */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                      <span className="w-2 h-2 bg-brand rounded-full" />
                      <span>공지사항 목록 관리 ({notices.length}건)</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {notices.length === 0 ? (
                      <div className="p-10 text-center text-xs text-slate-400">공지사항이 없습니다.</div>
                    ) : (
                      notices.map((n) => (
                        <div key={n.id} className="p-4 flex justify-between items-center text-xs">
                          <div className="text-left space-y-0.5 max-w-md">
                            <h4 className="font-bold text-slate-800 line-clamp-1">{n.title}</h4>
                            <div className="text-slate-400 font-mono text-[10px]">작성: {n.authorName} | {n.createdAt.toLocaleDateString()}</div>
                          </div>
                          <button
                            onClick={() => handleDeleteBoardItem('notice', n.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer focus:outline-none"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* General Board oversight */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                      <span className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span>자유 게시판 질의글 관리 ({posts.length}건)</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {posts.length === 0 ? (
                      <div className="p-10 text-center text-xs text-slate-400">작성된 일반 게시글이 없습니다.</div>
                    ) : (
                      posts.map((p) => (
                        <div key={p.id} className="p-4 flex justify-between items-center text-xs">
                          <div className="text-left space-y-0.5 max-w-md">
                            <h4 className="font-bold text-slate-800 line-clamp-1">{p.title}</h4>
                            <div className="text-slate-400 font-mono text-[10px]">작성: {p.authorName} | {p.createdAt.toLocaleDateString()}</div>
                          </div>
                          <button
                            onClick={() => handleDeleteBoardItem('board', p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer focus:outline-none"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
