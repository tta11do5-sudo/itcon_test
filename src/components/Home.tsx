import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Notice } from '../types';
import { ArrowRight, Cpu, HardDrive, ShieldCheck, FileText, ChevronRight, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { setPage, config } = useApp();
  const [latestNotices, setLatestNotices] = useState<Notice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  
  // Real-time site stats for Admin Dashboard preview widget
  const [stats, setStats] = useState({ inquiriesCount: 128, noticesCount: 4, postsCount: 12 });

  useEffect(() => {
    const fetchLatestNotices = async () => {
      try {
        const noticesQuery = query(
          collection(db, 'notices'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(noticesQuery);
        const noticesList: Notice[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          noticesList.push({
            id: doc.id,
            title: data.title || '',
            content: data.content || '',
            authorName: data.authorName || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });
        setLatestNotices(noticesList);
      } catch (err) {
        console.error("Notice fetch error, using sample notices:", err);
      } finally {
        setLoadingNotices(false);
      }
    };

    const fetchCounts = async () => {
      try {
        const inquiriesSnap = await getDocs(collection(db, 'inquiries'));
        const noticesSnap = await getDocs(collection(db, 'notices'));
        const boardSnap = await getDocs(collection(db, 'board'));
        setStats({
          inquiriesCount: inquiriesSnap.size || 128,
          noticesCount: noticesSnap.size || 4,
          postsCount: boardSnap.size || 12,
        });
      } catch (err) {
        console.warn("Could not load actual stats (using premium defaults):", err);
      }
    };

    fetchLatestNotices();
    fetchCounts();
  }, []);

  const coreServices = [
    {
      icon: <Cpu className="h-5 w-5 text-[#0056b3]" />,
      title: 'ENTERPRISE SERVER',
      shortTitle: 'SERVER',
      desc: '고가용성과 독보적인 연산력을 갖춘 엔터프라이즈급 서버 라인업을 최적 설계하여 공급합니다.',
      tags: ['x86 가용 서버', 'GPU 인공지능 서버', '고집적 랙마운트']
    },
    {
      icon: <HardDrive className="h-5 w-5 text-[#0056b3]" />,
      title: 'NEXT-GEN STORAGE',
      shortTitle: 'STORAGE',
      desc: '초고속 올플래시 스토리지부터 대용량 하이브리드 솔루션까지, 완벽한 백업 및 가동 안정성을 갖춘 스토리지 인프라를 보장합니다.',
      tags: ['All-Flash NVMe', '하이브리드 SAN/NAS', '오브젝트 스토리지']
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#0056b3]" />,
      title: 'VIRTUAL & SECURITY S/W',
      shortTitle: 'Solution',
      desc: '클라우드 가상화 인프라, 백업 자동화 시스템, 최고 규격의 데이터 보호 및 보안 소프트웨어를 최적 통합 제안합니다.',
      tags: ['서버/스토리지 가상화', '실시간 백업 솔루션', '랜섬웨어 방어']
    }
  ];

  const sampleNotices: Notice[] = [
    {
      id: 'sample-1',
      title: '[안내] ITCON 공식 웹사이트 신규 런칭 및 사업부 개편 안내',
      content: '안녕하세요. ITCON 입니다. 차세대 솔루션 맞춤 공급을 강화하기 위해 공식 웹사이트를 개편 런칭하였습니다.',
      authorName: '관리자',
      createdAt: new Date('2026-07-01'),
      updatedAt: new Date('2026-07-01'),
    },
    {
      id: 'sample-2',
      title: '[보도] 고성능 AI GPU 서버 신규 공급 계약 체결 성과',
      content: '대규모 데이터 연산을 지원하기 위한 고규격 GPU 연산 인프라 공급 계약을 성황리에 수주하였습니다.',
      authorName: '홍보팀',
      createdAt: new Date('2026-06-25'),
      updatedAt: new Date('2026-06-25'),
    }
  ];

  const noticesToDisplay = latestNotices.length > 0 ? latestNotices : sampleNotices;

  return (
    <div className="bg-white min-h-screen space-y-16 pb-20">
      
      {/* 1. Main Split-Hero Block (Clean Minimalism Style) */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[680px]">
          
          {/* Left Column (3/5 width on Desktop) */}
          <div className="w-full lg:w-3/5 p-6 md:p-12 lg:p-16 flex flex-col justify-center gap-8 relative z-10">
            <div className="space-y-5">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-3 py-1 bg-blue-50 text-[#0056b3] text-xs font-bold rounded-md tracking-wider"
              >
                Premium IT Solutions Partner
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-slate-900 tracking-tight"
                id="hero-title"
              >
                {config.sloganTitle.includes('\n') ? (
                  <>
                    {config.sloganTitle.split('\n')[0]} <br/>
                    <span className="text-[#0056b3]">{config.sloganTitle.split('\n')[1]}</span>
                  </>
                ) : config.sloganTitle.includes(', ') ? (
                  <>
                    {config.sloganTitle.split(', ')[0]} <br/>
                    <span className="text-[#0056b3]">{config.sloganTitle.split(', ')[1]}</span>
                  </>
                ) : config.sloganTitle.includes('ITCON') ? (
                  <>
                    {config.sloganTitle.replace('ITCON', '').trim()} <br/>
                    <span className="text-[#0056b3]">ITCON</span>
                  </>
                ) : (
                  <>
                    혁신적인 IT솔루션의 표준 <br/>
                    <span className="text-[#0056b3]">{config.sloganTitle}</span>
                  </>
                )}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-slate-500 max-w-md leading-relaxed whitespace-pre-line"
                id="hero-subtitle"
              >
                {config.sloganSubtitle}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => setPage('contact')}
                className="px-8 py-4 bg-[#0A2540] hover:bg-[#0056b3] text-white font-bold rounded-lg text-sm transition-all shadow-md cursor-pointer focus:outline-none"
                id="hero-contact-btn"
              >
                솔루션 문의하기
              </button>
              <button
                onClick={() => setPage('solutions')}
                className="px-8 py-4 border border-slate-200 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                id="hero-solutions-btn"
              >
                서비스 안내서 (PDF)
              </button>
            </motion.div>
            
            {/* Minimal Grid categories matching design style exactly */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              {coreServices.map((service, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-white shadow-sm rounded-lg mb-3 flex items-center justify-center">
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 tracking-wider uppercase">{service.shortTitle || service.title.split(' ')[1] || service.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">{service.desc.substring(0, 32)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (2/5 width on Desktop) */}
          <div className="w-full lg:w-2/5 bg-slate-50 p-6 md:p-8 lg:p-12 border-l border-slate-100 relative overflow-hidden flex flex-col justify-center">
            {/* Blurred ambient bubble */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 space-y-6">
              
              {/* Admin Dashboard Preview Widget */}
              <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-slate-900 text-sm">
                    Admin Dashboard <span className="text-xs font-normal text-slate-400">v1.2</span>
                  </h2>
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-8 bg-[#0056b3] rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Total Inquiries</p>
                      <p className="text-xl font-black text-slate-800">
                        {stats.inquiriesCount} <span className="text-[10px] text-green-500 font-normal ml-1">+12%</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-8 bg-slate-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Notice Posts</p>
                      <p className="text-xl font-black text-slate-800">{stats.noticesCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-xs font-bold text-slate-900 mb-2">Recent Site Activities</p>
                  <ul className="text-[11px] space-y-2">
                    {noticesToDisplay.slice(0, 2).map((notice) => (
                      <li key={notice.id} className="flex justify-between text-slate-500 border-b border-slate-50 pb-1.5">
                        <span className="truncate max-w-[180px]">{notice.title}</span>
                        <span className="text-slate-400 shrink-0 font-mono">
                          {notice.createdAt.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                        </span>
                      </li>
                    ))}
                    <li className="flex justify-between text-slate-500 border-b border-slate-50 pb-1.5">
                      <span>보안 가상화 솔루션 분석 완료</span>
                      <span className="text-slate-400">1d ago</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* System Health Widget */}
              <div className="bg-[#0A2540] rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                
                <h3 className="text-[10px] opacity-60 mb-1 uppercase tracking-widest font-bold">System Health</h3>
                <p className="text-lg font-light mb-4">All systems operational.</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex gap-1 items-end">
                      <div className="w-1 bg-blue-400 h-8 rounded-full"></div>
                      <div className="w-1 bg-blue-400 h-12 rounded-full"></div>
                      <div className="w-1 bg-blue-400 h-6 rounded-full"></div>
                      <div className="w-1 bg-blue-400 h-10 rounded-full"></div>
                      <div className="w-1 bg-blue-400 h-14 rounded-full"></div>
                      <div className="w-1 bg-white h-16 rounded-full animate-pulse"></div>
                      <div className="w-1 bg-blue-400 h-12 rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">CPU 24%</span>
                  </div>
                  <div className="h-px bg-white/10 w-full"></div>
                  <div className="text-[10px] opacity-50 font-mono">
                    Server Core A: Node-04 [Active]
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Brand Identity / Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-150/50 relative z-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: '공급 레퍼런스 건수' },
            { value: '19년+', label: '솔루션 전문 업력' },
            { value: '100%', label: '사후 기술 지원 만족도' },
            { value: '24/7', label: '장애 대응 모니터링' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center space-y-1.5">
              <div className="text-2xl md:text-4xl font-bold text-[#0A2540] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-semibold text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Solutions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            인프라 코어 비즈니스 영역
          </h2>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
            ITCON은 각 제조사별 파트너십을 바탕으로 최신의 서버, 스토리지 솔루션 및 보안 가상화 제품군을 원스톱 설계, 공급 및 전담 유지보수합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreServices.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-blue-50/50 w-fit rounded-xl">
                  {service.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setPage('solutions')}
                  className="inline-flex items-center text-xs font-bold text-[#0056b3] hover:underline space-x-1 cursor-pointer focus:outline-none"
                >
                  <span>솔루션 상세보기</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Latest Notices & Enterprise Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Latest News & Notices */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#0A2540]" />
                <h3 className="text-lg font-bold text-slate-900">최신 공지 및 보도 자료</h3>
              </div>
              <button
                onClick={() => setPage('boards')}
                className="text-xs font-semibold text-slate-500 hover:text-[#0A2540] inline-flex items-center space-x-0.5 cursor-pointer focus:outline-none"
              >
                <span>전체보기</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {loadingNotices ? (
                <div className="py-6 flex justify-center">
                  <div className="h-5 w-5 border-2 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                noticesToDisplay.map((notice) => (
                  <button
                    key={notice.id}
                    onClick={() => setPage('boards')}
                    className="w-full text-left bg-white p-5 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 block space-y-2 group cursor-pointer focus:outline-none"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#0056b3] transition-colors line-clamp-1">
                        {notice.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-4">
                        {notice.createdAt.toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Quick Business Card Info */}
          <div className="bg-[#0A2540] text-white p-6 rounded-2xl flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/10 rounded-full blur-2xl"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 text-brand">
                <PhoneCall className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-base font-bold tracking-tight">서버 스토리지 견적 및 솔루션 맞춤 설계 지원</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                서버 증설, 노후 스토리지 교체, 클라우드 가상화 마이그레이션이 고민이신가요? ITCON의 전문 설계 인력이 무상으로 기술 사전 진단 및 제품 제안을 드립니다.
              </p>
            </div>

            <div className="mt-8 space-y-4 relative z-10">
              <div className="bg-[#071c30] p-4 rounded-xl space-y-1 border border-white/5">
                <div className="text-[10px] uppercase text-blue-400 font-mono font-bold tracking-wider">Direct Business Support</div>
                <div className="text-lg font-bold tracking-tight">02-2070-3200</div>
                <div className="text-[11px] text-slate-400">이메일: sales@itcon.kr</div>
              </div>
              <button
                onClick={() => setPage('contact')}
                className="w-full py-3 bg-[#0056b3] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all inline-flex justify-center items-center space-x-1.5 cursor-pointer focus:outline-none shadow-md shadow-blue-900/20"
              >
                <span>온라인 문의 작성하기</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
