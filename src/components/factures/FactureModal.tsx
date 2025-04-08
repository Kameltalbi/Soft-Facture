import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Settings, Save, ArrowUpRight, X, FilePdf } from "lucide-react";
import { FactureSettingsPanel } from "./FactureSettingsPanel";
import { TaxeInput } from "./TaxeInput";
import { FactureModalProps } from "@/types";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";

// Fonction pour convertir un nombre en lettres en français
const numeroEnLettres = (nombre: number): string => {
  if (nombre === 0) return "zéro";

  const unites = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const dizaines = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

  const convertirMoins1000 = (n: number): string => {
    if (n < 20) return unites[n];
    if (n < 100) {
      const dizaine = Math.floor(n / 10);
      const unite = n % 10;
      
      if (dizaine === 7 || dizaine === 9) {
        return dizaines[dizaine - 1] + "-" + unites[unite + 10];
      }
      
      return dizaines[dizaine] + (unite > 0 ? "-" + unites[unite] : "");
    }
    
    const centaine = Math.floor(n / 100);
    const reste = n % 100;
    
    return (centaine === 1 ? "cent" : unites[centaine] + " cent") + 
           (reste > 0 ? " " + convertirMoins1000(reste) : "");
  };

  let result = "";
  
  // Traitement des milliards
  const milliards = Math.floor(nombre / 1000000000);
  if (milliards > 0) {
    result += (milliards === 1 ? "un milliard" : convertirMoins1000(milliards) + " milliards") + " ";
    nombre %= 1000000000;
  }
  
  // Traitement des millions
  const millions = Math.floor(nombre / 1000000);
  if (millions > 0) {
    result += (millions === 1 ? "un million" : convertirMoins1000(millions) + " millions") + " ";
    nombre %= 1000000;
  }
  
  // Traitement des milliers
  const milliers = Math.floor(nombre / 1000);
  if (milliers > 0) {
    result += (milliers === 1 ? "mille" : convertirMoins1000(milliers) + " mille") + " ";
    nombre %= 1000;
  }
  
  // Traitement des centaines
  if (nombre > 0) {
    result += convertirMoins1000(nombre);
  }
  
  return result.trim();
};

// Formatte un montant en lettres avec la devise
const montantEnLettres = (montant: number, devise: string = "TND"): string => {
  const entier = Math.floor(montant);
  const centimes = Math.round((montant - entier) * 100);
  
  let result = numeroEnLettres(entier);
  
  // Ajouter la devise
  switch (devise) {
    case "TND":
      result += " dinar" + (entier > 1 ? "s" : "") + " tunisien" + (entier > 1 ? "s" : "");
      break;
    case "EUR":
      result += " euro" + (entier > 1 ? "s" : "");
      break;
    case "USD":
      result += " dollar" + (entier > 1 ? "s" : "");
      break;
    case "GBP":
      result += " livre" + (entier > 1 ? "s" : "") + " sterling";
      break;
    case "CHF":
      result += " franc" + (entier > 1 ? "s" : "") + " suisse" + (entier > 1 ? "s" : "");
      break;
    case "CAD":
      result += " dollar" + (entier > 1 ? "s" : "") + " canadien" + (entier > 1 ? "s" : "");
      break;
    default:
      result += " " + devise;
  }
  
  // Ajouter les centimes si nécessaire
  if (centimes > 0) {
    result += " et " + numeroEnLettres(centimes) + " millime" + (centimes > 1 ? "s" : "");
  }
  
  return result;
};

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case "TND":
      return "TND";
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "CHF":
      return "CHF";
    case "CAD":
      return "C$";
    default:
      return currency;
  }
};

