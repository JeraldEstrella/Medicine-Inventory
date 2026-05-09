import './ToastContainer.css';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{ICONS[t.type]}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}
