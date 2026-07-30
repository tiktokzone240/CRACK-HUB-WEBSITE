/**
 * Badhon's Crack Hub - Utility Helper Functions
 */

/**
 * Format numbers with K/M suffix (e.g. 142500 -> 142.5K)
 */
export function formatDownloads(num) {
  const n = Number(num);
  if (isNaN(n)) return '0';
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'K';
  }
  return n.toString();
}

/**
 * Filter apps by App Name only
 */
export function filterAppsByName(apps, searchQuery = '') {
  if (!apps || !Array.isArray(apps)) return [];
  const query = searchQuery.trim().toLowerCase();
  if (!query) return apps;
  
  return apps.filter((app) => 
    app.title && app.title.toLowerCase().includes(query)
  );
}


