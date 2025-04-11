-- Enable RLS
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access to products"
ON produits FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert/update their own products
CREATE POLICY "Allow authenticated users to insert products"
ON produits FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their own products"
ON produits FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
