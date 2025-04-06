
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FactureSettingsPanelProps {
  applyTVA: boolean;
  setApplyTVA: (apply: boolean) => void;
  showDiscount: boolean;
  setShowDiscount: (show: boolean) => void;
  showAdvancePayment: boolean;
  setShowAdvancePayment: (show: boolean) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

export function FactureSettingsPanel({
  applyTVA,
  setApplyTVA,
  showDiscount,
  setShowDiscount,
  showAdvancePayment,
  setShowAdvancePayment,
  currency,
  setCurrency,
}: FactureSettingsPanelProps) {
  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="text-base">Paramètres de la facture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tva" className="cursor-pointer">
              Appliquer la TVA
            </Label>
            <Switch
              id="tva"
              checked={applyTVA}
              onCheckedChange={setApplyTVA}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="discount" className="cursor-pointer">
              Remise
            </Label>
            <Switch
              id="discount"
              checked={showDiscount}
              onCheckedChange={setShowDiscount}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="advance" className="cursor-pointer">
              Avance perçue
            </Label>
            <Switch
              id="advance"
              checked={showAdvancePayment}
              onCheckedChange={setShowAdvancePayment}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="currency">Devise</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="USD">Dollar US ($)</SelectItem>
              <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
              <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
              <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="language">Langue</Label>
          <Select defaultValue="fr">
            <SelectTrigger>
              <SelectValue placeholder="Choisir une langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
              <SelectItem value="de">Allemand</SelectItem>
              <SelectItem value="it">Italien</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
