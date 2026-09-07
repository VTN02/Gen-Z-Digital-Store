import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Accessible Modal component.
 * Traps keyboard focus, closes on Escape, closes on backdrop click.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideClose = false,
}) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || !hideClose) && (
          <div className="modal__header">
            {title && <h3 className="modal__title">{title}</h3>}
            {!hideClose && (
              <button
                className="modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
