
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { DeviseManager } from "@/components/devise/DeviseManager";
import { Devise } from "@/types";

interface DeviseTabProps {
  devises: Devise[];
  setDevises: (devises: Devise[]) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function DeviseTab({ devises, setDevises, onSave, onCancel }: DeviseTabProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de devise</CardTitle>
        <CardDescription>
          Gérez vos devises et définissez les paramètres d'affichage des montants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DeviseManager 
          devises={devises}
          onDevisesChange={setDevises}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel || (() => {})}>
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel')}
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
