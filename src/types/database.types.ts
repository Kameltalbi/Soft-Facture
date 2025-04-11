export interface Database {
  public: {
    Tables: {
      bank_info: {
        Row: {
          id: string;
          bank_name: string;
          rib: string;
          iban: string;
          swift: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bank_name: string;
          rib: string;
          iban: string;
          swift: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bank_name?: string;
          rib?: string;
          iban?: string;
          swift?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
