import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useBankSettings } from './hooks/useBankSettings';
import { toast } from 'sonner';

export const BankSettingsPanel = () => {
  const { bankInfo, loading, updateBankInfo } = useBankSettings();
  const [formData, setFormData] = useState({
    bank_name: bankInfo?.bank_name || '',
    rib: bankInfo?.rib || '',
    iban: bankInfo?.iban || '',
    swift: bankInfo?.swift || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateBankInfo(formData);
    if (result.success) {
      toast.success('Informations bancaires mises à jour avec succès');
    } else {
      toast.error('Erreur lors de la mise à jour des informations bancaires');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Bancaires</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="bank_name">Nom de la banque</Label>
            <Input
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="Nom de la banque"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rib">RIB</Label>
            <Input
              id="rib"
              name="rib"
              value={formData.rib}
              onChange={handleChange}
              placeholder="RIB"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              placeholder="IBAN"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="swift">SWIFT/BIC</Label>
            <Input
              id="swift"
              name="swift"
              value={formData.swift}
              onChange={handleChange}
              placeholder="SWIFT/BIC"
            />
          </div>

          <Button type="submit" disabled={loading}>
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
