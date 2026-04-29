-- ============================================
-- CineLog - Schema para Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

CREATE TABLE IF NOT EXISTS movies (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  year        INTEGER,
  director    TEXT,
  genre       TEXT,
  rating      DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  poster_url  TEXT,
  review      TEXT,
  watched     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_movies_user_id ON movies(user_id);
CREATE INDEX idx_movies_created_at ON movies(created_at DESC);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_movies" ON movies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own_movies" ON movies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_movies" ON movies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "delete_own_movies" ON movies
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER movies_updated_at
BEFORE UPDATE ON movies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();