
import { useState } from "react";
import { Save, Percent, CircleDollarSign } from "lucide-react";
import { TaxePersonnalisee } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema with Zod
const taxeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  montant: z.number().min(0, "La valeur doit être positive"),
  estMontantFixe: z.boolean()
});

export type TaxeFormValues = z.infer<typeof taxeSchema>;

interface TaxePersonnaliseeFormProps {
  initialValues?: TaxePersonnalisee;
  onSubmit: (data: TaxeFormValues) => void;
  onCancel?: () => void;
}

export function TaxePersonnaliseeForm({ initialValues, onSubmit, onCancel }: TaxePersonnaliseeFormProps) {
  // Initialize the form with react-hook-form
  const form = useForm<TaxeFormValues>({
    resolver: zodResolver(taxeSchema),
    defaultValues: initialValues ? {
      nom: initialValues.nom,
      montant: initialValues.montant,
      estMontantFixe: initialValues.estMontantFixe
    } : {
      nom: "",
      montant: 0,
      estMontantFixe: false
    }
  });

  const handleSubmit = (data: TaxeFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            {initialValues ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
