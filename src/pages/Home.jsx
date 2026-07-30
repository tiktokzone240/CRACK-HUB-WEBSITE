import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import AppCard from '../components/AppCard';
import { getApps } from '../services/firebase';
import { filterAppsByName } from '../utils/helpers';
import { Terminal, Flame, Sparkles, Cpu, Layers } from 'lucide-react';

export default function Home() {
  const [apps, setApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAppsData() {
      try {
        const firestoreApps = await getApps();
        if (Array.isArray(firestoreApps)) {
          setApps(firestoreApps);
        }
      } catch (error) {
        console.error('Error fetching apps from Firestore:', error);
      }
    }
    loadAppsData();
  }, []);

  // Filter apps by name if search query is present
  const searchResults = filterAppsByName(apps, searchQuery);

  // Separate apps into Latest Apps and Most Downloaded for home sections
  const latestApps = [...apps].reverse();
  const getDownloadValue = (item) => {
    const val = Number(item.downloads);
    return isNaN(val) ? 0 : val;
  };
  const mostDownloadedApps = [...apps].sort((a, b) => getDownloadValue(b) - getDownloadValue(a));

  return (
    <div className="space-y-10">
      
      {/* Hero Header */}
      <section className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 scanline opacity-10 pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#00ff41]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/60 border border-[#00ff41]/40 text-[#00ff41] font-mono text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>ANDROID APK STORE</span>
          </div>

          <h1 className="font-orbitron font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight">
            BADHON'S <br />
            <span className="text-[#00ff41] glow-text-green">
              CRACK HUB
            </span>
          </h1>

          <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
            Your destination for Android Apps and Games APK downloads. Clean, accessible, and fast releases.
          </p>
        </div>
      </section>

      {/* Interactive Search Bar (Searches App Name Only) */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalResultsCount={searchResults.length}
      />

      {/* Search Results View */}
      {searchQuery.trim() !== '' ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-[#00ff41]" />
              <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-wider">
                SEARCH RESULTS
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400">
              FOUND {searchResults.length} APPS
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center space-y-4">
              <Cpu className="w-12 h-12 text-[#00ff41] mx-auto" />
              <h3 className="font-orbitron text-lg text-white font-bold">NO APPS FOUND</h3>
              <p className="font-mono text-xs text-gray-400 max-w-md mx-auto">
                No apps matched "{searchQuery}". Try searching for another app name.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-[#00ff41] text-black font-mono text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors"
              >
                CLEAR SEARCH
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Normal Home Sections: Latest Apps & Most Downloaded */
        <div className="space-y-12">
          
          {/* Latest Apps Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#00ff41]" />
                <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-wider">
                  LATEST APPS
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-400">
                RECENT RELEASES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>

          {/* Most Downloaded Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-[#00ff41]" />
                <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-wider">
                  MOST DOWNLOADED
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-400">
                POPULAR APKs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mostDownloadedApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}

