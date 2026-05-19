import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './styles/global.css';
import App from './App.tsx';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

interface RootContainer extends HTMLElement {
  _reactRoot?: ReactDOM.Root;
}

const container = document.getElementById('root') as RootContainer | null;
if (container) {
  // Singleton pattern to prevent double root initialization during Vite HMR
  let root = container._reactRoot;
  if (!root) {
    root = ReactDOM.createRoot(container);
    container._reactRoot = root;
  }
  root.render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  );
}
