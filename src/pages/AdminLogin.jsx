import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, isFirebaseConfigured } from '../services/firebase';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isFirebaseConfigured) {
        await loginAdmin(username, password);
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('Firebase is not configured.');
      }
    } catch (err) {
      console.error('Firebase admin login error:', err);
      setErrorMessage(err.message || 'Login failed. Please check your admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-xl bg-[#00ff41] p-0.5 mx-auto shadow-lg shadow-[#00ff41]/20">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#00ff41]" />
            </div>
          </div>
          <h1 className="font-orbitron font-bold text-xl text-white">
            ADMIN LOGIN
          </h1>
          <p className="font-mono text-xs text-gray-400">
            Badhon's Crack Hub Store Management Control Center
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2 text-red-400 font-mono text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label htmlFor="admin-username" className="text-gray-300 block">EMAIL / USERNAME:</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="example@gmail.com"
              className="w-full bg-black/60 border border-white/15 focus:border-[#00ff41] rounded-lg py-2.5 px-3 text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="text-gray-300 block">PASSWORD:</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full bg-black/60 border border-white/15 focus:border-[#00ff41] rounded-lg py-2.5 px-3 text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2 shadow-lg glow-green uppercase"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>LOG IN TO DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

