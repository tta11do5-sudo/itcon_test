import React, { useState } from 'react';
import { Cpu, HardDrive, ShieldAlert, CpuIcon, Layers, Server, ShieldCheck, Database, RefreshCw, Layers3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SolutionType = 'all' | 'server' | 'storage' | 'software';

export const Solutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SolutionType>('all');

  const categories = [
    { id: 'all' as SolutionType, label: '전체 솔루션' },
    { id: 'server' as SolutionType, label: '서버 (Server)' },
    { id: 'storage' as SolutionType, label: '스토리지 (Storage)' },
    { id: 'software' as SolutionType, label: '소프트웨어 (Software)' },
  ];

  const solutionsData = [
    {
      id: 'srv-1',
      category: 'server',
      icon: <Server className="h-6 w-6 text-brand" />,
      title: 'x86 고성능 비즈니스 랙 서버',
      subtitle: 'Intel / AMD Scalable 기반 엔터프라이즈 서버',
      desc: '고밀도 1U/2U 아키텍처에 최신 고클럭 멀티코어 프로세서를 탑재하여 대규모 트랜잭션과 웹 가상화 노드를 안정적으로 지원합니다.',
      specs: [
        '최신 AMD EPYC™ 또는 Intel® Xeon® Scalable 지원',
        '최대 8TB DDR5 ECC 메모리 지원',
        'PCIe Gen5 슬롯 및 고속 NVMe 드라이브 베이',
      ],
      badge: 'Best Seller',
    },
    {
      id: 'srv-2',
      category: 'server',
      icon: <CpuIcon className="h-6 w-6 text-brand" />,
      title: '고집적 AI & GPU 가속 연산 서버',
      subtitle: '딥러닝 모델 훈련 및 LLM 추론 최적화 인프라',
      desc: 'NVIDIA Tensor Core 가속기를 다중 탑재한 AI 특화 서버로 대용량 데이터 전처리 및 복잡한 인공지능 분석 가동을 극대화합니다.',
      specs: [
        '최대 8x NVIDIA H100 / A100 Tensor Core 탑재 가능',
        'NVIDIA NVLink® 고대역 상호연결 인터페이스',
        '초고효율 리던던트 전원 공급 장치 (Titanium 등급)',
      ],
      badge: 'AI 특화',
    },
    {
      id: 'stg-1',
      category: 'storage',
      icon: <HardDrive className="h-6 w-6 text-brand" />,
      title: '초고속 올플래시 NVMe 어레이',
      subtitle: '밀리초 이하의 가동 반응을 보장하는 최고급 스토리지',
      desc: '금융 결제, 초대형 ERP, 미션 크리티컬 DB 운영 시 I/O 병목현상을 완벽 제거하고 전례 없는 IOPS를 제공합니다.',
      specs: [
        'Active-Active 듀얼 컨트롤러 아키텍처 무중단 이중화',
        '최대 200,000 IOPS 및 PCIe Gen4 NVMe 기본 통합',
        '실시간 인라인 중복제거 및 압축율 최고 5:1 보증',
      ],
      badge: '초고속 성능',
    },
    {
      id: 'stg-2',
      category: 'storage',
      icon: <Database className="h-6 w-6 text-brand" />,
      title: '하이브리드 유니파이드 SAN/NAS 스토리지',
      subtitle: '스마트 Tiering 기반 가성비와 확장성 중심 스토리지',
      desc: '데이터의 빈도에 따라 SSD 캐싱과 고용량 SATA HDD를 동적으로 배분하여 비용 효율성과 속도를 모두 챙깁니다.',
      specs: [
        'SAN (FC, iSCSI) 및 NAS (NFS, SMB) 유니파이드 지원',
        '자동 스토리지 계층화 (Auto-Tiering)',
        '단일 파일 시스템 최대 수십 PB 용량 확장 스케일아웃',
      ],
      badge: '대용량 저장',
    },
    {
      id: 'sw-1',
      category: 'software',
      icon: <Layers className="h-6 w-6 text-brand" />,
      title: 'HCI 및 가상화 제어 소프트웨어',
      subtitle: '단일 통합 콘솔 기반 서버 & 스토리지 가상 가동',
      desc: '하드웨어 리소스를 완벽 가상화하여 효율성을 극대화하고 소프트웨어 정의 인프라(SDI)를 손쉽게 구축할 수 있도록 합니다.',
      specs: [
        '물리 서버 파티셔닝 및 리스크 격리 기능',
        '중앙 집중식 통합 하이퍼바이저 실시간 리소스 모니터링',
        '라이브 마이그레이션 (Live Migration) 무중단 가상머신 이동',
      ],
      badge: '클라우드 인프라',
    },
    {
      id: 'sw-2',
      category: 'software',
      icon: <RefreshCw className="h-6 w-6 text-brand" />,
      title: '엔터프라이즈 백업 & WORM 보안 솔루션',
      subtitle: '랜섬웨어 불변 백업 및 완벽 비상 대처 시스템',
      desc: '최신 위협(랜섬웨어)에 의한 원본 백업본 오염을 막기 위한 Write-Once-Read-Many 불변 스토리지 및 자동 스케줄 복원 솔루션입니다.',
      specs: [
        '불변 원격 백업 볼트 (Immutable Backup Vault)',
        '재해 상황 시 클릭 한 번으로 VM 신속 자동 복원 보증',
        '증분 백업 가속화 특허 알고리즘 장착',
      ],
      badge: '데이터 보안',
    },
  ];

  const filteredSolutions = activeTab === 'all' 
    ? solutionsData 
    : solutionsData.filter(s => s.category === activeTab);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-16 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">솔루션 & 서비스</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ITCON은 세계 최고의 가동 안정성을 갖춘 서버, 스토리지를 엄선하고 이를 원활히 매니지드할 소프트웨어 통합 패키지를 설계 제안합니다.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer focus:outline-none ${
                activeTab === cat.id
                  ? 'bg-brand text-white shadow-md shadow-brand/10'
                  : 'bg-white text-slate-600 hover:text-brand hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredSolutions.map((solution) => (
              <motion.div
                layout
                key={solution.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-brand/5 rounded-xl group-hover:bg-brand/10 transition-colors">
                      {solution.icon}
                    </div>
                    {solution.badge && (
                      <span className="text-[10px] font-bold bg-brand/10 text-brand px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {solution.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand transition-colors">
                      {solution.title}
                    </h3>
                    <h4 className="text-xs font-medium text-slate-400">
                      {solution.subtitle}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {solution.desc}
                  </p>
                </div>

                {/* Tech Specs */}
                <div className="mt-6 pt-6 border-t border-slate-50 space-y-3 bg-slate-50/50 p-4 rounded-xl">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Core Technical Specification
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {solution.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start space-x-2">
                        <span className="text-brand font-bold shrink-0 mt-0.5">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Tech Support Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">서버 스토리지 견적 및 솔루션 맞춤 설계 지원</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ITCON의 전문 설계 자문진이 서버 스토리지 견적 및 고객 니즈에 맞는 솔루션을 제공 합니다.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('contact-form-anchor');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand/20 cursor-pointer"
            >
              <span>무상 엔지니어링 상담 신청</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
