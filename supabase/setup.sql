-- Activer RLS sur la table produits
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Enable read access for all users" ON produits;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON produits;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON produits;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON produits;

-- Créer les nouvelles politiques
-- Lecture : tout le monde peut lire les produits
CREATE POLICY "Enable read access for all users" 
ON produits FOR SELECT 
USING (true);

-- Insertion : uniquement les utilisateurs authentifiés
CREATE POLICY "Enable insert for authenticated users only" 
ON produits FOR INSERT 
TO authenticated 
WITH CHECK (auth.role() = 'authenticated');

-- Mise à jour : uniquement les utilisateurs authentifiés
CREATE POLICY "Enable update for authenticated users only" 
ON produits FOR UPDATE 
TO authenticated 
USING (auth.role() = 'authenticated');

-- Suppression : uniquement les utilisateurs authentifiés
CREATE POLICY "Enable delete for authenticated users only" 
ON produits FOR DELETE 
TO authenticated 
USING (auth.role() = 'authenticated');
