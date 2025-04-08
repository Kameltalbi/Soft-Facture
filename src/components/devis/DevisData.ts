
import { StatutFacture } from "@/types";

// Données fictives pour les devis
export const devisDemo = [
  {
    id: "1",
    numero: "DEV2025-001",
    client: { id: "1", nom: "Entreprise ABC", email: "contact@abc.fr" },
    dateCreation: "2025-04-01",
    dateEcheance: "2025-05-01",
    totalTTC: 1200,
    statut: "payee" as StatutFacture,
  },
  {
    id: "2",
    numero: "DEV2025-002",
    client: { id: "2", nom: "Société XYZ", email: "info@xyz.fr" },
    dateCreation: "2025-04-03",
    dateEcheance: "2025-05-03",
    totalTTC: 850,
    statut: "envoyee" as StatutFacture,
  },
  {
    id: "3",
    numero: "DEV2025-003",
    client: { id: "3", nom: "Consulting DEF", email: "contact@def.fr" },
    dateCreation: "2025-04-05",
    dateEcheance: "2025-05-05",
    totalTTC: 2100,
    statut: "brouillon" as StatutFacture,
  },
  {
    id: "4",
    numero: "DEV2025-004",
    client: { id: "4", nom: "Studio Design", email: "hello@studio.fr" },
    dateCreation: "2025-03-15",
    dateEcheance: "2025-04-15",
    totalTTC: 950,
    statut: "retard" as StatutFacture,
  },
];
