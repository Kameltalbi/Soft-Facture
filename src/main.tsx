
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadImportantPages } from './utils/preload';

// Rendu de l'application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Préchargement optimisé des pages importantes après le rendu initial
// Utilisation d'un délai plus court pour commencer le préchargement plus tôt
setTimeout(() => {
  preloadImportantPages();
}, 1000); // Réduit de 2000ms à 1000ms
