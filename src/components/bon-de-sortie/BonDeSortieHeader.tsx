
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

interface BonDeSortieHeaderProps {
  onCreateBonDeSortie: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function BonDeSortieHeader({ 
  onCreateBonDeSortie, 
  searchQuery, 
  onSearchChange 
}: BonDeSortieHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{t("common.bonDeSortie")}</h2>
      </div>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher un bon de sortie..."
          className="max-w-sm w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button className="flex items-center" onClick={onCreateBonDeSortie}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau bon de sortie
        </Button>
      </div>
    </div>
  );
}
