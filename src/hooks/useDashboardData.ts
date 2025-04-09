
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from '@/components/common/PeriodSelector';

export interface DashboardData {
  revenueData: {
    name: string;
    montant: number;
  }[];
  recoveryRateData: {
    name: string;
    value: number;
    fill: string;
  }[];
  pieData: {
    name: string;
    value: number;
  }[];
  invoiceStatusData: {
    name: string;
    payées: number;
    impayées: number;
  }[];
  summary: {
    revenue: number;
    revenueGrowth: number;
    clients: number;
    clientsGrowth: number;
    invoices: number;
    invoicesGrowth: number;
    unpaidAmount: number;
    unpaidCount: number;
  };
}

// Couleurs pour les graphiques
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function useDashboardData(period: DateRange) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Récupérer les données de chiffre d'affaires par mois
        const { data: revenueData, error: revenueError } = await supabase
          .from('factures')
          .select('date_creation, total_ttc')
          .gte('date_creation', new Date(period.from.getFullYear(), 0, 1).toISOString())
          .lte('date_creation', new Date(period.to.getFullYear(), 11, 31).toISOString())
          .eq('statut', 'payee');
          
        if (revenueError) throw revenueError;

        // 2. Récupérer le nombre de factures par statut
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('factures')
          .select('statut, total_ttc')
          .gte('date_creation', period.from.toISOString())
          .lte('date_creation', period.to.toISOString());
          
        if (invoicesError) throw invoicesError;

        // 3. Récupérer le nombre de clients actifs
        const { count: clientsCount, error: clientsError } = await supabase
          .from('clients')
          .select('id', { count: 'exact', head: true });
          
        if (clientsError) throw clientsError;

        // 4. Récupérer les produits par catégorie
        const { data: productsData, error: productsError } = await supabase
          .from('produits')
          .select('categorie_id, categories(nom)');
          
        if (productsError) throw productsError;

        // Traiter les données pour les graphiques
        // 1. Données de revenus par mois
        const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        const revenueByMonth: { [key: string]: number } = {};
        
        monthNames.forEach(month => {
          revenueByMonth[month] = 0;
        });

        revenueData.forEach((invoice) => {
          const date = new Date(invoice.date_creation);
          const monthName = monthNames[date.getMonth()];
          revenueByMonth[monthName] = (revenueByMonth[monthName] || 0) + Number(invoice.total_ttc);
        });

        const formattedRevenueData = Object.entries(revenueByMonth).map(([name, montant]) => ({
          name,
          montant: Math.round(montant)
        }));

        // 2. Données de taux de recouvrement
        const invoiceStats = {
          payees: 0,
          en_attente: 0,
          impayees: 0,
          total: 0
        };

        invoicesData.forEach(invoice => {
          invoiceStats.total++;
          if (invoice.statut === 'payee') {
            invoiceStats.payees++;
          } else if (invoice.statut === 'envoyee') {
            invoiceStats.en_attente++;
          } else if (invoice.statut === 'retard') {
            invoiceStats.impayees++;
          }
        });

        // Convertir en pourcentage
        const recoveryRateData = [
          { 
            name: "payees", 
            value: invoiceStats.total ? Math.round((invoiceStats.payees / invoiceStats.total) * 100) : 0, 
            fill: "#10B981" 
          },
          { 
            name: "en_attente", 
            value: invoiceStats.total ? Math.round((invoiceStats.en_attente / invoiceStats.total) * 100) : 0, 
            fill: "#F59E0B" 
          },
          { 
            name: "impayees", 
            value: invoiceStats.total ? Math.round((invoiceStats.impayees / invoiceStats.total) * 100) : 0, 
            fill: "#EF4444" 
          }
        ];

        // 3. Données pour le graphique des secteurs
        const categoryCounts: { [key: string]: number } = {};
        
        productsData.forEach(product => {
          const categoryName = product.categories?.nom || 'Non classé';
          categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        });

        const pieData = Object.entries(categoryCounts)
          .map(([name, count]) => ({
            name,
            value: count
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 4);  // Prendre les 4 premières catégories

        // 4. Données pour le graphique des factures payées vs. impayées
        const invoiceStatusByMonth: { [key: string]: { payées: number, impayées: number } } = {};
        
        monthNames.forEach(month => {
          invoiceStatusByMonth[month] = { payées: 0, impayées: 0 };
        });

        invoicesData.forEach(invoice => {
          const date = new Date(invoice.date_creation);
          const monthName = monthNames[date.getMonth()];
          
          if (invoice.statut === 'payee') {
            invoiceStatusByMonth[monthName].payées++;
          } else if (invoice.statut === 'retard') {
            invoiceStatusByMonth[monthName].impayées++;
          }
        });

        const invoiceStatusData = Object.entries(invoiceStatusByMonth).map(([name, values]) => ({
          name,
          payées: values.payées,
          impayées: values.impayées
        }));

        // 5. Données pour les cartes de résumé
        const totalRevenue = revenueData.reduce((sum, invoice) => sum + Number(invoice.total_ttc), 0);
        
        const unpaidInvoices = invoicesData.filter(inv => inv.statut === 'retard' || inv.statut === 'envoyee');
        const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.total_ttc), 0);

        // Pour les pourcentages de croissance, dans un cas réel, nous comparerions avec la période précédente
        // Ici, nous utilisons des valeurs fictives temporairement
        const summary = {
          revenue: Math.round(totalRevenue),
          revenueGrowth: 20,
          clients: clientsCount || 0,
          clientsGrowth: 12,
          invoices: invoicesData.length,
          invoicesGrowth: 8,
          unpaidAmount: Math.round(unpaidAmount),
          unpaidCount: unpaidInvoices.length
        };

        setData({
          revenueData: formattedRevenueData,
          recoveryRateData,
          pieData,
          invoiceStatusData,
          summary
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [period.from, period.to]);

  return { data, loading, error };
}
