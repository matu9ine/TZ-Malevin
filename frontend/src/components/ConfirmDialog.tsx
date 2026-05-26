'use client';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Удалить',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="form-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            <i className="fa-solid fa-xmark"></i> Отмена
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <i className="fa-solid fa-trash-can"></i> {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
