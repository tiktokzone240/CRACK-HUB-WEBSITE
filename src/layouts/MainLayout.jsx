import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-black">
      {/* Global Cyber Background Pattern */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none z-0"></div>
      
      {/* Top Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
