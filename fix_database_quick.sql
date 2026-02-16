-- =====================================================
-- FIX RAPIDO - Aggiungi Constraint e Dati
-- =====================================================
-- Esegui questo script su Supabase SQL Editor

-- Step 1: Rimuovi constraint esistente se c'è (ignora errore se non esiste)
ALTER TABLE site_content DROP CONSTRAINT IF EXISTS site_content_section_key_unique;
ALTER TABLE site_content DROP CONSTRAINT IF EXISTS site_content_key_key;

-- Step 2: Aggiungi la constraint corretta
ALTER TABLE site_content 
ADD CONSTRAINT site_content_section_key_unique UNIQUE (section, key);

-- Step 3: Verifica che la constraint sia stata creata
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'site_content'::regclass 
AND conname = 'site_content_section_key_unique';

-- Dovresti vedere una riga con contype = 'u'

-- Step 4: Ora inserisci/aggiorna i dati della Home
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

-- Step 5: Verifica che i dati siano stati inseriti
SELECT 
    section,
    key,
    value,
    type,
    updated_at
FROM site_content
WHERE section = 'home'
ORDER BY key;

-- Dovresti vedere ~10 righe con i contenuti della home
