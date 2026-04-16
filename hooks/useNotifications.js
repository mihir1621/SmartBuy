import { toast } from 'react-toastify';

/**
 * Custom hook for triggering in-app notifications.
 * Wraps react-toastify to provide a clean interface.
 */
export function useNotifications() {
  const notify = (message, type = 'info', options = {}) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
      default:
        toast.info(message, options);
        break;
    }
  };

  const notifyProcess = (message) => {
    return toast.loading(message);
  };

  const updateProcess = (id, message, type = 'success') => {
    toast.update(id, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 3000,
    });
  };

  return { notify, notifyProcess, updateProcess };
}
