
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, CircleDollarSign, Users, ReceiptText, TrendingUp, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout title="Tableau de bord">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 350 €</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-blue-500 flex items-center font-medium">
                <ChevronUp className="h-3 w-3 mr-0.5" />
                20%
              </span>
              <span>vs mois précédent</span>
            </div>
            <div className="mt-4">
              <Progress value={65} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-blue-500 flex items-center font-medium">
                <ChevronUp className="h-3 w-3 mr-0.5" />
                12%
              </span>
              <span>vs mois précédent</span>
            </div>
            <div className="mt-4">
              <Progress value={48} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures émises</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-blue-500 flex items-center font-medium">
                <ChevronUp className="h-3 w-3 mr-0.5" />
                8%
              </span>
              <span>vs mois précédent</span>
            </div>
            <div className="mt-4">
              <Progress value={72} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures impayées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-invoice-status-pending" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 450 €</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-invoice-status-pending flex items-center font-medium">
                4 factures
              </span>
              <span>en attente</span>
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
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
            <TabsTrigger value="annee">Année</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="mois" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance mensuelle</CardTitle>
              <CardDescription>
                Évolution du chiffre d'affaires pour le mois en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <div className="text-muted-foreground flex flex-col items-center">
                  <TrendingUp size={48} className="mb-2 text-invoice-blue-300" />
                  <p>Graphique d'évolution du chiffre d'affaires</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Factures récentes</CardTitle>
            <CardDescription>
              Les 5 dernières factures émises
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
                      {i % 3 === 0 ? "Payée" : i % 2 === 0 ? "En attente" : "Brouillon"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clients par secteur</CardTitle>
            <CardDescription>
              Répartition des clients par secteur d'activité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-muted-foreground flex flex-col items-center">
                <Users size={36} className="mb-2 text-invoice-blue-300" />
                <p>Graphique de répartition des clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
