import { PackageOpen } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

/**
 * Empty state component for tables and lists.
 */
export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description = '',
  action = null,
  onAction = null,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={40} strokeWidth={1} />
      </div>
      <h4 className="empty-state__title">{title}</h4>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}
