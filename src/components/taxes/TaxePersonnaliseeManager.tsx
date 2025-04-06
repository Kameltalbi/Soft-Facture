
import { useState } from "react";
import { Plus, X, Edit, Trash2, Save } from "lucide-react";
import { TaxePersonnalisee } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { CircleDollarSign, Percent } from "lucide-react";

interface TaxePersonnaliseeManagerProps {
  taxes: TaxePersonnalisee[];
  onTaxesChange: (taxes: TaxePersonnalisee[]) => void;
}

export function TaxePersonnaliseeManager({ taxes, onTaxesChange }: TaxePersonnaliseeManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingTaxe, setEditingTaxe] = useState<TaxePersonnalisee | null>(null);
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState(0);
  const [estMontantFixe, setEstMontantFixe] = useState(false);

  const resetForm = () => {
    setNom("");
    setMontant(0);
    setEstMontantFixe(false);
    setEditingTaxe(null);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEdit = (taxe: TaxePersonnalisee) => {
    setEditingTaxe(taxe);
    setNom(taxe.nom);
    setMontant(taxe.montant);
    setEstMontantFixe(taxe.estMontantFixe);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    onTaxesChange(taxes.filter(tax => tax.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nom.trim() === "") return;
    
    if (editingTaxe) {
      onTaxesChange(
        taxes.map(t => 
          t.id === editingTaxe.id 
            ? { ...t, nom, montant, estMontantFixe } 
            : t
        )
      );
    } else {
      const newTaxe: TaxePersonnalisee = {
        id: crypto.randomUUID(),
        nom,
        montant,
        estMontantFixe
      };
      onTaxesChange([...taxes, newTaxe]);
    }
    
    setOpen(false);
    resetForm();
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Taxes personnalisées</CardTitle>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter une taxe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTaxe ? "Modifier la taxe" : "Ajouter une nouvelle taxe"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nom">Nom de la taxe</Label>
                  <Input
                    id="nom"
                    placeholder="TVA, Éco-contribution, etc."
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="taxeType">Type de taxe</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button"
                      variant={estMontantFixe ? "outline" : "default"} 
                      size="sm"
                      onClick={() => setEstMontantFixe(false)}
                      className="flex-1 justify-center"
                    >
                      <Percent className="h-4 w-4 mr-2" /> Pourcentage
                    </Button>
                    <Button 
                      type="button"
                      variant={estMontantFixe ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setEstMontantFixe(true)}
                      className="flex-1 justify-center"
                    >
                      <CircleDollarSign className="h-4 w-4 mr-2" /> Montant fixe
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="montant">
                    {estMontantFixe ? "Montant" : "Taux (%)"}
                  </Label>
                  <div className="flex">
                    <Input
                      id="montant"
                      type="number"
                      min="0"
                      max={estMontantFixe ? undefined : 100}
                      step={estMontantFixe ? "0.01" : "0.1"}
                      value={montant}
                      onChange={(e) => setMontant(parseFloat(e.target.value) || 0)}
                      className="rounded-r-none"
                    />
                    <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                      {estMontantFixe ? (
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingTaxe ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {taxes.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucune taxe personnalisée n'a été créée
          </div>
        ) : (
          <div className="space-y-3">
            {taxes.map((taxe) => (
              <div
                key={taxe.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="font-medium">{taxe.nom}</div>
                <div className="flex items-center space-x-1">
                  <div className="text-muted-foreground mr-2">
                    {taxe.montant}{taxe.estMontantFixe ? "€" : "%"}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(taxe)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(taxe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
