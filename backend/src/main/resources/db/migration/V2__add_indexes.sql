CREATE INDEX IF NOT EXISTS idx_records_language
ON records(language);

CREATE INDEX IF NOT EXISTS idx_records_status
ON records(status);

CREATE INDEX IF NOT EXISTS idx_records_language_status
ON records(language, status);