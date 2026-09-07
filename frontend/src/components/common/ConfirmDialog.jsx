import Modal from './Modal';
import Button from './Button';

/**
 * Confirm dialog for destructive actions.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 'var(--leading-relaxed)' }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
