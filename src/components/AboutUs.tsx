import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, Eye, Compass, Award, Users, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutUs: React.FC = () => {
  const { setPage } = useApp();

  const coreValues = [
    {
      icon: <Award className="h-6 w-6 text-brand" />,
      title: '전문성 (Professionalism)',
      desc: '서버, 스토리지 엔지니어의 독보적 실력과 글로벌 벤더 파트너 자격을 바탕으로 기술 보증 수준의 신뢰를 확보합니다.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand" />,
      title: '신뢰성 (Reliability)',
      desc: '철저한 사전 부하 진단, 24/7 밀착 관제, 완벽한 백업 설계를 통해 기업 데이터와 무중단 가동 환경을 안전하게 수호합니다.',
    },
    {
      icon: <Users className="h-6 w-6 text-brand" />,
      title: '고객성공 (Customer Success)',
      desc: '무조건적인 고비용 제안 대신, 기업의 비즈니스 규모에 맞춘 예산 최적화 인프라를 지향하는 진정한 조력자입니다.',
    },
  ];

  const milestones = [
    { year: '2026', title: '인프라 혁신 리뉴얼 및 웹 플랫폼 통합', detail: '디지털 트랜스포메이션 가속화를 위한 웹 솔루션 주문 및 고객지원 시스템 전격 통합 런칭.' },
    { year: '2024', title: '초고속 AI GPU 서버 공급 라인 증설', detail: '딥러닝 및 거대 생성 모델 전용 가속 서버 엔지니어링팀을 발족하고 대규모 가속 서버 구축 계약 수주.' },
    { year: '2022', title: '글로벌 엔터프라이즈 스토리지 골드 파트너쉽', detail: '세계 최고 수준의 스토리지 및 가상화 소프트웨어 벤더사들과 긴밀한 골드 파트너 관계 체결.' },
    { year: '2020', title: 'HCI(Hyper-Converged Infrastructure) 사업 전개', detail: '차세대 서버 가상화 시스템 및 하드웨어 가상 디바이스 통합 비즈니스로의 도약.' },
    { year: '2018', title: '주식회사 ITCON (아이티콘) 설립', detail: '정예 서버 엔지니어 5인으로 시작하여 서울시 영등포구 본사 설립 및 데이터센터 전담 유지보수 개시.' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Hero section */}
      <section className="bg-slate-900 text-white py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-slate-900 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">About ITCON</h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ITCON은 축적된 데이터 테크놀로지와 숙련된 전담 엔지니어 팀을 갖춘 <span className="text-brand font-semibold">서버, 스토리지, 가상화 전문 기업</span>입니다.
          </p>
        </div>
      </section>

      {/* 2. Vision & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-md shadow-slate-100 flex items-start space-x-5">
            <div className="p-3.5 bg-brand/5 rounded-xl shrink-0">
              <Eye className="h-8 w-8 text-brand" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">우리의 비전 (Vision)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                "가장 지능적이고 가장 탄탄한 IT 인프라 최적화를 통해, 고객사 비즈니스의 무한 성장을 현실로 이끄는 독보적 동반자"가 되는 것이 ITCON의 궁극적 목표입니다.
              </p>
            </div>
          </div>

          {/* Mission card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-md shadow-slate-100 flex items-start space-x-5">
            <div className="p-3.5 bg-brand/5 rounded-xl shrink-0">
              <Target className="h-8 w-8 text-brand" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">우리의 미션 (Mission)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                "정직한 엔지니어링, 거품 없는 최적의 장비 수급, 24시간 신뢰할 수 있는 사후 긴급 지원을 핵심 축 삼아 기업 인프라의 견고한 안심을 책임집니다."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values */}
      <section className="bg-slate-100/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">우리의 핵심 가치</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              ITCON은 타협하지 않는 높은 전문성과 철저한 무중단 약속을 지키며 대한민국 기업들의 디지털 뼈대를 구축합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="p-2.5 bg-brand/5 w-fit rounded-lg">
                  {value.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{value.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. History / Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">ITCON 연혁</h2>
          <p className="text-xs text-slate-500">신뢰와 기술력으로 묵묵히 걸어온 ITCON의 발자취를 소개합니다.</p>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 py-4 space-y-12">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Dot on timeline */}
              <div className="absolute -left-[9px] top-1.5 bg-white border-2 border-brand w-4.5 h-4.5 rounded-full group-hover:bg-brand transition-colors duration-200" />

              {/* Year indicator desktop */}
              <div className="hidden md:block absolute right-full mr-12 top-1.5 text-right">
                <span className="text-2xl font-black text-brand tracking-tight">
                  {milestone.year}
                </span>
              </div>

              {/* Mobile year and details */}
              <div className="space-y-1.5">
                <div className="md:hidden">
                  <span className="text-lg font-bold text-brand block">
                    {milestone.year}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-brand transition-colors">
                  {milestone.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  {milestone.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Contact Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-brand/5 py-12 rounded-3xl border border-brand/10 space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">당사의 뛰어난 솔루션을 통해 혁신을 달성하십시오.</h3>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          서버 부하 분산, 클라우드 이전, 완벽한 백업 환경 구축 등 어떤 니즈이든 ITCON의 검증된 고정 엔지니어링팀이 성실히 안내해 드립니다.
        </p>
        <button
          onClick={() => setPage('contact')}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-lg transition-colors cursor-pointer focus:outline-none shadow-md shadow-brand/10"
        >
          <span>맞춤형 하드웨어 견적 요청하기</span>
        </button>
      </section>
    </div>
  );
};
