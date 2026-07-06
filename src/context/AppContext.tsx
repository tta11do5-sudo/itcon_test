import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { supabase } from '../supabase';
import { SiteConfig, PageId } from '../types';

interface AppContextProps {
  user: any | null;
  loading: boolean;
  page: PageId;
  setPage: (page: PageId) => void;
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  demoAdminMode: boolean;
  setDemoAdminMode: (mode: boolean) => void;
  supabaseSignUp: (email: string, password: string, displayName: string) => Promise<{ error: any; data: any }>;
  supabaseSignIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const defaultConfig: SiteConfig = {
  primaryColor: '#0A2540',
  sloganTitle: '혁신적인 IT 솔루션의 표준, ITCON',
  sloganSubtitle: '서버, 스토리지, 소프트웨어 설계부터 유지보수까지 기업 맞춤형 인프라를 제공합니다.',
  fontFamily: 'sans',
};

function adjustColorBrightness(hex: string, percent: number) {
  let num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<PageId>('home');
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [demoAdminMode, setDemoAdminMode] = useState<boolean>(false);

  // Authenticated Admin check
  const isRealAdmin = user?.email === 'tta11do5@gmail.com';
  const isAdmin = isRealAdmin || demoAdminMode;

  useEffect(() => {
    // 1. Firebase Auth listener
    const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '사용자',
          photoURL: firebaseUser.photoURL,
          provider: 'firebase',
        });
        setLoading(false);
      } else {
        // 2. Fallback to Supabase check
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            const sbUser = session.user;
            setUser({
              uid: sbUser.id,
              email: sbUser.email || null,
              displayName: sbUser.user_metadata?.display_name || sbUser.user_metadata?.full_name || '사용자',
              photoURL: sbUser.user_metadata?.avatar_url || null,
              provider: 'supabase',
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }).catch((err) => {
          console.error("Supabase getSession error:", err);
          setUser(null);
          setLoading(false);
        });
      }
    });

    // 3. Supabase Auth state change listener
    const { data: { subscription: supabaseSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const sbUser = session.user;
        setUser({
          uid: sbUser.id,
          email: sbUser.email || null,
          displayName: sbUser.user_metadata?.display_name || sbUser.user_metadata?.full_name || '사용자',
          photoURL: sbUser.user_metadata?.avatar_url || null,
          provider: 'supabase',
        });
      } else {
        // If Firebase currentUser isn't set, then clear user
        if (!auth.currentUser) {
          setUser(null);
        }
      }
    });

    return () => {
      unsubscribeFirebase();
      supabaseSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Listen to settings document
    const settingsDocRef = doc(db, 'settings', 'main');
    
    const unsubscribeSettings = onSnapshot(settingsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const loadedConfig: SiteConfig = {
          primaryColor: data.primaryColor || defaultConfig.primaryColor,
          sloganTitle: data.sloganTitle || defaultConfig.sloganTitle,
          sloganSubtitle: data.sloganSubtitle || defaultConfig.sloganSubtitle,
          fontFamily: data.fontFamily || defaultConfig.fontFamily,
        };
        setConfig(loadedConfig);
        applyConfigToDOM(loadedConfig);
      } else {
        // Document does not exist, initialize it with default values
        setDoc(settingsDocRef, {
          ...defaultConfig,
          updatedAt: serverTimestamp(),
        }).catch((err) => {
          console.warn("Could not auto-initialize settings, using local defaults:", err);
        });
        setConfig(defaultConfig);
        applyConfigToDOM(defaultConfig);
      }
    }, (error) => {
      console.warn("Settings listener error (using defaults):", error);
    });

    return () => unsubscribeSettings();
  }, []);

  const applyConfigToDOM = (cfg: SiteConfig) => {
    // Dynamic CSS variables injector
    document.documentElement.style.setProperty('--brand-color', cfg.primaryColor);
    const hoverColor = adjustColorBrightness(cfg.primaryColor, -12);
    document.documentElement.style.setProperty('--brand-color-hover', hoverColor);

    // Apply font family class
    const root = document.getElementById('root');
    if (root) {
      root.className = `font-${cfg.fontFamily}-custom min-h-screen bg-slate-50 text-slate-900`;
    }
  };

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    applyConfigToDOM(updated);

    try {
      const settingsDocRef = doc(db, 'settings', 'main');
      await setDoc(settingsDocRef, {
        ...updated,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/main');
    }
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const supabaseSignUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });
    return { error, data };
  };

  const supabaseSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error, data };
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await supabase.auth.signOut();
      setDemoAdminMode(false);
      setPage('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        page,
        setPage,
        config,
        updateConfig,
        login,
        logout,
        isAdmin,
        demoAdminMode,
        setDemoAdminMode,
        supabaseSignUp,
        supabaseSignIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
