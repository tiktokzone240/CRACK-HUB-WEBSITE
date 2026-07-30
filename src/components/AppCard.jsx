import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowRight } from 'lucide-react';
import { formatDownloads } from '../utils/helpers';

export default function AppCard({ app }) {
  if (!app) return null;

  return (
    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00ff41]/50 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      
      {/* Top Banner */}
      <div className="relative h-28 w-full overflow-hidden bg-black/60">
        <img
          src={app.banner || 'https://picsum.photos/seed/cyber/600/300'}
          alt={app.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-50 group-hover:opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60"></div>

        {/* Version Badge */}
        <div className="absolute top-2 right-2 bg-black/80 border border-white/20 text-[#00ff41] font-mono text-[10px] px-2 py-0.5 rounded font-bold">
          {app.version}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 relative z-10 -mt-6">
        
        {/* App Header with Floating Icon */}
        <div className="flex items-start space-x-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/20 shadow-md shadow-black bg-black flex-shrink-0 group-hover:border-[#00ff41] transition-colors">
            <img
              src={app.icon}
              alt={app.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="font-orbitron font-bold text-sm sm:text-base text-white group-hover:text-[#00ff41] truncate transition-colors">
              {app.title}
            </h3>
            <p className="text-[11px] font-mono text-gray-400 truncate mt-0.5">
              Size: {app.size}
            </p>
          </div>
        </div>

        {/* App Description */}
        <p className="text-xs font-mono text-gray-300 line-clamp-2 leading-relaxed">
          {app.description}
        </p>

        {/* Specs Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[11px] text-gray-400">
          <div>
            <span className="text-[10px] text-gray-500 mr-1">SIZE:</span>
            <span className="font-bold text-white">{app.size}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 mr-1">DOWNLOADS:</span>
            <span className="font-bold text-[#00ff41]">{formatDownloads(app.downloads || 0)}</span>
          </div>
        </div>

        {/* Download Link Button */}
        <Link
          to={`/app/${app.id}`}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs font-bold uppercase group-hover:bg-[#00ff41] group-hover:text-black group-hover:border-[#00ff41] transition-all duration-300 shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>VIEW & DOWNLOAD</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

    </div>
  );
}

