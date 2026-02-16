# 🔧 Fix Database - Site Content

## Problema
I contenuti della Home non si salvano quando modifichi da admin. Probabilmente manca la constraint UNIQUE sul database.

## Soluzione Rapida

### Step 1: Vai su Supabase
1. Apri il tuo progetto Supabase
2. Vai su **SQL Editor** (icona nel menu laterale)

### Step 2: Esegui lo Script
1. Apri il file `database_schema.sql`
2. Copia **TUTTO** il contenuto
3. Incolla nel SQL Editor di Supabase
4. Clicca **Run** o premi `Ctrl+Enter`

### Step 3: Verifica
Dovresti vedere un risultato con tutte le righe della tabella `site_content` per la sezione 'home'.

---

## Cosa Fa lo Script

### 1. Crea/Aggiorna la Tabella
```sql
CREATE TABLE site_content (
    id BIGSERIAL PRIMARY KEY,
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSONB,
    type TEXT DEFAULT 'text',
    ...
    CONSTRAINT site_content_section_key_unique UNIQUE (section, key)
);
```

**IMPORTANTE**: La constraint `UNIQUE (section, key)` permette l'upsert nel codice!

### 2. Aggiunge Indici
Per performance delle query:
- `idx_site_content_section`
- `idx_site_content_key`
- `idx_site_content_section_key`

### 3. Configura RLS (Row Level Security)
- Lettura pubblica ✅
- Modifica solo per utenti autenticati ✅

### 4. Inserisce Dati Iniziali
Tutti i contenuti della home:
- hero_badge
- hero_title
- hero_desc
- features_title
- features_desc
- features_list (JSON)
- why_us_badge
- why_us_title
- why_us_desc
- why_us_list (JSON)

---

## Troubleshooting

### Errore: "relation already exists"
✅ **NORMALE!** La tabella esiste già. Lo script la aggiorna.

### Errore: "constraint already exists"
Due opzioni:

**Opzione A: Elimina constraint esistente**
```sql
ALTER TABLE site_content DROP CONSTRAINT IF EXISTS site_content_section_key_unique;
```
Poi ri-esegui lo script completo.

**Opzione B: Salta la creazione**
Commenta le righe `CONSTRAINT` nello script.

### Errore: "policy already exists"
```sql
DROP POLICY IF EXISTS "Allow public read access" ON site_content;
DROP POLICY IF EXISTS "Allow authenticated users to modify" ON site_content;
```
Poi ri-esegui lo script.

---

## Verifica che Funzioni

### Test 1: Controlla la Tabella
```sql
SELECT * FROM site_content WHERE section = 'home';
```
Dovresti vedere ~10 righe.

### Test 2: Controlla la Constraint
```sql
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'site_content'::regclass;
```
Dovresti vedere `site_content_section_key_unique` con type = `u` (unique).

### Test 3: Prova a Salvare
1. Vai sul sito come admin
2. Modifica un testo nella home (es: titolo)
3. Salva
4. Ricarica la pagina
5. Il testo dovrebbe essere salvato ✅

---

## Se Continua a Non Funzionare

### Debug nella Console
1. Apri DevTools (F12)
2. Vai su Console
3. Prova a salvare
4. Cerca errori rossi

### Errori Comuni

**"duplicate key value violates unique constraint"**
❌ Significa che stai cercando di inserire una chiave duplicata
✅ Verifica che l'upsert usi `onConflict: 'section, key'` invece di solo `'key'`

**"null value in column violates not-null constraint"**
❌ Manca un valore richiesto
✅ Controlla che `section` e `key` siano sempre specificati

**"permission denied"**
❌ RLS sta bloccando
✅ Verifica di essere loggato come admin

---

## Modifica al Codice (Se Necessario)

Se l'upsert continua a dare problemi, modifica `useContent.js`:

```javascript
// PRIMA (riga 124)
{ onConflict: 'key' }

// DOPO (più specifico)
{ onConflict: 'section,key' }
```

Oppure usa `upsert` con il parametro completo:

```javascript
const { error } = await supabase
    .from('site_content')
    .upsert({
        section,
        key: dbKey,
        value: dbValue,
        type: typeof dbValue === 'object' ? 'json' : 'text',
        updated_at: new Date()
    }, { 
        onConflict: 'section,key',
        ignoreDuplicates: false 
    });
```

---

## Checklist

- [ ] Script eseguito su Supabase SQL Editor
- [ ] Nessun errore nell'esecuzione
- [ ] Verifica: `SELECT * FROM site_content WHERE section = 'home'` ritorna dati
- [ ] Verifica: constraint unique esiste
- [ ] Test: modifica e salva un contenuto da admin
- [ ] Test: ricarica pagina e verifica che il cambio sia persistito

---

## 🆘 Supporto

Se continui ad avere problemi:
1. Copia l'errore dalla console
2. Verifica la struttura della tabella su Supabase
3. Controlla le policy RLS

**File correlati:**
- `database_schema.sql` - Schema completo
- `src/hooks/useContent.js` - Logica salvataggio
- Supabase Dashboard > Database > site_content
