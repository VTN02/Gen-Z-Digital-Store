import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

/**
 * App-level providers — wrap everything that needs global context.
 */
export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}
