
// Utilitaire pour précharger certaines pages importantes
// à appeler après le chargement initial

export const preloadImportantPages = () => {
  // Attendre que la page soit complètement chargée et idle
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Précharger les pages importantes quand le navigateur est idle
        import('@/pages/Dashboard');
        import('@/pages/LoginPage');
      });
    } else {
      // Fallback pour les navigateurs ne supportant pas requestIdleCallback
      setTimeout(() => {
        import('@/pages/Dashboard');
        import('@/pages/LoginPage');
      }, 1000);
    }
  }
};
