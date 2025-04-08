
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BonDeCommandeSettingsPanelProps {
  applyTVA: boolean;
  setApplyTVA: (value: boolean) => void;
  showDiscount: boolean;
  setShowDiscount: (value: boolean) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

export function BonDeCommandeSettingsPanel({
  applyTVA,
  setApplyTVA,
  showDiscount,
  setShowDiscount,
  currency,
  setCurrency,
}: BonDeCommandeSettingsPanelProps) {
  return (
    <div className="w-80 bg-slate-50 p-6 border-l rounded-tr-md rounded-br-md">
      <h3 className="font-semibold mb-4">Paramètres du bon de commande</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="apply-tva" className="cursor-pointer">Appliquer la TVA</Label>
            <Switch
              id="apply-tva"
              checked={applyTVA}
              onCheckedChange={setApplyTVA}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Activer ou désactiver l'application de la TVA sur le bon de commande
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-discount" className="cursor-pointer">Afficher les remises</Label>
            <Switch
              id="show-discount"
              checked={showDiscount}
              onCheckedChange={setShowDiscount}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Afficher ou masquer les champs de remise sur le bon de commande
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Choisir une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TND">TND - Dinar Tunisien</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="USD">USD - Dollar Américain</SelectItem>
              <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
              <SelectItem value="CHF">CHF - Franc Suisse</SelectItem>
              <SelectItem value="CAD">CAD - Dollar Canadien</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choisir la devise à utiliser pour ce bon de commande
          </p>
        </div>
      </div>
    </div>
  );
}
