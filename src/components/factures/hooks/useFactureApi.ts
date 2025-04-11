
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StatutFacture } from "@/types";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";

export function useFactureApi() {
  const [isLoading, setIsLoading] = useState(false);

  // Generate a facture number
  const generateFactureNumber = async () => {
    const year = new Date().getFullYear();
    
    try {
      // Get the count of existing invoices to generate a sequential number
      const { count, error } = await supabase
        .from('factures')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      const nextNumber = (count || 0) + 1;
      return `FAC-${year}-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error("Erreur lors de la génération du numéro de facture:", error);
      // Fallback to random number if count fails
      const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `FAC-${year}-${randomId}`;
    }
  };

  // Create a new facture in the database
  const createFacture = async (factureData: any, productLinesData: any[]) => {
    setIsLoading(true);
    console.log('Starting createFacture...');

    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check result:', { session, error: sessionError });

      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error("Erreur lors de la vérification de la session");
        return null;
      }

      if (!session) {
        console.log('No active session found');
        toast.error("Vous devez être connecté pour créer une facture");
        return null;
      }

      console.log('User is authenticated, proceeding with facture creation...');
      console.log('Facture data:', factureData);
      console.log('Product lines:', productLinesData);
      console.log("Creating facture with data:", factureData);
      
      // Remove client_id from factureData to avoid foreign key constraint violation
      const dataToInsert = { ...factureData };
      delete dataToInsert.client_id; // Important: remove client_id completely
      
      // D'abord, créer ou récupérer le client
      const clientName = factureData.client_nom;
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('nom', clientName)
        .single();

      let clientId;
      
      if (clientError) {
        // Le client n'existe pas, on le crée
        const { data: newClient, error: createClientError } = await supabase
          .from('clients')
          .insert({ nom: clientName })
          .select()
          .single();

        if (createClientError) {
          console.error('Error creating client:', createClientError);
          toast.error(`Erreur lors de la création du client: ${createClientError.message}`);
          throw createClientError;
        }

        clientId = newClient.id;
      } else {
        clientId = clientData.id;
      }

      // Ajouter le client_id aux données de la facture
      dataToInsert.client_id = clientId;

      // Create the facture
      const { data, error: factureError } = await supabase
        .from('factures')
        .insert(dataToInsert)
        .select()
        .single();
        
      if (factureError) {
        console.error("Error creating facture:", factureError);
        toast.error(`Erreur lors de la création de la facture: ${factureError.message}`);
        throw factureError;
      }
      console.log('Facture created successfully, proceeding with product lines...');

      console.log("Facture created successfully:", data);

      // Insert product lines
      const linesData = productLinesData.map(line => ({
        facture_id: data.id,
        nom: line.name,
        quantite: line.quantity,
        prix_unitaire: line.unitPrice,
        taux_tva: line.tva,
        montant_tva: line.montantTVA,
        est_taux_tva: line.estTauxTVA,
        remise: line.discount,
        sous_total: line.total
      }));
      
      const { error: linesError } = await supabase
        .from('lignes_facture')
        .insert(linesData);
        
      if (linesError) {
        console.error("Error creating product lines:", linesError);
        toast.error(`Erreur lors de la création des lignes: ${linesError.message}`);
        throw linesError;
      }
      console.log('Product lines created successfully');
      
      toast.success("Facture créée avec succès");
      return data;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast.error("Erreur lors de la création de la facture");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing facture
  const updateFacture = async (factureId: string, factureData: any) => {
    if (!factureId) {
      toast.error("Impossible d'enregistrer une facture qui n'existe pas encore");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Update the invoice in Supabase with the correct field names
      const { error } = await supabase
        .from('factures')
        .update(factureData)
        .eq('id', factureId);
        
      if (error) throw error;
      
      toast.success("Facture enregistrée");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la facture:", error);
      toast.error("Erreur lors de l'enregistrement de la facture");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a facture by ID
  const fetchFacture = async (factureId: string) => {
    setIsLoading(true);
    
    try {
      // Récupérer la facture avec ses lignes
      const { data: factureData, error: factureError } = await supabase
        .from('factures')
        .select('*, lignes_facture(*)')
        .eq('id', factureId)
        .single();
          
      if (factureError) throw factureError;

      // Récupérer les informations bancaires
      const { data: bankData, error: bankError } = await supabase
        .from('bank_info')
        .select('*')
        .single();

      if (bankError && bankError.code !== 'PGRST116') throw bankError;
      
      return {
        ...factureData,
        bankInfo: bankData || null
      };
    } catch (error) {
      console.error("Erreur lors du chargement de la facture:", error);
      toast.error("Erreur lors du chargement de la facture");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Download the facture as PDF
  const downloadPDF = async (invoiceData: any) => {
    try {
      console.log('Début du téléchargement PDF...');
      
      // Toujours récupérer les informations bancaires fraîches
      const { data: bankData, error: bankError } = await supabase
        .from('bank_info')
        .select('*')
        .maybeSingle();

      if (bankError) {
        console.error('Erreur lors de la récupération des infos bancaires:', bankError);
        throw bankError;
      }

      console.log('Informations bancaires récupérées:', bankData);

      // Créer une copie des données de facture avec les infos bancaires
      const invoiceDataWithBank = {
        ...invoiceData,
        bankInfo: bankData
      };

      console.log('Données complètes pour le PDF:', invoiceDataWithBank);

      // Générer le PDF avec les données complètes
      downloadInvoiceAsPDF(invoiceDataWithBank);
      return true;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      toast.error("Erreur lors de la génération du PDF");
      return false;
    }
  };

  return {
    isLoading,
    generateFactureNumber,
    createFacture,
    updateFacture,
    fetchFacture,
    downloadPDF
  };
}
