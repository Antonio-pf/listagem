-- Add normalized_name column to guests table
ALTER TABLE guests ADD COLUMN IF NOT EXISTS normalized_name TEXT;

-- Create function to normalize names (remove accents, lowercase, trim)
CREATE OR REPLACE FUNCTION normalize_name(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(trim(regexp_replace(
    translate(
      name,
      'áàâãäåāăąǎǻảạặầấẩẫậằắẳẵặéèêëēĕėęěẻẹệếềểễệíìîïĩīĭįıỉịóòôõöōŏőơǒỏọộồốổỗộờớởỡợúùûüũūŭůűųưǔủụừứửữựýỳŷÿỹỷỵñńņňÁÀÂÃÄÅĀĂĄǍǺẢẠẶẦẤẨẪẬẰẮẲẴẶÉÈÊËĒĔĖĘĚẺẸỆẾỀỂỄỆÍÌÎÏĨĪĬĮIỈỊÓÒÔÕÖŌŎŐƠǑỎỌỘỒỐỔỖỘỜỚỞỠỢÚÙÛÜŨŪŬŮŰŲƯǓỦỤỪỨỬỮỰÝỲŶŸỸỶỴÑŃŅŇ',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeiiiiiiiiiiiioooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuyyyyyyyynnnnaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeiiiiiiiiiiiooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuyyyyyyyynnnn'
    ),
    '\s+', ' ', 'g'
  )));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing records with normalized names
UPDATE guests SET normalized_name = normalize_name(name) WHERE normalized_name IS NULL;

-- Create index on normalized_name for better performance
CREATE INDEX IF NOT EXISTS idx_guests_normalized_name ON guests(normalized_name);

-- Create unique constraint on normalized_name + has_companion
CREATE UNIQUE INDEX IF NOT EXISTS idx_guests_unique_normalized ON guests(normalized_name, has_companion);

-- Add trigger to automatically normalize names on insert/update
CREATE OR REPLACE FUNCTION set_normalized_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_name := normalize_name(NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_normalized_name ON guests;
CREATE TRIGGER trigger_set_normalized_name
  BEFORE INSERT OR UPDATE OF name ON guests
  FOR EACH ROW
  EXECUTE FUNCTION set_normalized_name();
