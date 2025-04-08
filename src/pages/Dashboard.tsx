
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, CircleDollarSign, Users, ReceiptText, TrendingUp, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  
  return (
    <MainLayout title="dashboard.title">
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
      
      <Tabs defaultValue="mois" className="mt-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="jour">{t('dashboard.day')}</TabsTrigger>
            <TabsTrigger value="semaine">{t('dashboard.week')}</TabsTrigger>
            <TabsTrigger value="mois">{t('dashboard.month')}</TabsTrigger>
            <TabsTrigger value="annee">{t('dashboard.year')}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="mois" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.monthlyPerformance')}</CardTitle>
              <CardDescription>
                {t('dashboard.monthlyPerformanceDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <div className="text-muted-foreground flex flex-col items-center">
                  <TrendingUp size={48} className="mb-2 text-invoice-blue-300" />
                  <p>{t('dashboard.revenueChart')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.recentInvoices')}</CardTitle>
            <CardDescription>
              {t('dashboard.recentInvoicesDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-4">
                    <div className="font-medium">FAC2025-00{i}</div>
                    <div className="text-sm text-muted-foreground">Client {i}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="font-medium">{550 * i} €</div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      i % 3 === 0 
                        ? "bg-invoice-status-paid/10 text-invoice-status-paid" 
                        : i % 2 === 0 
                          ? "bg-invoice-status-pending/10 text-invoice-status-pending" 
                          : "bg-invoice-status-draft/10 text-invoice-status-draft"
                    }`}>
                      {i % 3 === 0 
                        ? t('dashboard.status.paid') 
                        : i % 2 === 0 
                          ? t('dashboard.status.pending') 
                          : t('dashboard.status.draft')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.clientsBySector')}</CardTitle>
            <CardDescription>
              {t('dashboard.clientsBySectorDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-muted-foreground flex flex-col items-center">
                <Users size={36} className="mb-2 text-invoice-blue-300" />
                <p>{t('dashboard.clientDistribution')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
