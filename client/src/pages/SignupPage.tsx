import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer, isCustomerAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const returnUrl = (location.state as any)?.from || '/';

  // If already logged in, redirect to destination
  React.useEffect(() => {
    if (isCustomerAuthenticated) {
      navigate(returnUrl, { replace: true });
    }
  }, [isCustomerAuthenticated, navigate, returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed. Please check your details.');
        return;
      }

      loginCustomer(data.token);
      navigate(returnUrl, { replace: true });
    } catch {
      setError('Unable to reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
      <div className="max-w-md w-full space-y-8 bg-[#0D0D0D] border border-[#2A2A2A] p-8 sm:p-10 rounded-sm shadow-2xl">
        <div className="text-center">
          <span className="font-poppins text-[10px] uppercase tracking-[0.25em] text-[#B48A3C] font-semibold block mb-2">
            New Client Registration
          </span>
          <h2 className="font-oswald text-3xl font-bold uppercase tracking-wider text-white">
            Create <span className="text-[#E50914]">Account</span>
          </h2>
          <p className="mt-2 text-xs font-raleway text-[#B5B5B5]">
            Register to initialize commissions, track studio milestones, and download assets.
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
            <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B5B5B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alexander Cross"
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm pl-10 pr-4 py-3 text-xs font-raleway text-white placeholder-[#555] focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B5B5B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="producer@example.com"
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm pl-10 pr-4 py-3 text-xs font-raleway text-white placeholder-[#555] focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-2">
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B5B5B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm pl-10 pr-4 py-3 text-xs font-raleway text-white placeholder-[#555] focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-[#FF1F2D] disabled:opacity-50 text-white font-oswald text-xs uppercase tracking-widest font-semibold py-3.5 px-4 rounded-sm transition-all flex items-center justify-center gap-2 mt-6 shadow-[0_0_15px_rgba(229,9,20,0.3)]"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-[#2A2A2A]">
          <p className="text-xs font-raleway text-[#B5B5B5]">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="text-[#E50914] hover:text-[#FF1F2D] font-semibold transition-colors uppercase tracking-wider font-poppins text-[11px]"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
