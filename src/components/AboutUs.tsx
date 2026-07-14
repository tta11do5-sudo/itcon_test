import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Target, Eye, Compass, Award, Users, ShieldCheck, Clock, MapPin, Phone, Printer, Train, Bus, Info } from 'lucide-react';
import { motion } from 'motion/react';

const KakaoMapComponent: React.FC = () => {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden group select-none">
      {/* Real Interactive Map Iframe (Using Google Maps Embed with no key requirement, completely accurate and legal) */}
      <iframe
        title="ITCON Map"
        src="https://maps.google.com/maps?q=서울특별시%20영등포구%20양평로21길%2026&t=&z=17&ie=UTF8&iwloc=&output=embed"
        className="w-full h-full border-0 grayscale-[10%]"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      
      {/* Interactive Badge & Actions Overlay */}
      {/* Top Left Badge */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl shadow-md z-10 flex items-center space-x-2">
        <div className="w-5 h-5 bg-[#FFE600] rounded-full flex items-center justify-center font-black text-slate-900 text-[10px]">
          K
        </div>
        <div>
          <h5 className="font-bold text-[11px] text-slate-800 leading-tight">카카오맵 연동 완료</h5>
          <p className="text-[9px] text-slate-400">아이에스비즈타워 1차</p>
        </div>
      </div>

      {/* Bottom Actions Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 z-10 pointer-events-none">
        {/* Left: Indicator */}
        <div className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/90 shadow-lg pointer-events-auto">
          📍 ㈜아이티콘 (2601호)
        </div>
        
        {/* Right: Kakao Map Buttons */}
        <div className="flex space-x-2 pointer-events-auto w-full sm:w-auto">
          <a 
            href="https://map.kakao.com/link/to/ITCON,37.539423,126.891632" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial bg-[#FFE600] hover:bg-[#F2DA00] text-slate-950 text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-pulse" />
            <span>카카오맵 길찾기</span>
            <span>→</span>
          </a>
          <a 
            href="https://map.kakao.com/link/map/ITCON,37.539423,126.891632" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>큰 지도보기</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};

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
    {
      year: '2025',
      title: '특허등록 (제10-2756452호)',
      detail: '',
    },
    {
      year: '2021',
      title: '정보통신공사업 등록 (제293516호)',
      detail: '',
    },
    {
      year: '2016',
      title: '서울시 영등포구 양평로 21길 26 사업장 이전',
      detail: 'Lenovo Korea | KT 매니지드 서버공급 협정',
    },
    {
      year: '2014',
      title: '기업부설연구소 등록 (제2014111748호)',
      detail: 'KT솔루션 전문점 계약, KT Gigaoffice 위탁점(AA00893)',
    },
    {
      year: '2013',
      title: '연구전담부서 (제2013151899호)',
      detail: 'HP 채널파트너 등록',
    },
    {
      year: '2009',
      title: '벤처기업 등록 (제20090102200호)',
      detail: 'Dell International 시스템통합 사업자',
    },
    {
      year: '2007',
      title: '주식회사 아이티콘 법인설립',
      detail: 'KT 기업고객본부 호스팅 및 시스템 협력사 협정',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Hero section */}
      <section className="bg-slate-900 text-white py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-slate-900 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">About ITCON</h1>
          <p className="text-sm md:text-base text-white max-w-2xl mx-auto leading-relaxed">
            ITCON은 축적된 데이터 테크놀로지와 숙련된 전담 엔지니어 팀을 갖춘 <br />
            <span className="text-white font-semibold">서버, 스토리지, 가상화 전문기업입니다.</span>
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
                {milestone.detail && (
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    {milestone.detail}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Directions / Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">찾아오시는 길</h2>
          <p className="text-xs text-slate-500">ITCON 본사로 오시는 길을 상세히 안내해 드립니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Information */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-100 space-y-6">
              
              {/* Address */}
              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                  <MapPin className="h-5 w-5 text-brand" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">ADDRESS</span>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    서울시 영등포구 양평로21길 26
                  </p>
                  <p className="text-xs text-slate-500">
                    아이에스BIZ타워 1차 26층 2601호 (우: 07207)
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                    <Phone className="h-4 w-4 text-brand" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 block">TEL</span>
                    <p className="text-xs font-semibold text-slate-800">02-2070-3200</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                    <Printer className="h-4 w-4 text-brand" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 block">FAX</span>
                    <p className="text-xs font-semibold text-slate-800">02-2070-3210</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Transit instructions */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 flex-1 flex flex-col justify-center">
              <h4 className="font-bold text-sm text-slate-800 border-b pb-2 font-sans">대중교통 안내</h4>
              
              <div className="space-y-4">
                {/* Subway */}
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-[#A17E46]/10 text-[#A17E46] rounded-lg mt-0.5 font-bold text-[10px] w-8 text-center shrink-0">
                    지하철
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      <span className="text-[#A17E46] mr-1.5">9호선</span>선유도역
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                      9호선 선유도역 7번 출구로 나와 그대로 직진하시면 도보 약 3분 거리에 위치하고 있습니다.
                    </p>
                  </div>
                </div>

                {/* Bus */}
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-[#0068b7]/10 text-[#0068b7] rounded-lg mt-0.5 font-bold text-[10px] w-8 text-center shrink-0">
                    버스
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 font-sans">선유도역·롯데제과 정류장 하차</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                      간선 버스: 605, 661, 70-2, 700 / 지선 버스: 5620, 6514, 6620, 6631
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map display */}
          <div className="lg:col-span-7 h-[350px] md:h-[450px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-inner relative">
            <KakaoMapComponent />
          </div>
        </div>
      </section>

      {/* 6. Contact Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-brand/5 py-12 rounded-3xl border border-brand/10 space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">당사의 차별화된 솔루션으로 비즈니스 혁신을 실현해 보십시오.</h3>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          서버 부하 분산, 클라우드 이전, 완벽한 백업 환경 구축 등 어떤 요구사항이든 ITCON의 검증된 전문 엔지니어 팀이 성실히 안내해 드립니다.
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
