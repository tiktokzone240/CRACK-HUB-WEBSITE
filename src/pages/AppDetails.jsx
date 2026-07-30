import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppById, incrementDownloadCount } from '../services/firebase';
import { formatDownloads } from '../utils/helpers';
import { ArrowLeft, Download } from 'lucide-react';

export default function AppDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);

 useEffect(() => {
  async function loadAppDetail() {
    try {
      const fetchedApp = await getAppById(id);
      if (fetchedApp) {
        setApp(fetchedApp);
      }
    } catch (error) {
      console.error('Error fetching app by ID:', error);
    }
  }
  loadAppDetail();
}, [id]);

if (!app) {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-white font-mono">Loading...</p>
    </div>
  );
}

  const handleDownload = async () => {
    if (app && app.downloadUrl) {
      try {
        if (app.id) {
          await incrementDownloadCount(app.id);
          setApp((prev) => {
            const currentCount = Number(prev.downloads) || 0;
            return {
              ...prev,
              downloads: currentCount + 1
            };
          });
        }
      } catch (err) {
        console.error('Error incrementing download count:', err);
      }
      // Direct download without opening a new tab or window
      const link = document.createElement('a');
      link.href = app.downloadUrl;
      const fileName = app.title ? `${app.title.replace(/[^a-zA-Z0-9.-]/g, '_')}.apk` : 'app.apk';
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff41] hover:text-white bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg hover:border-[#00ff41]/50 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO STORE</span>
      </button>

      {/* App Details Main Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* 1. Banner Image */}
        <div className="relative h-48 sm:h-64 w-full bg-black/60">
          <img
            src={app.banner || 'https://picsum.photos/seed/cyber/800/400'}
            alt={app.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60"></div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 -mt-16 relative z-10 space-y-8">
          
          {/* Header Row: 2. App Icon, 3. App Name, 4. Version, 5. Size, 8. Download Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-start space-x-4">
              {/* 2. App Icon */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#00ff41] bg-black shadow-xl flex-shrink-0">
                <img
                  src={app.icon}
                  alt={app.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2 pt-2">
                {/* 3. App Name */}
                <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                  {app.title}
                </h1>

                {/* Version, Size, Downloads */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="bg-black/60 border border-white/10 px-2.5 py-1 rounded text-gray-300">
                    <strong className="text-gray-500">Version:</strong>{' '}
                    <span className="text-[#00ff41] font-bold">{app.version}</span>
                  </span>
                  <span className="bg-black/60 border border-white/10 px-2.5 py-1 rounded text-gray-300">
                    <strong className="text-gray-500">Size:</strong>{' '}
                    <span className="text-white font-bold">{app.size}</span>
                  </span>
                  <span className="bg-black/60 border border-white/10 px-2.5 py-1 rounded text-gray-300">
                    <strong className="text-gray-500">Downloads:</strong>{' '}
                    <span className="text-[#00ff41] font-bold">{formatDownloads(app.downloads || 0)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 8. Download Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-[#00ff41] text-black font-mono font-bold text-sm rounded-xl hover:bg-emerald-400 shadow-lg glow-green transition-all uppercase"
            >
              <Download className="w-5 h-5" />
              <span>DOWNLOAD APK</span>
            </button>
          </div>

          {/* 6. Description */}
          <div className="space-y-3">
            <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-wide">
              DESCRIPTION
            </h2>
            <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed bg-black/40 p-5 rounded-xl border border-white/10">
              {app.description}
            </p>
          </div>

          {/* 7. Screenshots */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-wide">
                SCREENSHOTS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {app.screenshots.map((src, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden border border-white/10 bg-black/60 hover:border-[#00ff41]/50 transition-all shadow-md group"
                  >
                    <img
                      src={src}
                      alt={`${app.title} screenshot ${index + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

