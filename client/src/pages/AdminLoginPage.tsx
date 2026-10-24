import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isCustomerAuthenticated, isAdminAuthenticated, loginAdmin } = useAuth();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // A logged-in customer who opens an admin URL is redirected to the home page
  if (isCustomerAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If already authenticated as admin, go straight to dashboard
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
        asAdmin: true,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      loginAdmin(data.token);
      navigate('/admin', { replace: true });
    } catch {
      setError('Connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-md w-full space-y-8 bg-[#0c0c0c] border border-[#222] p-8 sm:p-10 rounded-sm shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-sm bg-[#141414] border border-[#B48A3C]/40 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#B48A3C]" />
          </div>
          <span className="font-poppins text-[10px] uppercase tracking-[0.25em] text-[#B48A3C] font-semibold block mb-2">
            Restricted Access
          </span>
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Command <span className="text-[#E50914]">Console</span>
          </h2>
          <p className="mt-2 text-xs font-raleway text-[#888]">
            Authenticate with executive credentials to manage studio pipelines.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-[#E50914]/10 border border-[#E50914]/40 rounded-sm text-xs font-raleway text-[#FF6B6B]">
            <AlertCircle className="w-4 h-4 text-[#E50914] flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-poppins uppercase tracking-wider text-[#888] mb-2">
              Console Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#141414] border border-[#222] rounded-sm pl-10 pr-4 py-3 text-xs font-raleway text-white placeholder-[#444] focus:outline-none focus:border-[#B48A3C] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B48A3C] hover:bg-[#c99d49] disabled:opacity-50 text-black font-oswald text-xs uppercase tracking-widest font-bold py-3.5 px-4 rounded-sm transition-all flex items-center justify-center gap-2 mt-6 shadow-[0_0_15px_rgba(180,138,60,0.25)]"
          >
            <span>{loading ? 'Verifying...' : 'Access Console'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
