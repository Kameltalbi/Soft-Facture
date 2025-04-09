
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, CircleDollarSign, Users, ReceiptText, TrendingUp, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";
import { RequireAuth } from "@/contexts/auth-context";
import { ChartContainer } from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar 
} from "recharts";

// Données pour les graphiques
const revenueData = [
  { name: "Jan", montant: 4000 },
  { name: "Fév", montant: 3000 },
  { name: "Mar", montant: 5000 },
  { name: "Avr", montant: 4500 },
  { name: "Mai", montant: 6000 },
  { name: "Juin", montant: 5500 },
  { name: "Juil", montant: 7000 },
  { name: "Août", montant: 6500 },
  { name: "Sep", montant: 8000 },
  { name: "Oct", montant: 7500 },
  { name: "Nov", montant: 9000 },
  { name: "Déc", montant: 8500 },
];

// Données pour le taux de recouvrement des factures
const recoveryRateData = [
  { name: "payees", value: 73, fill: "#10B981" },   // Vert pour les factures payées
  { name: "en_attente", value: 19, fill: "#F59E0B" }, // Orange pour les factures en attente
  { name: "impayees", value: 8, fill: "#EF4444" }   // Rouge pour les factures impayées
];

const pieData = [
  { name: "Commercial", value: 35 },
  { name: "E-commerce", value: 25 },
  { name: "Services", value: 20 },
  { name: "Industrie", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const invoiceStatusData = [
  { name: "Jan", payées: 40, impayées: 24 },
  { name: "Fév", payées: 35, impayées: 15 },
  { name: "Mar", payées: 50, impayées: 20 },
  { name: "Avr", payées: 65, impayées: 15 },
  { name: "Mai", payées: 70, impayées: 10 },
  { name: "Juin", payées: 80, impayées: 5 },
  { name: "Juil", payées: 85, impayées: 18 },
  { name: "Août", payées: 90, impayées: 12 },
  { name: "Sep", payées: 100, impayées: 8 },
  { name: "Oct", payées: 110, impayées: 10 },
  { name: "Nov", payées: 120, impayées: 15 },
  { name: "Déc", payées: 130, impayées: 12 },
];

// Configuration des couleurs pour les graphiques
const chartConfig = {
  revenue: {
    label: "Revenus",
    theme: {
      light: "#3B82F6",
      dark: "#60A5FA",
    },
  },
  invoices: {
    label: "Factures",
    theme: {
      light: "#10B981",
      dark: "#34D399",
    },
  },
  clients: {
    label: "Clients",
    theme: {
      light: "#F59E0B",
      dark: "#FBBF24",
    },
  },
  unpaid: {
    label: "Impayées",
    theme: {
      light: "#EF4444",
      dark: "#F87171",
    },
  },
};

// Composant pour le taux de recouvrement des factures
const RecoveryRateChart = ({ data, t }) => {
  return (
    <div className="h-80 w-full flex flex-col items-center">
      <RadialBarChart 
        width={320} 
        height={250} 
        innerRadius="60%" 
        outerRadius="100%" 
        data={data} 
        startAngle={180} 
        endAngle={0}
        barSize={30}
        cx="50%"
        cy="100%"
      >
        <RadialBar
          background
          clockWise
          dataKey="value"
          cornerRadius={10}
          label={{
            position: 'insideStart',
            fill: '#fff',
            fontWeight: 'bold',
            formatter: (value) => `${value}%`,
          }}
        />
      </RadialBarChart>
      
      <div className="flex justify-center items-center gap-6 mt-6">
        {recoveryRateData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.fill }}></div>
            <span className="text-sm font-medium">
              {t(`dashboard.${entry.name === 'payees' ? 'paidInvoices' : entry.name === 'en_attente' ? 'pendingInvoices' : 'unpaidInvoices'}`)} 
              {` ${entry.value}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  
  // Cette fonction récupérerait normalement des données basées sur la période sélectionnée
  const handlePeriodChange = (dateRange: DateRange) => {
    setSelectedPeriod(dateRange);
    // Dans une app réelle, vous récupéreriez des données pour cette période ici
    console.log("Récupération des données pour la période:", dateRange);
  };
  
  return (
    <MainLayout title="Tableau de bord">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome')}</h2>
        <PeriodSelector onPeriodChange={handlePeriodChange} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.revenue')}</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 350 €</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-blue-500 flex items-center font-medium">
                <ChevronUp className="h-3 w-3 mr-0.5" />
                20%
              </span>
              <span>{t('dashboard.vsLastMonth')}</span>
            </div>
            <div className="mt-4">
              <Progress value={65} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.activeClients')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-blue-500 flex items-center font-medium">
                <ChevronUp className="h-3 w-3 mr-0.5" />
                12%
              </span>
              <span>{t('dashboard.vsLastMonth')}</span>
            </div>
            <div className="mt-4">
              <Progress value={48} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.issuedInvoices')}</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-blue-500 flex items-center font-medium">
                <ChevronUp className="h-3 w-3 mr-0.5" />
                8%
              </span>
              <span>{t('dashboard.vsLastMonth')}</span>
            </div>
            <div className="mt-4">
              <Progress value={72} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.unpaidInvoices')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-invoice-status-pending" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 450 €</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-status-pending flex items-center font-medium">
                4 factures
              </span>
              <span>{t('invoice.status.pending')}</span>
            </div>
            <div className="mt-4">
              <Progress value={35} className="h-1.5 bg-muted/50" indicatorClassName="bg-invoice-status-pending" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Graphique 1: Évolution des revenus */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.revenueEvolution')}</CardTitle>
            <CardDescription>
              {t('dashboard.monthlyRevenueEvolution')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="montant" 
                    name="Revenus" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique 2: Taux de recouvrement des factures */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recoveryRate')}</CardTitle>
            <CardDescription>
              {t('dashboard.recoveryRateDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecoveryRateChart data={recoveryRateData} t={t} />
          </CardContent>
        </Card>

        {/* Graphique 3: Répartition des clients par secteur */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.clientsBySector')}</CardTitle>
            <CardDescription>
              {t('dashboard.clientsBySectorDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col">
              <ChartContainer config={chartConfig}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique 4: Factures payées vs. impayées */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.invoiceStatus')}</CardTitle>
            <CardDescription>
              {t('dashboard.paidVsUnpaidInvoices')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <LineChart data={invoiceStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="payées" 
                    name="Factures payées" 
                    stroke="#10B981" 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="impayées" 
                    name="Factures impayées" 
                    stroke="#EF4444" 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// Wrapper qui utilise RequireAuth pour protéger cette page
const Dashboard = () => {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
};

export default Dashboard;
