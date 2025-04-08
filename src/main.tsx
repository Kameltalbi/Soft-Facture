
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadImportantPages } from './utils/preload';

// Rendu de l'application
createRoot(document.getElementById("root")!).render(<App />);

// Préchargement des pages importantes après le rendu initial
setTimeout(() => {
  preloadImportantPages();
}, 2000);
