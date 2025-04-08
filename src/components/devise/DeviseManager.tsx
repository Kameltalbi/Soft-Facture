
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Devise } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeviseManagerProps {
  devises: Devise[];
  onDevisesChange: (devises: Devise[]) => void;
}

const formSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  symbole: z.string().min(1, "Le symbole est requis"),
  separateurMillier: z.string().min(1, "Le séparateur de millier est requis"),
  nbDecimales: z.coerce.number().min(0, "Le nombre de décimales doit être supérieur ou égal à 0").max(10, "Le nombre de décimales doit être inférieur ou égal à 10"),
  estParDefaut: z.boolean().default(false)
});

type DeviseFormValues = z.infer<typeof formSchema>;

export function DeviseManager({ devises, onDevisesChange }: DeviseManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingDevise, setEditingDevise] = useState<Devise | null>(null);
  const { toast } = useToast();

  const form = useForm<DeviseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      symbole: "",
      separateurMillier: " ",
      nbDecimales: 2,
      estParDefaut: false
    }
  });

  const openModal = (devise?: Devise) => {
    if (devise) {
      form.reset({
        nom: devise.nom,
        symbole: devise.symbole,
        separateurMillier: devise.separateurMillier,
        nbDecimales: devise.nbDecimales,
        estParDefaut: devise.estParDefaut
      });
      setEditingDevise(devise);
    } else {
      form.reset({
        nom: "",
        symbole: "",
        separateurMillier: " ",
        nbDecimales: 2,
        estParDefaut: false
      });
      setEditingDevise(null);
    }
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    const deviseToDelete = devises.find(d => d.id === id);
    
    // Prevent deleting the default currency
    if (deviseToDelete?.estParDefaut) {
      toast({
        title: "Action impossible",
        description: "Vous ne pouvez pas supprimer la devise par défaut",
        variant: "destructive"
      });
      return;
    }
    
    onDevisesChange(devises.filter(devise => devise.id !== id));
    toast({
      title: "Devise supprimée",
      description: "La devise a été supprimée avec succès",
    });
  };

  const onSubmit = (data: DeviseFormValues) => {
    // If setting this currency as default, unset others
    let updatedDevises = [...devises];
    if (data.estParDefaut) {
      updatedDevises = updatedDevises.map(d => ({
        ...d,
        estParDefaut: false
      }));
    } 
    // But ensure there is always a default currency
    else if (editingDevise?.estParDefaut && !data.estParDefaut) {
      // If trying to unset the current default without setting another one
      toast({
        title: "Action impossible",
        description: "Vous devez avoir une devise par défaut",
        variant: "destructive"
      });
      return;
    }

    if (editingDevise) {
      onDevisesChange(
        updatedDevises.map(d => 
          d.id === editingDevise.id 
            ? { ...d, ...data } 
            : d
        )
      );
      toast({
        title: "Devise mise à jour",
        description: "La devise a été mise à jour avec succès",
      });
    } else {
      // Generate a simple ID for the new currency
      const newDevise: Devise = {
        id: crypto.randomUUID(),
        nom: data.nom,
        symbole: data.symbole,
        separateurMillier: data.separateurMillier,
        nbDecimales: data.nbDecimales,
        estParDefaut: data.estParDefaut || updatedDevises.length === 0 // First currency is default by default
      };
      
      // If this is the first currency, force it to be the default
      if (updatedDevises.length === 0) {
        newDevise.estParDefaut = true;
      }
      
      onDevisesChange([...updatedDevises, newDevise]);
      toast({
        title: "Devise ajoutée",
        description: "La nouvelle devise a été ajoutée avec succès",
      });
    }
    
    setOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Devises disponibles</h3>
        <Button onClick={() => openModal()} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="grid gap-4">
        {devises.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            Aucune devise configurée. Cliquez sur "Ajouter" pour en créer une.
          </Card>
        ) : (
          devises.map((devise) => (
            <Card key={devise.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium flex items-center">
                  {devise.nom} ({devise.symbole})
                  {devise.estParDefaut && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Par défaut
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Séparateur de millier: "{devise.separateurMillier}", Décimales: {devise.nbDecimales}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openModal(devise)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(devise.id)}
                  disabled={devise.estParDefaut}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDevise ? "Modifier la devise" : "Ajouter une devise"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Euro, Dollar, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symbole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbole</FormLabel>
                    <FormControl>
                      <Input placeholder="€, $, £, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="separateurMillier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Séparateur de millier</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un séparateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=" ">Espace</SelectItem>
                        <SelectItem value=",">Virgule</SelectItem>
                        <SelectItem value=".">Point</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nbDecimales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de décimales</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estParDefaut"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Devise par défaut</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Définir comme devise par défaut pour tous les documents
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={editingDevise?.estParDefaut}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  {editingDevise ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
