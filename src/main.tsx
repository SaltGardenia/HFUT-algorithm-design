import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { TocProvider } from './lib/toc';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TocProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </TocProvider>
    </ThemeProvider>
  </StrictMode>,
);
