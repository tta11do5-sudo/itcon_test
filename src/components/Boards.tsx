import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { supabase } from '../supabase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Notice, BoardPost, BoardSubTab } from '../types';
import { Megaphone, MessageSquare, Search, Plus, Calendar, User as UserIcon, ArrowLeft, Trash2, Edit2, ShieldAlert, LogIn, Check, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Boards: React.FC = () => {
  const { user, login, isAdmin, setPage } = useApp();
  const [activeTab, setActiveTab] = useState<BoardSubTab>('notice');

  // Lists from DB
  const [notices, setNotices] = useState<Notice[]>([]);
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>([]);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Notice | BoardPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // Connection modes
  const [noticesSyncMode, setNoticesSyncMode] = useState<'supabase' | 'firestore'>('supabase');
  const [boardSyncMode, setBoardSyncMode] = useState<'supabase' | 'firestore'>('supabase');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  // Loading indicator
  const [loading, setLoading] = useState({ notices: true, board: true });

  // Notice Snapshot / Supabase listener
  useEffect(() => {
    let unsubscribeFirestore = () => {};
    let isMounted = true;

    const loadNotices = async () => {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (isMounted && data) {
          const list: Notice[] = data.map((item: any) => ({
            id: String(item.id),
            title: item.title || '',
            content: item.content || '',
            authorName: item.author_name || '관리자',
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          }));
          setNotices(list);
          setNoticesSyncMode('supabase');
          setLoading(prev => ({ ...prev, notices: false }));
        }
      } catch (err) {
        console.warn("Could not fetch notices from Supabase, falling back to Firestore:", err);
        if (isMounted) setNoticesSyncMode('firestore');

        const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
        unsubscribeFirestore = onSnapshot(noticesQuery, (snapshot) => {
          const noticesList: Notice[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            noticesList.push({
              id: docSnapshot.id,
              title: data.title || '',
              content: data.content || '',
              authorName: data.authorName || '관리자',
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            });
          });
          if (isMounted) {
            setNotices(noticesList);
            setLoading(prev => ({ ...prev, notices: false }));
          }
        }, (firestoreError) => {
          console.error("Firestore notice fallback error:", firestoreError);
          if (isMounted) setLoading(prev => ({ ...prev, notices: false }));
        });
      }
    };

    loadNotices();

    // Supabase real-time subscription
    const channel = supabase
      .channel('notices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
        loadNotices();
      })
      .subscribe();

    return () => {
      isMounted = false;
      unsubscribeFirestore();
      channel.unsubscribe();
    };
  }, []);

  // Board Snapshot / Supabase listener
  useEffect(() => {
    let unsubscribeFirestore = () => {};
    let isMounted = true;

    const loadBoardPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('board')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (isMounted && data) {
          const list: BoardPost[] = data.map((item: any) => ({
            id: String(item.id),
            title: item.title || '',
            content: item.content || '',
            authorName: item.author_name || '사용자',
            authorId: item.author_id || '',
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          }));
          setBoardPosts(list);
          setBoardSyncMode('supabase');
          setLoading(prev => ({ ...prev, board: false }));
        }
      } catch (err) {
        console.warn("Could not fetch board posts from Supabase, falling back to Firestore:", err);
        if (isMounted) setBoardSyncMode('firestore');

        const boardQuery = query(collection(db, 'board'), orderBy('createdAt', 'desc'));
        unsubscribeFirestore = onSnapshot(boardQuery, (snapshot) => {
          const postsList: BoardPost[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            postsList.push({
              id: docSnapshot.id,
              title: data.title || '',
              content: data.content || '',
              authorName: data.authorName || '익명',
              authorId: data.authorId || '',
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            });
          });
          if (isMounted) {
            setBoardPosts(postsList);
            setLoading(prev => ({ ...prev, board: false }));
          }
        }, (firestoreError) => {
          console.error("Firestore board fallback error:", firestoreError);
          if (isMounted) setLoading(prev => ({ ...prev, board: false }));
        });
      }
    };

    loadBoardPosts();

    // Supabase real-time subscription
    const channel = supabase
      .channel('board-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'board' }, () => {
        loadBoardPosts();
      })
      .subscribe();

    return () => {
      isMounted = false;
      unsubscribeFirestore();
      channel.unsubscribe();
    };
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (activeTab === 'notice' && !isAdmin) {
      alert('공지사항 작성 권한이 없습니다.');
      return;
    }

    if (activeTab === 'general' && !user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      const isNotice = activeTab === 'notice';
      const authorName = isNotice ? (user?.displayName || '관리자') : (user?.displayName || '사용자');
      const authorId = isNotice ? '' : (user?.uid || 'anonymous');

      // 1. Write to Supabase
      const sbPayload: any = {
        title: formTitle,
        content: formContent,
        author_name: authorName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (!isNotice) {
        sbPayload.author_id = authorId;
      }

      const table = isNotice ? 'notices' : 'board';
      const { error: sbError } = await supabase.from(table).insert([sbPayload]);
      if (sbError) {
        console.warn(`Supabase ${table} insert error (Ensure table is created in Supabase console):`, sbError);
      }

      // 2. Dual-save/Fallback to Firestore to keep data intact
      const targetCollection = isNotice ? 'notices' : 'board';
      const fsPayload: any = {
        title: formTitle,
        content: formContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        authorName,
      };
      if (!isNotice) {
        fsPayload.authorId = authorId;
      }

      await addDoc(collection(db, targetCollection), fsPayload);
      
      // Reset form
      setFormTitle('');
      setFormContent('');
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create post:", err);
      alert('작성 완료 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !formTitle.trim() || !formContent.trim()) return;

    try {
      const isNotice = activeTab === 'notice';
      const table = isNotice ? 'notices' : 'board';

      // 1. Update in Supabase
      const sbPayload = {
        title: formTitle,
        content: formContent,
        updated_at: new Date().toISOString(),
      };

      let queryId: any = editId;
      if (!isNaN(Number(editId))) {
        queryId = Number(editId);
      }

      const { error: sbError } = await supabase
        .from(table)
        .update(sbPayload)
        .eq('id', queryId);

      if (sbError) {
        console.warn(`Supabase ${table} update error:`, sbError);
      }

      // 2. Update in Firestore
      try {
        const targetCollection = isNotice ? 'notices' : 'board';
        const docRef = doc(db, targetCollection, editId);
        const fsPayload: any = {
          title: formTitle,
          content: formContent,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(docRef, fsPayload);
      } catch (fsErr) {
        console.warn("Firestore update fallback error:", fsErr);
      }

      // Reset
      setIsEditing(false);
      setFormTitle('');
      setFormContent('');
      setEditId(null);
      
      // Sync selected details
      if (selectedPost && selectedPost.id === editId) {
        setSelectedPost(prev => prev ? { ...prev, title: formTitle, content: formContent, updatedAt: new Date() } : null);
      }
    } catch (err) {
      console.error("Update post failed:", err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      const isNotice = activeTab === 'notice';
      const table = isNotice ? 'notices' : 'board';

      // 1. Delete from Supabase
      let queryId: any = id;
      if (!isNaN(Number(id))) {
        queryId = Number(id);
      }

      const { error: sbError } = await supabase
        .from(table)
        .delete()
        .eq('id', queryId);

      if (sbError) {
        console.warn(`Supabase ${table} delete error:`, sbError);
      }

      // 2. Delete from Firestore
      try {
        const targetCollection = isNotice ? 'notices' : 'board';
        await deleteDoc(doc(db, targetCollection, id));
      } catch (fsErr) {
        console.warn("Firestore delete fallback error:", fsErr);
      }

      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
      }
    } catch (err) {
      console.error("Delete post failed:", err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const startEdit = (post: Notice | BoardPost) => {
    setFormTitle(post.title);
    setFormContent(post.content);
    setEditId(post.id);
    setIsEditing(true);
  };

  const startCreate = () => {
    setFormTitle('');
    setFormContent('');
    setIsCreating(true);
  };

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBoardPosts = boardPosts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">고객 지원 및 게시판</h1>
          <p className="text-xs text-slate-500">ITCON의 공지사항과 다양한 문의 및 기술 질의를 나누실 수 있습니다.</p>
        </div>

        {/* Board switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl self-start">
          <button
            onClick={() => { setActiveTab('notice'); setSelectedPost(null); setIsCreating(false); setIsEditing(false); }}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer focus:outline-none ${
              activeTab === 'notice' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="h-4 w-4" />
            <span>공지사항 (Notice)</span>
          </button>
          <button
            onClick={() => { setActiveTab('general'); setSelectedPost(null); setIsCreating(false); setIsEditing(false); }}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer focus:outline-none ${
              activeTab === 'general' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>자유 문의 게시판</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* CREATE / EDIT FORM */}
        {(isCreating || isEditing) ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md max-w-3xl mx-auto space-y-6"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing ? '게시글 수정하기' : `${activeTab === 'notice' ? '공지사항' : '게시글'} 작성하기`}
              </h3>
              <button
                onClick={() => { setIsCreating(false); setIsEditing(false); }}
                className="text-xs font-medium text-slate-500 hover:text-brand cursor-pointer focus:outline-none"
              >
                취소
              </button>
            </div>

            <form onSubmit={isEditing ? handleUpdatePost : handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">제목</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="제목을 입력하세요."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">내용</label>
                <textarea
                  required
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="상세한 내용과 상황을 자세히 적어주시면 신속히 답변해 드리겠습니다."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setIsEditing(false); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer focus:outline-none"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg flex items-center space-x-1 cursor-pointer focus:outline-none shadow-md shadow-brand/10"
                >
                  <Check className="h-4 w-4" />
                  <span>{isEditing ? '수정 완료' : '등록하기'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : selectedPost ? (
          
          /* DETAILED POST VIEW */
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl max-w-4xl mx-auto space-y-6"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand cursor-pointer focus:outline-none mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>목록으로 돌아가기</span>
            </button>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                  {selectedPost.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-3.5 w-3.5 text-slate-300" />
                    <span>{selectedPost.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    <span>
                      {selectedPost.createdAt.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedPost.content}
                </p>
              </div>

              {/* Edit/Delete Actions for Authorized Creators */}
              <div className="border-t border-slate-100 pt-6 flex justify-end space-x-2">
                {((activeTab === 'notice' && isAdmin) || 
                  (activeTab === 'general' && (isAdmin || (user && (selectedPost as BoardPost).authorId === user.uid)))) && (
                  <>
                    <button
                      onClick={() => startEdit(selectedPost)}
                      className="p-2 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors cursor-pointer focus:outline-none"
                      title="수정하기"
                    >
                      <Edit2 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(selectedPost.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer focus:outline-none"
                      title="삭제하기"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* SEARCH & POST LIST */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Supabase Connection Status and SQL Schema Guide Trigger */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">데이터 동기화 상태:</span>
                
                {activeTab === 'notice' ? (
                  noticesSyncMode === 'supabase' ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 border border-emerald-100/60">
                      ● Supabase 공지사항 연결됨
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 border border-amber-100/60" title="Supabase 'notices' 테이블을 찾을 수 없어 임시로 Firestore를 사용합니다.">
                      ▲ 공지사항 Firestore 임시 보완모드
                    </span>
                  )
                ) : (
                  boardSyncMode === 'supabase' ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 border border-emerald-100/60">
                      ● Supabase 자유문의 연결됨
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 border border-amber-100/60" title="Supabase 'board' 테이블을 찾을 수 없어 임시로 Firestore를 사용합니다.">
                      ▲ 자유문의 Firestore 임시 보완모드
                    </span>
                  )
                )}
              </div>

              <button
                onClick={() => setShowSqlGuide(!showSqlGuide)}
                className="text-xs text-brand font-bold hover:underline inline-flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Supabase 테이블 생성 SQL 보기</span>
              </button>
            </div>

            {/* SQL Guide Collapse Area */}
            {showSqlGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-[11px] leading-relaxed relative"
              >
                <div className="flex justify-between items-center text-xs text-slate-400 font-sans border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <Terminal className="h-4 w-4 text-brand" />
                    Supabase SQL Editor 실행 스크립트
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`-- 1. 공지사항 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT '관리자',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 자유 게시판 테이블 생성
CREATE TABLE IF NOT EXISTS board (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT '사용자',
  author_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화 및 정책 적용
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE board ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select for notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert for notices" ON notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for notices" ON notices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for notices" ON notices FOR DELETE USING (true);

CREATE POLICY "Allow public select for board" ON board FOR SELECT USING (true);
CREATE POLICY "Allow public insert for board" ON board FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for board" ON board FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for board" ON board FOR DELETE USING (true);`);
                      alert('SQL 스크립트가 클립보드에 복사되었습니다.');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-md text-[10px] cursor-pointer"
                  >
                    스크립트 전체 복사
                  </button>
                </div>
                <pre className="overflow-x-auto text-emerald-400 p-2 bg-slate-950 rounded-lg max-h-60 scrollbar-thin">
{`-- 1. 공지사항 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT '관리자',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 자유 게시판 (board) 테이블 생성
CREATE TABLE IF NOT EXISTS board (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT '사용자',
  author_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 및 공용 CRUD 정책 구성
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE board ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select for notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert for notices" ON notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for notices" ON notices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for notices" ON notices FOR DELETE USING (true);

CREATE POLICY "Allow public select for board" ON board FOR SELECT USING (true);
CREATE POLICY "Allow public insert for board" ON board FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for board" ON board FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for board" ON board FOR DELETE USING (true);`}
                </pre>
                <p className="text-[10px] text-slate-400 font-sans">
                  * 위 SQL을 복사하여 Supabase 대시보드의 **SQL Editor**에 붙여넣고 **Run**을 실행하시면 실시간 연동이 정상 작동합니다.
                </p>
              </motion.div>
            )}

            {/* Top Search & Actions bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="제목 또는 내용 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                />
              </div>

              {/* Action button */}
              {activeTab === 'notice' ? (
                isAdmin && (
                  <button
                    onClick={startCreate}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-md cursor-pointer focus:outline-none"
                  >
                    <Plus className="h-4 w-4" />
                    <span>공지 작성하기</span>
                  </button>
                )
              ) : user ? (
                <button
                  onClick={startCreate}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-md cursor-pointer focus:outline-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>글쓰기 (문의작성)</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  <span>로그인 시 질의등록이 가능합니다.</span>
                  <button onClick={() => setPage('auth')} className="text-brand font-bold underline hover:text-brand-hover cursor-pointer focus:outline-none ml-1">
                    로그인하기
                  </button>
                </div>
              )}
            </div>

            {/* Main Listings */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
              
              {/* Notice listings */}
              {activeTab === 'notice' ? (
                <div className="divide-y divide-slate-100">
                  {loading.notices ? (
                    <div className="py-12 flex justify-center">
                      <div className="h-6 w-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredNotices.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                      <Megaphone className="h-8 w-8 text-slate-300 mx-auto" />
                      <div>조회된 공지사항이 없습니다.</div>
                    </div>
                  ) : (
                    filteredNotices.map((post) => (
                      <div
                        key={post.id}
                        className="p-5 md:p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="text-left flex-1 space-y-1 group cursor-pointer focus:outline-none"
                        >
                          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-brand bg-brand/5 px-2 py-0.5 rounded-md uppercase mb-1">
                            Notice
                          </div>
                          <h3 className="text-base font-bold text-slate-800 group-hover:text-brand transition-colors leading-snug line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {post.content}
                          </p>
                        </button>

                        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
                          <span>{post.authorName}</span>
                          <span>
                            {post.createdAt.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                
                /* General Discussion listings */
                <div className="divide-y divide-slate-100">
                  {loading.board ? (
                    <div className="py-12 flex justify-center">
                      <div className="h-6 w-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredBoardPosts.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                      <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
                      <div>등록된 문의글이 아직 없습니다. 첫 글을 등록해 보세요!</div>
                    </div>
                  ) : (
                    filteredBoardPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-5 md:p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="text-left flex-1 space-y-1 group cursor-pointer focus:outline-none"
                        >
                          <h3 className="text-base font-bold text-slate-800 group-hover:text-brand transition-colors leading-snug line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {post.content}
                          </p>
                        </button>

                        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-sans font-medium text-[10px]">
                            {post.authorName}
                          </span>
                          <span>
                            {post.createdAt.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>

                          {/* Render simple deletion icon if author or admin */}
                          {isAdmin || (user && post.authorId === user.uid) ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                              className="p-1 hover:text-red-500 rounded text-slate-300 hover:bg-red-50 cursor-pointer focus:outline-none"
                              title="삭제하기"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
