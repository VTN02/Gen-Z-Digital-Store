import { createContext, useContext, useState, useCallback } from 'react';
import { validateAdminKey, adminLogout } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (key) => {
    setLoading(true);
    try {
      const data = await validateAdminKey(key);
      setIsAuthenticated(true);
      setAdmin(data.admin);
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
      setIsAuthenticated(false);
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, loading, login, logout }}>
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
