impor {/* Quick Filter */}
          <div className="relative w-full sm:w-64">
            <label htmlFor="dashboard-search-input" className="sr-only">Search app name</label>
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="dashboard-search-input"
              name="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search apps..."
              className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00ff41]"
            />
          </div>
        </div>t React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApps, addApp, updateApp, deleteApp, logoutAdmin } from '../services/firebase';
import { Plus, Trash2, Edit3, LogOut, Search, Terminal, AlertCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [appsList, setAppsList] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields State
  const [appName, setAppName] = useState('');
  const [version, setVersion] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [banner, setBanner] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [screenshots, setScreenshots] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');

  const fetchDashboardApps = async () => {
    try {
      const firestoreApps = await getApps();
      if (Array.isArray(firestoreApps)) {
        setAppsList(firestoreApps);
      }
    } catch (error) {
      console.error('Error loading apps in dashboard:', error);
    }
  };

  useEffect(() => {
    fetchDashboardApps();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      console.error('Logout error:', e);
    }
    navigate('/admin/login');
  };

  const handleOpenAddModal = () => {
    setEditingApp(null);
    setFormError('');
    setAppName('');
    setVersion('v1.0.0');
    setSize('50 MB');
    setDescription('');
    setIcon('');
    setBanner('');
    setDownloadUrl('');
    setScreenshots('');
    setShowFormModal(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setFormError('');
    setAppName(app.appName || app.title || '');
    setVersion(app.version || '');
    setSize(app.size || '');
    setDescription(app.description || '');
    setIcon(app.icon || '');
    setBanner(app.banner || '');
    setDownloadUrl(app.downloadUrl || '');
    setScreenshots(app.screenshots ? app.screenshots.join(', ') : '');
    setShowFormModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const appId = deleteTarget.id || deleteTarget.firestoreId;
    console.log('[Dashboard] Selected app id:', appId);
    if (!appId) {
      setDeleteError('Error: Missing App ID.');
      return;
    }
    
    try {
      setIsSaving(true);
      setDeleteError('');
      console.log('[Dashboard] Executing delete for app ID:', appId);
      
      // Remove deleted app from UI state immediately
      setAppsList((prev) => prev.filter((item) => item.id !== appId && item.firestoreId !== appId));

      await deleteApp(appId);
      console.log("Delete completed");
      await fetchDashboardApps();
      setDeleteSuccessMsg(`App "${deleteTarget.appName || deleteTarget.title}" successfully deleted.`);
      setDeleteTarget(null);
      setTimeout(() => setDeleteSuccessMsg(''), 4000);
    } catch (e) {
      console.error('[Dashboard] Delete error for app ID:', appId, e);
      setDeleteError('Failed to delete app: ' + (e.message || 'Unknown error'));
      await fetchDashboardApps();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApp = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!appName.trim()) {
      setFormError('App Name is required.');
      return;
    }
    if (!version.trim()) {
      setFormError('Version is required.');
      return;
    }
    if (!size.trim()) {
      setFormError('App Size is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Description is required.');
      return;
    }
    if (!icon.trim()) {
      setFormError('Icon URL is required.');
      return;
    }
    if (!banner.trim()) {
      setFormError('Banner Image URL is required.');
      return;
    }
    if (!downloadUrl.trim()) {
      setFormError('GitHub APK Download link is required.');
      return;
    }

    setIsSaving(true);

    const screenshotArray = screenshots
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    const appPayload = {
      appName: appName.trim(),
      title: appName.trim(),
      version: version.trim(),
      size: size.trim(),
      description: description.trim(),
      icon: icon.trim(),
      banner: banner.trim(),
      downloadUrl: downloadUrl.trim(),
      screenshots: screenshotArray
    };

    try {
      if (editingApp) {
        await updateApp(editingApp.id, appPayload);
      } else {
        await addApp({ ...appPayload, downloads: 0 });
      }

      await fetchDashboardApps();
      setShowFormModal(false);
    } catch (e) {
      console.error('Error saving app to Firestore:', e);
      setFormError(e.message || 'Failed to save app to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInventory = appsList.filter((a) => {
    const name = a.appName || a.title || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8">
      
      {/* Top Admin Bar */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#00ff41] p-0.5 shadow-lg shadow-[#00ff41]/20">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Terminal className="w-6 h-6 text-[#00ff41]" />
            </div>
          </div>
          <div>
            <h1 className="font-orbitron font-bold text-xl text-white">
              ADMIN DASHBOARD
            </h1>
            <p className="font-mono text-xs text-gray-400">
              Firestore App Collection CRUD Management Panel
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#00ff41] text-black font-mono font-bold text-xs uppercase rounded-lg hover:bg-emerald-400 shadow-md glow-green transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD APP</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-black/60 border border-white/10 text-gray-300 hover:text-red-400 hover:border-red-500 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* App Inventory List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <h2 className="font-orbitron font-bold text-lg text-white uppercase">
            FIRESTORE APPS INVENTORY ({filteredInventory.length})
          </h2>

          {/* Quick Filter */}
          <div className="relative w-full sm:w-64">
            <label htmlFor="dashboard-search-input" className="sr-only">Search app name</label>
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="dashboard-search-input"
              name="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search app name..."
              className="w-full bg-black/60 border border-white/15 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00ff41]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-black/60 text-[#00ff41] border-b border-white/10">
                <th className="py-3 px-4">APP NAME</th>
                <th className="py-3 px-4">VERSION</th>
                <th className="py-3 px-4">SIZE</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400 font-mono">
                    No apps found in Firestore inventory.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img src={item.icon} alt={item.appName || item.title} className="w-8 h-8 rounded bg-black object-cover" />
                      <div>
                        <span className="font-bold text-white block truncate max-w-[220px]">
                          {item.appName || item.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#00ff41] font-bold">{item.version}</td>
                    <td className="py-3 px-4 text-gray-400">{item.size}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-gray-300 hover:text-[#00ff41] rounded hover:bg-white/10"
                        title="Edit App"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(item);
                          setDeleteError('');
                        }}
                        className="p-1.5 text-gray-300 hover:text-red-400 rounded hover:bg-white/10"
                        title="Delete App"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {deleteSuccessMsg && (
        <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-xl p-4 text-[#00ff41] font-mono text-xs flex items-center space-x-2 shadow-lg">
          <Terminal className="w-4 h-4 flex-shrink-0" />
          <span>{deleteSuccessMsg}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl font-mono text-xs">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-orbitron font-bold text-sm text-red-500 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>CONFIRM DELETE</span>
              </h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-300">
              Are you sure you want to delete <span className="text-white font-bold">{deleteTarget.appName || deleteTarget.title}</span>?
            </p>
            <p className="text-gray-400 text-[11px]">
              This action will permanently remove the app document from Firestore.
            </p>

            {deleteError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400">
                {deleteError}
              </div>
            )}

            <div className="pt-3 flex justify-end space-x-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isSaving}
                className="px-4 py-2 bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-red-600 text-white font-bold uppercase rounded hover:bg-red-500 transition-colors flex items-center space-x-2 shadow-lg shadow-red-600/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>DELETING...</span>
                  </>
                ) : (
                  <span>DELETE</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit App Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-20 pb-6 overflow-hidden">
          <div className="bg-[#0c0c0c] border border-[#00ff41]/40 rounded-2xl max-w-xl w-full flex flex-col max-h-[calc(100vh-110px)] shadow-[0_0_35px_rgba(0,255,65,0.2)] font-mono text-xs overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 flex-shrink-0 bg-[#0c0c0c]">
              <h3 className="font-orbitron font-bold text-sm text-[#00ff41] tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
                <span>{editingApp ? 'EDIT APP (FIRESTORE)' : 'ADD NEW APP (FIRESTORE)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body & Footer */}
            <form onSubmit={handleSaveApp} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2 text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="app-name-input" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                    APP NAME <span className="text-[#00ff41]">*</span>
                  </label>
                  <input
                    id="app-name-input"
                    name="appName"
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder=""
                    className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="app-version-input" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                      VERSION <span className="text-[#00ff41]">*</span>
                    </label>
                    <input
                      id="app-version-input"
                      name="version"
                      type="text"
                      required
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder=""
                      className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="app-size-input" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                      SIZE <span className="text-[#00ff41]">*</span>
                    </label>
                    <input
                      id="app-size-input"
                      name="size"
                      type="text"
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder=""
                      className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="app-description-textarea" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                    DESCRIPTION <span className="text-[#00ff41]">*</span>
                  </label>
                  <textarea
                    id="app-description-textarea"
                    name="description"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder=""
                    className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="app-icon-input" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                    APP ICON URL <span className="text-[#00ff41]">*</span>
                  </label>
                  <input
                    id="app-icon-input"
                    name="icon"
                    type="text"
                    required
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder=""
                    className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="app-banner-input" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                    BANNER IMAGE URL <span className="text-[#00ff41]">*</span>
                  </label>
                  <input
                    id="app-banner-input"
                    name="banner"
                    type="text"
                    required
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder=""
                    className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="app-downloadurl-input" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                    GITHUB APK DOWNLOAD LINK <span className="text-[#00ff41]">*</span>
                  </label>
                  <input
                    id="app-downloadurl-input"
                    name="downloadUrl"
                    type="text"
                    required
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder=""
                    className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="app-screenshots-input" className="text-gray-300 block mb-1.5 font-semibold text-[11px] tracking-wide">
                    SCREENSHOTS (comma-separated URLs):
                  </label>
                  <input
                    id="app-screenshots-input"
                    name="screenshots"
                    type="text"
                    value={screenshots}
                    onChange={(e) => setScreenshots(e.target.value)}
                    placeholder=""
                    className="w-full bg-black/70 border border-white/15 rounded-lg p-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-white/10 flex justify-end space-x-3 flex-shrink-0 bg-[#0c0c0c]">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors font-semibold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#00ff41] text-black font-bold uppercase rounded-lg hover:bg-emerald-400 transition-colors flex items-center space-x-2 shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>{editingApp ? 'SAVE CHANGES' : 'ADD APP'}</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
