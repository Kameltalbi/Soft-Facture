
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { DeviseManager } from "@/components/devise/DeviseManager";
import { Devise } from "@/types";

interface DeviseTabProps {
  devises: Devise[];
  setDevises: (devises: Devise[]) => void;
  onSave: () => void;
}

export function DeviseTab({ devises, setDevises, onSave }: DeviseTabProps) {
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

        <div className="flex justify-end">
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
