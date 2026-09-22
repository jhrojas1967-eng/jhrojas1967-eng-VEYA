import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { VeyaGlobalProvider } from './context/VeyaGlobalContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VeyaGlobalProvider>
      <App />
    </VeyaGlobalProvider>
  </StrictMode>,
);
