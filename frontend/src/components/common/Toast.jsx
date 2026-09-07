import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToastState } from '../../context/ToastContext';
import './Toast.css';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

function ToastItem({ id, message, type, onRemove }) {
  const Icon = ICONS[type] || Info;

  useEffect(() => {
    // Add visible class after mount for slide-in animation
    const el = document.getElementById(`toast-${id}`);
    if (el) requestAnimationFrame(() => el.classList.add('toast--visible'));
  }, [id]);

  return (
    <div id={`toast-${id}`} className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <Icon size={16} className="toast__icon" />
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={() => onRemove(id)} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

/**
 * Toast container — renders all active toasts.
 * Place this once in the app root.
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToastState();

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={removeToast} />
      ))}
    </div>
  );
}
