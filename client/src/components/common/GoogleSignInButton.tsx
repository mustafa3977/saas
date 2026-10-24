import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { loginCustomer } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If VITE_GOOGLE_CLIENT_ID is empty or undefined, hide Google button without errors
  if (!googleClientId || !googleClientId.trim()) {
    return null;
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      const msg = 'Google authentication response was missing token credentials.';
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await apiFetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        const errorMsg = data.error || 'Google authentication failed. Please try again.';
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      loginCustomer(data.token);
      onSuccess?.();
    } catch {
      const errorMsg = 'Unable to connect to Google authentication service.';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <p className="text-[11px] font-raleway text-[#FF6B6B] mb-2 text-center">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="w-full py-2.5 px-4 bg-[#141414] border border-[#2A2A2A] rounded-sm text-center text-xs font-poppins text-[#B5B5B5] animate-pulse">
          Authenticating with Google...
        </div>
      ) : (
        <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:mx-auto">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              const msg = 'Google sign-in was cancelled or failed.';
              setError(msg);
              onError?.(msg);
            }}
            theme="filled_black"
            size="large"
            text="continue_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      )}
    </div>
  );
};
