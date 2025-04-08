
import { useState } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { TaxePersonnalisee } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { CircleDollarSign, Percent } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface TaxePersonnaliseeManagerProps {
  taxes: TaxePersonnalisee[];
  onTaxesChange: (taxes: TaxePersonnalisee[]) => void;
}

// Define the form schema with Zod
const taxeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  montant: z.number().min(0, "La valeur doit être positive"),
  estMontantFixe: z.boolean()
});

type TaxeFormValues = z.infer<typeof taxeSchema>;

export function TaxePersonnaliseeManager({ taxes, onTaxesChange }: TaxePersonnaliseeManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingTaxe, setEditingTaxe] = useState<TaxePersonnalisee | null>(null);

  // Initialize the form with react-hook-form
  const form = useForm<TaxeFormValues>({
    resolver: zodResolver(taxeSchema),
    defaultValues: {
      nom: "",
      montant: 0,
      estMontantFixe: false
    }
  });

  const resetForm = () => {
    form.reset({
      nom: "",
      montant: 0,
      estMontantFixe: false
    });
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
    form.reset({
      nom: taxe.nom,
      montant: taxe.montant,
      estMontantFixe: taxe.estMontantFixe
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    onTaxesChange(taxes.filter(tax => tax.id !== id));
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
    } else {
      const newTaxe: TaxePersonnalisee = {
        id: crypto.randomUUID(),
        ...data
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la taxe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="TVA, Éco-contribution, etc."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-2">
                  <Label>Type de taxe</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button"
                      variant={form.watch("estMontantFixe") ? "outline" : "default"} 
                      size="sm"
                      onClick={() => form.setValue("estMontantFixe", false)}
                      className="flex-1 justify-center"
                    >
                      <Percent className="h-4 w-4 mr-2" /> Pourcentage
                    </Button>
                    <Button 
                      type="button"
                      variant={form.watch("estMontantFixe") ? "default" : "outline"} 
                      size="sm"
                      onClick={() => form.setValue("estMontantFixe", true)}
                      className="flex-1 justify-center"
                    >
                      <CircleDollarSign className="h-4 w-4 mr-2" /> Montant fixe
                    </Button>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="montant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("estMontantFixe") ? "Montant" : "Taux (%)"}
                      </FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            type="number"
                            min="0"
                            max={form.watch("estMontantFixe") ? undefined : 100}
                            step={form.watch("estMontantFixe") ? "0.01" : "0.1"}
                            className="rounded-r-none"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            value={field.value.toString()}
                          />
                          <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                            {form.watch("estMontantFixe") ? (
                              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Percent className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingTaxe ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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