export function FactureModal({
  open,
  onOpenChange,
  factureId,
}: FactureModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState(0);
  const [currency, setCurrency] = useState("TND");
  const currencySymbol = getCurrencySymbol(currency);

  const isEditing = factureId !== null;

  // Lignes de produits avec ajout des nouveaux champs pour la TVA
  const [productLines, setProductLines] = useState([
    {
      id: "1",
      name: "Développement site web",
      quantity: 1,
      unitPrice: 1200,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true, // Par défaut, on utilise un taux de TVA
      discount: 0,
      total: 1200,
    },
  ]);

  const addProductLine = () => {
    const newLine = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true,
      discount: 0,
      total: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const removeProductLine = (id: string) => {
    setProductLines(productLines.filter((line) => line.id !== id));
  };

  // Handler for tax input changes
  const handleTaxChange = (id: string, value: number, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          tva: estTauxTVA ? value : line.tva,
          montantTVA: !estTauxTVA ? value : line.montantTVA,
          estTauxTVA: estTauxTVA
        };
      }
      return line;
    }));
  };

  // Handler for changing tax mode
  const handleTaxModeChange = (id: string, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          estTauxTVA,
          // Reset the value when changing modes to avoid confusion
          tva: estTauxTVA ? 20 : line.tva,
          montantTVA: !estTauxTVA ? 0 : line.montantTVA
        };
      }
      return line;
    }));
  };

  const subtotal = productLines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0
  );

  // Calculate TVA based on rate or fixed amount depending on the estTauxTVA flag
  const totalTVA = applyTVA
    ? productLines.reduce(
        (sum, line) => {
          if (line.estTauxTVA) {
            return sum + line.quantity * line.unitPrice * (line.tva / 100);
          } else {
            return sum + line.montantTVA;
          }
        },
        0
      )
    : 0;

  const totalTTC = subtotal + totalTVA;
  
  // Calculate the final amount due after subtracting advance payment
  const finalAmount = totalTTC - advancePaymentAmount;

  // Handle advance payment change
  const handleAdvancePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAdvancePaymentAmount(value > totalTTC ? totalTTC : value);
  };

  // Préparer le texte des montants en lettres
  const montantTTCEnLettres = montantEnLettres(totalTTC, currency);
  const avanceEnLettres = showAdvancePayment && advancePaymentAmount > 0 ? montantEnLettres(advancePaymentAmount, currency) : "";
  const resteAPayerEnLettres = showAdvancePayment && advancePaymentAmount > 0 ? montantEnLettres(finalAmount, currency) : "";

  // Construire le texte complet pour l'affichage
  const getMontantEnLettresText = () => {
    if (showAdvancePayment && advancePaymentAmount > 0) {
      return `Montant total: ${montantTTCEnLettres}. Avance perçue: ${avanceEnLettres}. Reste à payer: ${resteAPayerEnLettres}.`;
    }
    return `Montant à payer en toutes lettres: ${montantTTCEnLettres}`;
  };

    // Handler for downloading the invoice as PDF
    const handleDownloadPDF = () => {
      // Construct invoice data for PDF generation
      const invoiceData = {
        id: factureId || "new",
        numero: isEditing ? "FAC2025-001" : "FAC2025-005",
        client: {
          id: "1",
          nom: "Entreprise ABC",
          email: "contact@abc.fr",
          adresse: "456 Avenue des Clients, 69002 Lyon, France"
        },
        dateCreation: new Date().toISOString(),
        dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        totalTTC: totalTTC,
        statut: "brouillon",
        produits: productLines,
        applyTVA,
        showDiscount,
        currency
      };
      
      // Download the PDF
      downloadInvoiceAsPDF(invoiceData);
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] sm:max-h-[90vh] overflow-y-auto">
        
        <DialogHeader>
          <DialogTitle className="sr-only">
            {isEditing ? "Modifier la facture" : "Nouvelle facture"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? "Modifiez les détails de la facture existante"
              : "Créez une nouvelle facture pour un client"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? "Modifier la facture" : "Nouvelle facture"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Modifiez les détails de la facture existante"
                : "Créez une nouvelle facture pour un client"}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? (
              <X className="h-4 w-4" />
            ) : (
              <Settings className="h-4 w-4 text-red-600" />
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <Tabs defaultValue="edition" className="mb-6">
              <TabsList>
                <TabsTrigger value="edition">Édition</TabsTrigger>
                <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              </TabsList>
              <TabsContent value="edition" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="numero">Numéro de facture</Label>
                    <Input
                      id="numero"
                      defaultValue={isEditing ? "FAC2025-001" : "FAC2025-005"}
                      readOnly
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="date">Date d'émission</Label>
                    <Input
                      id="date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="echeance">Date d'échéance</Label>
                    <Input
                      id="echeance"
                      type="date"
                      defaultValue={
                        new Date(
                          new Date().setDate(new Date().getDate() + 30)
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="client">Client</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Entreprise ABC</SelectItem>
                        <SelectItem value="2">Société XYZ</SelectItem>
                        <SelectItem value="3">Consulting DEF</SelectItem>
                        <SelectItem value="4">Studio Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="statut">Statut</Label>
                    <Select defaultValue="brouillon">
                      <SelectTrigger>
                        <SelectValue placeholder="Statut de la facture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brouillon">Brouillon</SelectItem>
                        <SelectItem value="envoyee">Envoyée</SelectItem>
                        <SelectItem value="payee">Payée</SelectItem>
                        <SelectItem value="retard">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">
                      Produits et services
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addProductLine}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une ligne
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">
                            Produit / Service
                          </TableHead>
                          <TableHead className="text-center">Quantité</TableHead>
                          <TableHead className="text-center">
                            Prix unitaire
                          </TableHead>
                          {applyTVA && (
                            <TableHead className="text-center">
                              TVA
                            </TableHead>
                          )}
                          {showDiscount && (
                            <TableHead className="text-center">
                              Remise (%)
                            </TableHead>
                          )}
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productLines.map((line) => (
                          <TableRow key={line.id}>
                            <TableCell>
                              <Input
                                placeholder="Description"
                                defaultValue={line.name}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="1"
                                defaultValue={line.quantity.toString()}
                                className="w-16 mx-auto text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  defaultValue={line.unitPrice.toString()}
                                  className="w-24 text-center"
                                />
                                <span className="ml-1">{currencySymbol}</span>
                              </div>
                            </TableCell>
                            {applyTVA && (
                              <TableCell className="text-center">
                                <TaxeInput 
                                  value={line.estTauxTVA ? line.tva : line.montantTVA}
                                  onChange={(value, estTauxTVA) => 
                                    handleTaxChange(line.id, value, estTauxTVA)
                                  }
                                  estTauxTVA={line.estTauxTVA}
                                  onModeChange={(estTauxTVA) => 
                                    handleTaxModeChange(line.id, estTauxTVA)
                                  }
                                />
                              </TableCell>
                            )}
                            {showDiscount && (
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  defaultValue={line.discount.toString()}
                                  className="w-16 mx-auto text-center"
                                />
                              </TableCell>
                            )}
                            <TableCell className="text-right font-medium">
                              {line.total.toLocaleString("fr-FR")} {currencySymbol}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProductLine(line.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{subtotal.toLocaleString("fr-FR")} {currencySymbol}</span>
                    </div>
                    {applyTVA && (
                      <div className="flex justify-between">
                        <span>TVA</span>
                        <span>{totalTVA.toLocaleString("fr-FR")} {currencySymbol}</span>
                      </div>
                    )}
                    {showDiscount && (
                      <div className="flex justify-between">
                        <span>Remise globale</span>
                        <span>0.00 {currencySymbol}</span>
                      </div>
                    )}
                    {showAdvancePayment && (
                      <div className="flex justify-between items-center">
                        <span>Avance perçue</span>
                        <div className="w-24 flex items-center">
                          <Input
                            type="number"
                            min="0"
                            max={totalTTC}
                            step="0.01"
                            value={advancePaymentAmount}
                            onChange={handleAdvancePaymentChange}
                            className="w-full text-right pr-1"
                          />
                          <span className="ml-1">{currencySymbol}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>Total TTC</span>
                      <span>{showAdvancePayment ? finalAmount.toLocaleString("fr-FR") : totalTTC.toLocaleString("fr-FR")} {currencySymbol}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="apercu" className="mt-4">
                <div className="invoice-paper animate-fade-in py-8 px-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="w-52 h-14 bg-invoice-blue-100 flex items-center justify-center rounded">
                        <p className="font-bold text-invoice-blue-700">
                          VOTRE LOGO
                        </p>
                      </div>
                      <div className="mt-4 text-sm">
                        <p className="font-semibold">Votre Entreprise</p>
                        <p>123 Rue de Paris</p>
                        <p>75001 Paris, France</p>
                        <p>Tél: 01 23 45 67 89</p>
                        <p>Email: contact@votreentreprise.fr</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold text-invoice-blue-600 mb-2">
                        FACTURE
                      </h1>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">№ :</span> FAC2025-005
                        </p>
                        <p>
                          <span className="font-medium">Date d'émission :</span>{" "}
                          {new Date().toLocaleDateString("fr-FR")}
                        </p>
                        <p>
                          <span className="font-medium">
                            Date d'échéance :
                          </span>{" "}
                          {new Date(
                            new Date().setDate(new Date().getDate() + 30)
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-b py-6 my-8">
                    <h2 className="text-sm font-semibold mb-1 text-muted-foreground">
                      FACTURER À
                    </h2>
                    <div>
                      <p className="font-semibold">Entreprise ABC</p>
                      <p>456 Avenue des Clients</p>
                      <p>69002 Lyon, France</p>
                      <p>Email: contact@abc.fr</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-semibold">
                            Description
                          </th>
                          <th className="text-center py-2 font-semibold">
                            Quantité
                          </th>
                          <th className="text-right py-2 font-semibold">
                            Prix unitaire
                          </th>
                          {applyTVA && (
                            <th className="text-right py-2 font-semibold">
                              TVA
                            </th>
                          )}
                          {showDiscount && (
                            <th className="text-right py-2 font-semibold">
                              Remise (%)
                            </th>
                          )}
                          <th className="text-right py-2 font-semibold">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productLines.map((line) => (
                          <tr key={line.id} className="border-b">
                            <td className="py-3">{line.name}</td>
                            <td className="py-3 text-center">
                              {line.quantity}
                            </td>
                            <td className="py-3 text-right">
                              {line.unitPrice.toLocaleString("fr-FR")} {currencySymbol}
                            </td>
                            {applyTVA && (
                              <td className="py-3 text-right">
                                {line.estTauxTVA 
                                  ? `${line.tva}%` 
                                  : `${line.montantTVA.toLocaleString("fr-FR")} ${currencySymbol}`
                                }
                              </td>
                            )}
                            {showDiscount && (
                              <td className="py-3 text-right">
                                {line.discount}%
                              </td>
                            )}
                            <td className="py-3 text-right">
                              {line.total.toLocaleString("fr-FR")} {currencySymbol}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-1">
                        <span>Sous-total</span>
                        <span>{subtotal.toLocaleString("fr-FR")} {currencySymbol}</span>
                      </div>
                      {applyTVA && (
                        <div className="flex justify-between py-1">
                          <span>TVA</span>
                          <span>{totalTVA.toLocaleString("fr-FR")} {currencySymbol}</span>
                        </div>
                      )}
                      {showDiscount && (
                        <div className="flex justify-between py-1">
                          <span>Remise globale</span>
                          <span>0.00 {currencySymbol}</span>
                        </div>
                      )}
                      {showAdvancePayment && (
                        <div className="flex justify-between py-1">
                          <span>Avance perçue</span>
                          <span>{advancePaymentAmount.toLocaleString("fr-FR")} {currencySymbol}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t border-t-gray-300 font-bold">
                        <span>Total TTC</span>
                        <span>{showAdvancePayment ? finalAmount.toLocaleString("fr-FR") : totalTTC.toLocaleString("fr-FR")} {currencySymbol}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-invoice-blue-50 p-4 rounded-md">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {getMontantEnLettresText()}
                      </span>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {showSettings && (
            <FactureSettingsPanel
              applyTVA={applyTVA}
              setApplyTVA={setApplyTVA}
              showDiscount={showDiscount}
              setShowDiscount={setShowDiscount}
              showAdvancePayment={showAdvancePayment}
              setShowAdvancePayment={setShowAdvancePayment}
              currency={currency}
              setCurrency={setCurrency}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <FilePdf className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
          <Button variant="outline">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
