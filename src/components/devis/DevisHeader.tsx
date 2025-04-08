
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DevisHeaderProps {
  onCreateDevis: () => void;
}

export function DevisHeader({ onCreateDevis }: DevisHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{t("quote.title")}</h2>
        <p className="text-muted-foreground">
          {t("quote.subtitle")}
        </p>
      </div>
      <Button className="flex items-center" onClick={onCreateDevis}>
        <Plus className="mr-2 h-4 w-4" />
        {t("quote.new")}
      </Button>
    </div>
  );
}
