import { useToast } from '../context/ToastContext';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const iconMap = {
  success: <FiCheckCircle color="#2EC4B6" />,
  error: <FiAlertCircle color="#E23744" />,
  warning: <FiAlertTriangle color="#FC8019" />,
  info: <FiInfo color="#2196F3" />,
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{iconMap[t.type]}</span>
          <p className="toast-message">{t.message}</p>
          <button
            className="toast-close btn-ghost btn-icon"
            onClick={() => removeToast(t.id)}
            aria-label="Close notification"
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
