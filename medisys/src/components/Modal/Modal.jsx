import './Modal.css';

/**
 * Props:
 *   open     – boolean
 *   onClose  – fn
 *   title    – string
 *   footer   – JSX (action buttons)
 *   children – modal body content
 */
export default function Modal({ open, onClose, title, footer, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
