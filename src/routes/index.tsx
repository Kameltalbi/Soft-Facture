
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoadingScreen from '@/components/ui/loading-screen';

// Import eager loaded components (utilisés fréquemment ou nécessaires initialement)
import HomePage from '@/pages/HomePage';
import NotFound from '@/pages/NotFound';

// Lazy load pour les autres routes (moins fréquentes)
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const FacturesPage = lazy(() => import('@/pages/FacturesPage'));
const DevisPage = lazy(() => import('@/pages/DevisPage'));
const BonDeSortiePage = lazy(() => import('@/pages/BonDeSortiePage'));
const ClientsPage = lazy(() => import('@/pages/ClientsPage'));
const ProduitsPage = lazy(() => import('@/pages/ProduitsPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const ParametresPage = lazy(() => import('@/pages/ParametresPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

// Wrapper pour le lazy loading
const LazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

// Création du router avec routes en lazy loading
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFound />
  },
  {
    path: '/dashboard',
    element: LazyLoad(Dashboard),
  },
  {
    path: '/factures',
    element: LazyLoad(FacturesPage),
  },
  {
    path: '/devis',
    element: LazyLoad(DevisPage),
  },
  {
    path: '/bon-de-sortie',
    element: LazyLoad(BonDeSortiePage),
  },
  {
    path: '/clients',
    element: LazyLoad(ClientsPage),
  },
  {
    path: '/produits',
    element: LazyLoad(ProduitsPage),
  },
  {
    path: '/categories',
    element: LazyLoad(CategoriesPage),
  },
  {
    path: '/parametres',
    element: LazyLoad(ParametresPage),
  },
  {
    path: '/login',
    element: LazyLoad(LoginPage),
  },
  {
    path: '/register',
    element: LazyLoad(RegisterPage),
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

// Export du RouterProvider
export default function Routes() {
  return <RouterProvider router={router} />;
}
