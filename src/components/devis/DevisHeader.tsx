
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

interface DevisHeaderProps {
  onCreateDevis: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function DevisHeader({ onCreateDevis, searchQuery, onSearchChange }: DevisHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{t("quote.title")}</h2>
        <p className="text-muted-foreground">
          {t("quote.subtitle")}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Input
          placeholder={t("quote.search")}
          className="max-w-sm w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button className="flex items-center" onClick={onCreateDevis}>
          <Plus className="mr-2 h-4 w-4" />
          {t("quote.new")}
        </Button>
      </div>
    </div>
  );
}
