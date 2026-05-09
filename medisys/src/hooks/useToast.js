import { useState, useCallback } from 'react';

let _id = 0;

/**
 * useToast — returns { toasts, toast }
 *
 * Usage:
 *   const { toasts, toast } = useToast();
 *   toast('Saved!', 'success');
 *   // Render <ToastContainer toasts={toasts} /> somewhere at the root
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = 'info') => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  return { toasts, toast };
}
