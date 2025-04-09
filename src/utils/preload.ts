
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
        
        // Précharger les composants UI fréquemment utilisés
        import('@/components/ui/button');
        import('@/components/ui/dialog');
        import('@/components/ui/input');
      });
    } else {
      // Fallback pour les navigateurs ne supportant pas requestIdleCallback
      setTimeout(() => {
        import('@/pages/Dashboard');
        import('@/pages/LoginPage');
        
        // Précharger les composants UI fréquemment utilisés
        import('@/components/ui/button');
        import('@/components/ui/dialog');
        import('@/components/ui/input');
      }, 1000);
    }
  }
};
