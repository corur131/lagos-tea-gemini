import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global guard against external browser extension injections (e.g. Sender Wallet, Web3 injectors)
if (typeof window !== 'undefined') {
  const isExtensionNoise = (msg?: string) => {
    if (!msg) return false;
    const lower = msg.toLowerCase();
    return (
      (lower.includes('sender') && (lower.includes('wallet') || lower.includes('initial state') || lower.includes('provider') || lower.includes('account') || lower.includes('bug'))) ||
      lower.includes('sender-wallet') ||
      lower.includes('sender:') ||
      lower.includes('sender_getproviderstate') ||
      lower.includes('failed to get initial state') ||
      lower.includes('please report this bug') ||
      lower.includes('no account exist') ||
      lower.includes('chrome-extension://') ||
      lower.includes('moz-extension://') ||
      lower.includes('safari-extension://')
    );
  };

  // Capture message events before external listeners trigger
  window.addEventListener(
    'message',
    (e) => {
      try {
        const raw = typeof e.data === 'string' ? e.data : JSON.stringify(e.data);
        if (isExtensionNoise(raw)) {
          e.stopImmediatePropagation();
        }
      } catch {
        // ignore
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (e) => {
      if (isExtensionNoise(e.reason?.message || String(e.reason))) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (e) => {
      if (isExtensionNoise(e.message || String(e.error))) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('ErrorBoundary captured:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 text-2xl font-serif">
            ☕
          </div>
          <h2 className="text-xl font-serif font-black text-amber-200 mb-2">
            Lagos Tea Encountered a Snag
          </h2>
          <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
            The page refreshed unexpectedly. Tap below to reload the episode right where you left off.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:from-amber-400 hover:to-pink-400 transition-transform active:scale-95"
          >
            Reload Episode
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
