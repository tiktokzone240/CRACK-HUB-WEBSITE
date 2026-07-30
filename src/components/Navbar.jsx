import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Terminal, Cpu, Menu, X, LayoutDashboard } from 'lucide-react';

const LOGO_URL = "https://raw.githubusercontent.com/tiktokzone240/Crack-image/main/ChatGPT%20Image%20Jul%2028,%202026,%2006_25_11%20PM.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'HOME STORE', path: '/', icon: Terminal },
    { name: 'ADMIN DASHBOARD', path: '/admin/dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#00ff41]/30 shadow-lg shadow-[#00ff41]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-full bg-[#00ff41] p-0.5 shadow-md shadow-[#00ff41]/30 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              {imgError ? (
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[#00ff41]" />
                </div>
              ) : (
                <img
                  src={LOGO_URL}
                  alt="Badhon's Crack Hub Logo"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain rounded-full"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron font-bold text-lg sm:text-xl tracking-tighter uppercase italic text-[#00ff41] group-hover:glow-text-green transition-all">
                BADHON'S <span className="text-white">CRACK HUB</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#00ff41]/60 uppercase -mt-1">
                // OFFICIAL STORE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                    active
                      ? 'bg-white/10 text-[#00ff41] border border-[#00ff41]/50 glow-green'
                      : 'text-gray-300 hover:text-[#00ff41] hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#00ff41]' : 'text-gray-400'}`} />
                  <span>[{link.name}]</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Badge & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/login"
              className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-mono font-bold text-[#00ff41] bg-black/60 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all uppercase rounded-sm shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN LOGIN</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded bg-white/5 border border-white/10 text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-[#00ff41]/30 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded font-mono text-xs uppercase font-bold border transition-all ${
                  active
                    ? 'bg-white/10 text-[#00ff41] border-[#00ff41]/50 glow-green'
                    : 'text-gray-300 hover:bg-white/5 border-white/10'
                }`}
              >
                <Icon className="w-4 h-4 text-[#00ff41]" />
                <span>[{link.name}]</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-xs font-mono font-bold text-[#00ff41] border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all uppercase"
            >
              <Shield className="w-4 h-4" />
              <span>ADMIN LOGIN</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

