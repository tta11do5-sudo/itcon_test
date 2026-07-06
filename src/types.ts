export interface Notice {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  content: string;
  createdAt: Date;
}

export interface SiteConfig {
  primaryColor: string;
  sloganTitle: string;
  sloganSubtitle: string;
  fontFamily: string; // 'sans' | 'mono' | 'serif'
}

export type PageId = 'home' | 'about' | 'solutions' | 'boards' | 'contact' | 'admin' | 'auth';
export type BoardSubTab = 'notice' | 'general';
