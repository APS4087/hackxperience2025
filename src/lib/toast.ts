import { toast } from 'sonner';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
      },
    });
  },
  info: (message: string) => {
    toast.info(message, {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
      },
    });
  },
  warning: (message: string) => {
    toast.warning(message, {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
      },
    });
  },
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
      },
    });
  },
}; 