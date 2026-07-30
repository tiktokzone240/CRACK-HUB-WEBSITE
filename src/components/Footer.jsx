import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Cpu, Heart, Globe } from 'lucide-react';

const LOGO_URL = "https://raw.githubusercontent.com/tiktokzone240/Crack-image/main/ChatGPT%20Image%20Jul%2028,%202026,%2006_25_11%20PM.png";

export default function Footer() {
  const [imgError, setImgError] = useState(false);

  return (
    <footer className="bg-black/90 backdrop-blur-xl border-t border-white/10 text-slate-400 font-sans mt-16 relative overflow-hidden">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#00ff41] p-0.5 shadow-md shadow-[#00ff41]/20 flex-shrink-0">
                {imgError ? (
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-[#00ff41]" />
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
              <span className="font-orbitron font-bold text-lg text-white tracking-wider">
                BADHON'S <span className="text-[#00ff41]">CRACK HUB</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              Android Apps & Games distribution portal. Clean, accessible APK downloads.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-orbitron text-xs font-bold text-[#00ff41] uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>NAVIGATION</span>
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <Link to="/" className="hover:text-[#00ff41] transition-colors">Home Store</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#00ff41] transition-colors">Admin Login</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#00ff41] transition-colors">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h4 className="font-orbitron text-xs font-bold text-[#00ff41] uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5" />
              <span>LEGAL DISCLAIMER</span>
            </h4>
            <p className="text-[11px] font-mono text-gray-500 leading-relaxed">
              Badhon's Crack Hub is an educational showcase repository. Respect original game developers and software creators.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-[#00ff41]">Badhon's Crack Hub</span>. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 inline" />
            <span>for the Android Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

