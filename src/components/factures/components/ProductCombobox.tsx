import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product } from "@/hooks/useProducts";

interface ProductComboboxProps {
  products: Product[];
  value: string;
  onChange: (value: string, product: Product | null) => void;
  disabled?: boolean;
}

export function ProductCombobox({ products, value, onChange, disabled }: ProductComboboxProps) {
  console.log('ProductCombobox props:', { products, value, disabled });
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value || "Sélectionner un produit"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un produit..." />
          <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                value={product.nom}
                onSelect={() => {
                  onChange(product.nom, product);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === product.nom ? "opacity-100" : "opacity-0"
                  )}
                />
                {product.nom}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
