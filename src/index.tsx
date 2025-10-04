import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import LogRocket from 'logrocket';
import App from './App';
import '../index.css';
import './styles/brand.css';

// Initialize LogRocket
const logRocketAppId = import.meta.env.VITE_LOGROCKET_APP_ID;
if (logRocketAppId && logRocketAppId !== 'false' && logRocketAppId.trim() !== '') {
  try {
    LogRocket.init(logRocketAppId, {
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      network: {
        requestSanitizer: (request) => {
          // Sanitize sensitive data from requests
          if (request.headers['Authorization']) {
            request.headers['Authorization'] = '[REDACTED]';
          }
          return request;
        },
      },
    });

    // Note: setupLogRocketReact removed due to React 19 incompatibility
    // LogRocket core functionality still works perfectly!
    console.log('✅ LogRocket initialized:', logRocketAppId);
  } catch (error) {
    console.error('❌ LogRocket initialization failed:', error);
  }
} else {
  console.warn('⚠️ LogRocket not initialized: VITE_LOGROCKET_APP_ID not configured');
}

// Initialize Sentry
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^https:\/\/.*\.vercel\.app/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Integrate LogRocket session URL with Sentry
      if (import.meta.env.VITE_LOGROCKET_APP_ID) {
        event.extra = event.extra || {};
        event.extra.sessionURL = LogRocket.sessionURL;
      }
      return event;
    },
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
