
import { useState } from "react";
import { Plus } from "lucide-react";
import { TaxePersonnalisee } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TaxePersonnaliseeForm, TaxeFormValues } from "./TaxePersonnaliseeForm";
import { TaxePersonnaliseeList } from "./TaxePersonnaliseeList";

interface TaxePersonnaliseeManagerProps {
  taxes: TaxePersonnalisee[];
  onTaxesChange: (taxes: TaxePersonnalisee[]) => void;
}

export function TaxePersonnaliseeManager({ taxes, onTaxesChange }: TaxePersonnaliseeManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingTaxe, setEditingTaxe] = useState<TaxePersonnalisee | null>(null);
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingTaxe(null);
    }
  };

  const handleEdit = (taxe: TaxePersonnalisee) => {
    setEditingTaxe(taxe);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    onTaxesChange(taxes.filter(tax => tax.id !== id));
    toast({
      title: "Taxe supprimée",
      description: "La taxe a été supprimée avec succès",
    });
  };

  const onSubmit = (data: TaxeFormValues) => {
    if (editingTaxe) {
      onTaxesChange(
        taxes.map(t => 
          t.id === editingTaxe.id 
            ? { ...t, ...data } 
            : t
        )
      );
      toast({
        title: "Taxe mise à jour",
        description: "La taxe a été mise à jour avec succès",
      });
    } else {
      // Ensure all required properties are explicitly provided
      const newTaxe: TaxePersonnalisee = {
        id: crypto.randomUUID(),
        nom: data.nom,
        montant: data.montant,
        estMontantFixe: data.estMontantFixe
      };
      onTaxesChange([...taxes, newTaxe]);
      toast({
        title: "Taxe ajoutée",
        description: "La nouvelle taxe a été ajoutée avec succès",
      });
    }
    
    setOpen(false);
    setEditingTaxe(null);
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
            <TaxePersonnaliseeForm 
              initialValues={editingTaxe || undefined}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <TaxePersonnaliseeList 
          taxes={taxes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
}
