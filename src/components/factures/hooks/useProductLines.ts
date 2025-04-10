
import { useState } from "react";

export function useProductLines() {
  // Lignes de produits avec ajout des nouveaux champs pour la TVA
  const [productLines, setProductLines] = useState([
    {
      id: "1",
      name: "Développement site web",
      quantity: 1,
      unitPrice: 1200,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true, // Par défaut, on utilise un taux de TVA
      discount: 0,
      total: 1200,
    },
  ]);

  const addProductLine = () => {
    const newLine = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true,
      discount: 0,
      total: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const removeProductLine = (id: string) => {
    setProductLines(productLines.filter((line) => line.id !== id));
  };

  // Handler for tax input changes
  const handleTaxChange = (id: string, value: number, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          tva: estTauxTVA ? value : line.tva,
          montantTVA: !estTauxTVA ? value : line.montantTVA,
          estTauxTVA: estTauxTVA
        };
      }
      return line;
    }));
  };

  // Handler for changing tax mode
  const handleTaxModeChange = (id: string, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          estTauxTVA,
          // Reset the value when changing modes to avoid confusion
          tva: estTauxTVA ? 20 : line.tva,
          montantTVA: !estTauxTVA ? 0 : line.montantTVA
        };
      }
      return line;
    }));
  };

  // New handlers for updating product line quantity and price
  const handleQuantityChange = (id: string, value: number) => {
    setProductLines(productLines.map(line => {
      if (line.id === id) {
        const newTotal = value * line.unitPrice;
        return { ...line, quantity: value, total: newTotal };
      }
      return line;
    }));
  };

  const handlePriceChange = (id: string, value: number) => {
    setProductLines(productLines.map(line => {
      if (line.id === id) {
        const newTotal = line.quantity * value;
        return { ...line, unitPrice: value, total: newTotal };
      }
      return line;
    }));
  };

  const handleProductNameChange = (id: string, value: string) => {
    setProductLines(productLines.map(line => {
      if (line.id === id) {
        return { ...line, name: value };
      }
      return line;
    }));
  };

  return {
    productLines,
    setProductLines,
    addProductLine,
    removeProductLine,
    handleTaxChange,
    handleTaxModeChange,
    handleQuantityChange,
    handlePriceChange,
    handleProductNameChange
  };
}
