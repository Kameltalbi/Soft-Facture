
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Percent, CircleDollarSign } from "lucide-react";

interface TaxeInputProps {
  value: number;
  onChange: (value: number, estTauxTVA: boolean) => void;
  estTauxTVA: boolean;
  onModeChange: (estTauxTVA: boolean) => void;
}

export function TaxeInput({ value, onChange, estTauxTVA, onModeChange }: TaxeInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue, estTauxTVA);
  };

  const toggleMode = () => {
    onModeChange(!estTauxTVA);
    // Reset value when switching modes to avoid confusion
    onChange(0, !estTauxTVA);
  };

  return (
    <div className="flex">
      <Input
        type="number"
        min="0"
        max={estTauxTVA ? 100 : undefined}
        step={estTauxTVA ? 0.1 : 0.01}
        value={value.toString()}
        onChange={handleInputChange}
        className="w-full text-center rounded-r-none"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="px-3 rounded-l-none border border-l-0"
            type="button"
          >
            {estTauxTVA ? <Percent className="h-4 w-4" /> : <CircleDollarSign className="h-4 w-4" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Mode de saisie de la taxe</p>
            <div className="flex flex-col gap-2">
              <Button 
                variant={estTauxTVA ? "default" : "outline"} 
                size="sm"
                onClick={() => onModeChange(true)}
                className="justify-start"
              >
                <Percent className="h-4 w-4 mr-2" /> Pourcentage
              </Button>
              <Button 
                variant={!estTauxTVA ? "default" : "outline"} 
                size="sm"
                onClick={() => onModeChange(false)}
                className="justify-start"
              >
                <CircleDollarSign className="h-4 w-4 mr-2" /> Montant fixe
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
