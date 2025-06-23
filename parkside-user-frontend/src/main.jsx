import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ContentProvider from './contexts/ContentContext';
import RoomsProvider from './contexts/RoomsContext';
import './index.css';

// Import template css files
import './assets/css/custom-room-hover.css';
import './assets/css/plugins.css';
import './assets/css/style.css';
// Import your Publishable Key

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <RoomsProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
        </RoomsProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
