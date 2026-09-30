import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error filter for third-party browser extensions (e.g. Sender Wallet, MetaMask, etc.)
if (typeof window !== 'undefined') {
  const isExtensionError = (err: unknown): boolean => {
    const str = typeof err === 'string' ? err : String((err as { message?: string })?.message || '');
    return (
      str.includes('sender-wallet') ||
      str.includes('sender_getProviderState') ||
      str.includes('sender') ||
      str.includes('chrome-extension://') ||
      str.includes('moz-extension://')
    );
  };

  window.addEventListener('error', (event) => {
    if (isExtensionError(event.message) || isExtensionError(event.error)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionError(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(<App />);
