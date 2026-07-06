/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { AboutUs } from './components/AboutUs';
import { Solutions } from './components/Solutions';
import { Boards } from './components/Boards';
import { ContactUs } from './components/ContactUs';
import { Admin } from './components/Admin';
import { Auth } from './components/Auth';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { page, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white space-y-4">
        <div className="h-10 w-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider text-slate-400 font-mono animate-pulse uppercase">
          Initializing ITCON Enterprise...
        </span>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home />;
      case 'about':
        return <AboutUs />;
      case 'solutions':
        return <Solutions />;
      case 'boards':
        return <Boards />;
      case 'contact':
        return <ContactUs />;
      case 'admin':
        return <Admin />;
      case 'auth':
        return <Auth />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Animated main viewport wrapper */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
