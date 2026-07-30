import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { subscribeToAuthState, ADMIN_UID, isFirebaseConfigured } from '../services/firebase';
import { Shield, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuthState((user) => {
      if (user && user.uid === ADMIN_UID) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#00ff41] p-0.5 shadow-lg shadow-[#00ff41]/20 animate-pulse">
          <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#00ff41]" />
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[#00ff41] font-mono text-xs font-bold uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>VERIFYING ADMIN CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
