import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { validateAdminKey, adminLogout, getAdminSession } from '../epics/ep04-administration/services/auth.service';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('admin_token'));
  });
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const data = await getAdminSession();
          if (data?.admin) {
            setIsAuthenticated(true);
            setAdmin(data.admin);
          }
        } catch {
          // Token invalid or expired
          localStorage.removeItem('admin_token');
          setIsAuthenticated(false);
          setAdmin(null);
        }
      }
      setInitializing(false);
    };

    checkSession();
  }, []);

  const login = useCallback(async (key) => {
    setLoading(true);
    try {
      const data = await validateAdminKey(key);
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }
      setIsAuthenticated(true);
      setAdmin(data.admin || { role: 'admin' });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Invalid access key. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminLogout();
    } catch {
      // Swallow logout errors
    } finally {
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, loading, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
