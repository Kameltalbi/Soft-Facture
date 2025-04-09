export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      abonnements: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          payment_ref: string | null
          plan: string
          statut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_debut?: string
          date_fin: string
          id?: string
          payment_ref?: string | null
          plan: string
          statut?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          payment_ref?: string | null
          plan?: string
          statut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      billing_settings: {
        Row: {
          created_at: string
          id: string
          prefixe_bon_sortie: string
          prefixe_devis: string
          prefixe_facture: string
          siret: string | null
          site_web: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          prefixe_bon_sortie?: string
          prefixe_devis?: string
          prefixe_facture?: string
          siret?: string | null
          site_web?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          prefixe_bon_sortie?: string
          prefixe_devis?: string
          prefixe_facture?: string
          siret?: string | null
          site_web?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bons_de_sortie: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          date_creation: string
          date_echeance: string
          id: string
          notes: string | null
          numero: string
          sous_total: number
          statut: string
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          date_creation?: string
          date_echeance: string
          id?: string
          notes?: string | null
          numero: string
          sous_total: number
          statut: string
          total_ttc: number
          total_tva: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          date_creation?: string
          date_echeance?: string
          id?: string
          notes?: string | null
          numero?: string
          sous_total?: number
          statut?: string
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_de_sortie_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_de_sortie_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          nom: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string | null
          created_at: string
          email: string | null
          id: string
          nom: string
          societe: string | null
          telephone: string | null
          tva: string | null
          updated_at: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom: string
          societe?: string | null
          telephone?: string | null
          tva?: string | null
          updated_at?: string
        }
        Update: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom?: string
          societe?: string | null
          telephone?: string | null
          tva?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          adresse: string
          created_at: string
          email: string
          id: string
          logo_url: string | null
          nom_entreprise: string
          rib: string | null
          telephone: string | null
          updated_at: string
        }
        Insert: {
          adresse: string
          created_at?: string
          email: string
          id?: string
          logo_url?: string | null
          nom_entreprise: string
          rib?: string | null
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          adresse?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          nom_entreprise?: string
          rib?: string | null
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      currency_settings: {
        Row: {
          created_at: string
          devise: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          devise?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          devise?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      devis: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          date_creation: string
          date_echeance: string
          id: string
          notes: string | null
          numero: string
          remise_globale: number | null
          sous_total: number
          statut: string
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          date_creation?: string
          date_echeance: string
          id?: string
          notes?: string | null
          numero: string
          remise_globale?: number | null
          sous_total: number
          statut: string
          total_ttc: number
          total_tva: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          date_creation?: string
          date_echeance?: string
          id?: string
          notes?: string | null
          numero?: string
          remise_globale?: number | null
          sous_total?: number
          statut?: string
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devises: {
        Row: {
          est_par_defaut: boolean
          id: string
          nb_decimales: number
          nom: string
          separateur_millier: string
          symbole: string
        }
        Insert: {
          est_par_defaut?: boolean
          id: string
          nb_decimales?: number
          nom: string
          separateur_millier?: string
          symbole: string
        }
        Update: {
          est_par_defaut?: boolean
          id?: string
          nb_decimales?: number
          nom?: string
          separateur_millier?: string
          symbole?: string
        }
        Relationships: []
      }
      factures: {
        Row: {
          avance_percue: number | null
          client_id: string
          created_at: string
          created_by: string | null
          date_creation: string
          date_echeance: string
          id: string
          notes: string | null
          numero: string
          remise_globale: number | null
          sous_total: number
          statut: string
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          avance_percue?: number | null
          client_id: string
          created_at?: string
          created_by?: string | null
          date_creation?: string
          date_echeance: string
          id?: string
          notes?: string | null
          numero: string
          remise_globale?: number | null
          sous_total: number
          statut: string
          total_ttc: number
          total_tva: number
          updated_at?: string
        }
        Update: {
          avance_percue?: number | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          date_creation?: string
          date_echeance?: string
          id?: string
          notes?: string | null
          numero?: string
          remise_globale?: number | null
          sous_total?: number
          statut?: string
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lignes_bon_de_sortie: {
        Row: {
          bon_de_sortie_id: string
          est_taux_tva: boolean
          id: string
          montant_tva: number | null
          nom: string
          prix_unitaire: number
          produit_id: string | null
          quantite: number
          remise: number | null
          sous_total: number
          taux_tva: number
        }
        Insert: {
          bon_de_sortie_id: string
          est_taux_tva?: boolean
          id?: string
          montant_tva?: number | null
          nom: string
          prix_unitaire: number
          produit_id?: string | null
          quantite: number
          remise?: number | null
          sous_total: number
          taux_tva: number
        }
        Update: {
          bon_de_sortie_id?: string
          est_taux_tva?: boolean
          id?: string
          montant_tva?: number | null
          nom?: string
          prix_unitaire?: number
          produit_id?: string | null
          quantite?: number
          remise?: number | null
          sous_total?: number
          taux_tva?: number
        }
        Relationships: [
          {
            foreignKeyName: "lignes_bon_de_sortie_bon_de_sortie_id_fkey"
            columns: ["bon_de_sortie_id"]
            isOneToOne: false
            referencedRelation: "bons_de_sortie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_bon_de_sortie_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      lignes_devis: {
        Row: {
          devis_id: string
          est_taux_tva: boolean
          id: string
          montant_tva: number | null
          nom: string
          prix_unitaire: number
          produit_id: string | null
          quantite: number
          remise: number | null
          sous_total: number
          taux_tva: number
        }
        Insert: {
          devis_id: string
          est_taux_tva?: boolean
          id?: string
          montant_tva?: number | null
          nom: string
          prix_unitaire: number
          produit_id?: string | null
          quantite: number
          remise?: number | null
          sous_total: number
          taux_tva: number
        }
        Update: {
          devis_id?: string
          est_taux_tva?: boolean
          id?: string
          montant_tva?: number | null
          nom?: string
          prix_unitaire?: number
          produit_id?: string | null
          quantite?: number
          remise?: number | null
          sous_total?: number
          taux_tva?: number
        }
        Relationships: [
          {
            foreignKeyName: "lignes_devis_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_devis_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      lignes_facture: {
        Row: {
          est_taux_tva: boolean
          facture_id: string
          id: string
          montant_tva: number | null
          nom: string
          prix_unitaire: number
          produit_id: string | null
          quantite: number
          remise: number | null
          sous_total: number
          taux_tva: number
        }
        Insert: {
          est_taux_tva?: boolean
          facture_id: string
          id?: string
          montant_tva?: number | null
          nom: string
          prix_unitaire: number
          produit_id?: string | null
          quantite: number
          remise?: number | null
          sous_total: number
          taux_tva: number
        }
        Update: {
          est_taux_tva?: boolean
          facture_id?: string
          id?: string
          montant_tva?: number | null
          nom?: string
          prix_unitaire?: number
          produit_id?: string | null
          quantite?: number
          remise?: number | null
          sous_total?: number
          taux_tva?: number
        }
        Relationships: [
          {
            foreignKeyName: "lignes_facture_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_facture_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          description: string | null
          id: string
          name: string
          resource: string
        }
        Insert: {
          action: string
          description?: string | null
          id: string
          name: string
          resource: string
        }
        Update: {
          action?: string
          description?: string | null
          id?: string
          name?: string
          resource?: string
        }
        Relationships: []
      }
      produits: {
        Row: {
          categorie_id: string | null
          created_at: string
          description: string | null
          id: string
          nom: string
          prix: number
          taux_tva: number
          updated_at: string
        }
        Insert: {
          categorie_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          nom: string
          prix: number
          taux_tva?: number
          updated_at?: string
        }
        Update: {
          categorie_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
          prix?: number
          taux_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produits_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nom: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nom: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nom?: string
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tax_settings: {
        Row: {
          appliquer_tva_par_defaut: boolean
          created_at: string
          id: string
          taux_tva_par_defaut: number
          taxe_en_valeur: boolean
          updated_at: string
        }
        Insert: {
          appliquer_tva_par_defaut?: boolean
          created_at?: string
          id?: string
          taux_tva_par_defaut?: number
          taxe_en_valeur?: boolean
          updated_at?: string
        }
        Update: {
          appliquer_tva_par_defaut?: boolean
          created_at?: string
          id?: string
          taux_tva_par_defaut?: number
          taxe_en_valeur?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      taxes_personnalisees: {
        Row: {
          est_montant_fixe: boolean
          id: string
          montant: number
          nom: string
        }
        Insert: {
          est_montant_fixe?: boolean
          id?: string
          montant: number
          nom: string
        }
        Update: {
          est_montant_fixe?: boolean
          id?: string
          montant?: number
          nom?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          permission_id: string
          user_id: string
        }
        Insert: {
          permission_id: string
          user_id: string
        }
        Update: {
          permission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_or_update_subscription: {
        Args: { p_user_id: string; p_plan: string; p_payment_ref?: string }
        Returns: string
      }
      expire_subscription: {
        Args: { p_subscription_id: string }
        Returns: undefined
      }
      get_user_subscription: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          plan: string
          date_debut: string
          date_fin: string
          statut: string
          payment_ref: string
        }[]
      }
      store_transaction: {
        Args: {
          p_reference: string
          p_order_id: string
          p_amount: number
          p_type: string
          p_metadata: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
