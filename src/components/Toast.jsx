import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={24} className="text-green-500" />,
    error: <XCircle size={24} className="text-red-500" />
  };

  const bgColors = {
    success: 'bg-white border-l-4 border-green-500',
    error: 'bg-white border-l-4 border-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] ${bgColors[type]} shadow-2xl rounded-lg px-6 py-4 flex items-center gap-4 max-w-md w-full mx-4`}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="text-accent font-medium leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={20} />
      </button>
      
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-primary origin-left"
          style={{ width: '100%' }}
        />
      )}
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </AnimatePresence>
  );
};

export default Toast;
