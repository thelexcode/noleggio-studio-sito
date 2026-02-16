-- =====================================================
-- SCHEMA DATABASE PER NOLEGGIO STUDIO TV
-- =====================================================
-- Questo file contiene la struttura completa del database
-- Esegui questo script su Supabase SQL Editor

-- =====================================================
-- TABELLA: site_content
-- Gestisce tutti i contenuti editabili del sito
-- =====================================================

-- Elimina la tabella se esiste (ATTENZIONE: cancella tutti i dati!)
-- DROP TABLE IF EXISTS site_content CASCADE;

-- Crea la tabella site_content
CREATE TABLE IF NOT EXISTS site_content (
    id BIGSERIAL PRIMARY KEY,
    section TEXT NOT NULL,           -- es: 'home', 'services', 'about'
    key TEXT NOT NULL,                -- es: 'hero_title', 'page_title'
    value JSONB,                      -- Valore del contenuto (può essere testo o JSON)
    type TEXT DEFAULT 'text',         -- 'text' o 'json'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: combinazione section + key deve essere unica
    CONSTRAINT site_content_section_key_unique UNIQUE (section, key)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section, key);

-- Abilita Row Level Security (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Tutti possono leggere
CREATE POLICY "Allow public read access" ON site_content
    FOR SELECT
    USING (true);

-- Policy: Solo utenti autenticati possono modificare
CREATE POLICY "Allow authenticated users to modify" ON site_content
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- DATI INIZIALI PER LA HOME
-- =====================================================

-- Inserisci/Aggiorna contenuti della Home
INSERT INTO site_content (section, key, value, type) VALUES
    ('home', 'hero_badge', '"PROFESSIONAL BROADCAST SERVICES"', 'text'),
    ('home', 'hero_title', '"Lo Spazio per la Tua Produzione"', 'text'),
    ('home', 'hero_desc', '"Studi televisivi premium con attrezzature all''avanguardia. Regia, streaming e supporto tecnico per elevare i tuoi contenuti."', 'text'),
    ('home', 'features_title', '"Eccellenza Tecnica"', 'text'),
    ('home', 'features_desc', '"Ogni dettaglio è stato pensato per offrire la massima qualità produttiva."', 'text'),
    ('home', 'features_list', '[
        {"title": "Studi Attrezzati", "desc": "Set modulari con illuminazione broadcast e limbo/green screen."},
        {"title": "Regia A/V", "desc": "Regie tricaster 4K, mixer audio digitali e workflow SDI."},
        {"title": "Live Streaming", "desc": "Connettività in fibra dedicata ridondata per dirette stabili."}
    ]'::jsonb, 'json'),
    ('home', 'why_us_badge', '"Perché Noi"', 'text'),
    ('home', 'why_us_title', '"Standard Televisivi, Flessibilità Digitale."', 'text'),
    ('home', 'why_us_desc', '"Non offriamo solo uno spazio, ma un partner tecnico per la tua produzione. Dall''idea alla messa in onda, ti supportiamo con esperienza decennale."', 'text'),
    ('home', 'why_us_list', '[
        "Tecnologie 4K Ready",
        "Personale Certificato",
        "Privacy e Sicurezza",
        "Location Premium a Milano"
    ]'::jsonb, 'json')
ON CONFLICT (section, key) 
DO UPDATE SET 
    value = EXCLUDED.value,
    type = EXCLUDED.type,
    updated_at = NOW();

-- =====================================================
-- VERIFICA DATI INSERITI
-- =====================================================

-- Mostra tutti i contenuti della home
SELECT 
    id,
    section,
    key,
    value,
    type,
    created_at,
    updated_at
FROM site_content
WHERE section = 'home'
ORDER BY key;

-- =====================================================
-- NOTE IMPORTANTI
-- =====================================================

/*
1. La constraint UNIQUE su (section, key) permette l'upsert
2. Il campo 'value' è JSONB per supportare sia testo che oggetti
3. RLS è abilitato ma permette lettura pubblica
4. Solo utenti autenticati possono modificare i contenuti

COME USARE:
-----------
1. Copia tutto questo script
2. Vai su Supabase > SQL Editor
3. Incolla e esegui
4. Verifica che non ci siano errori

TROUBLESHOOTING:
---------------
Se hai errori tipo "constraint already exists":
- Commenta le righe CREATE POLICY
- Oppure elimina prima le policy esistenti:
  DROP POLICY IF EXISTS "Allow public read access" ON site_content;
  DROP POLICY IF EXISTS "Allow authenticated users to modify" ON site_content;
*/
