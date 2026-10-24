import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch, CUSTOMER_TOKEN_KEY, ADMIN_TOKEN_KEY } from '../lib/api';

interface AuthContextType {
  customerToken: string | null;
  isCustomerAuthenticated: boolean;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  loginCustomer: (token: string) => void;
  logoutCustomer: () => void;
  loginAdmin: (token: string) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customerToken, setCustomerToken] = useState<string | null>(() =>
    localStorage.getItem(CUSTOMER_TOKEN_KEY)
  );
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState(true);

  const loginCustomer = (token: string) => {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
    setCustomerToken(token);
  };

  const logoutCustomer = () => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    setCustomerToken(null);
  };

  const loginAdmin = (token: string) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    setAdminToken(token);
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken(null);
  };

  // Verify sessions on mount
  useEffect(() => {
    let isMounted = true;

    const verifySessions = async () => {
      const initialCustToken = localStorage.getItem(CUSTOMER_TOKEN_KEY);
      if (initialCustToken) {
        try {
          const res = await apiFetch('/api/auth/me');
          if (!res.ok && isMounted) {
            logoutCustomer();
          }
        } catch {
          // If offline or network error, retain token
        }
      }

      const initialAdmToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (initialAdmToken) {
        try {
          const res = await apiFetch('/api/admin/me', { asAdmin: true });
          if (!res.ok && isMounted) {
            logoutAdmin();
          }
        } catch {
          // If offline or network error, retain token
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    verifySessions();

    const handleCustExpired = () => {
      if (isMounted) logoutCustomer();
    };

    const handleAdminExpired = () => {
      if (isMounted) logoutAdmin();
    };

    window.addEventListener('lp:customer_session_expired', handleCustExpired);
    window.addEventListener('lp:admin_session_expired', handleAdminExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('lp:customer_session_expired', handleCustExpired);
      window.removeEventListener('lp:admin_session_expired', handleAdminExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customerToken,
        isCustomerAuthenticated: !!customerToken,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        isLoading,
        loginCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
