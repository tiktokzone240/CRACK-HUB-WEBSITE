import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  totalResultsCount
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl mb-8 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff41]/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col space-y-3">
        {/* Search Input Field */}
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">Search apps by name</label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#00ff41]">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="search-input"
            name="searchQuery"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps by name..."
            className="w-full pl-11 pr-10 py-3 bg-black/60 border border-white/15 focus:border-[#00ff41] rounded-xl text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00ff41] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#00ff41]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Count Feedback */}
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
          <div>
            SHOWING <span className="text-[#00ff41] font-bold">{totalResultsCount}</span> APPS
          </div>
          {searchQuery && (
            <div className="text-[#00ff41]">
              SEARCH: "<span className="italic">{searchQuery}</span>"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

