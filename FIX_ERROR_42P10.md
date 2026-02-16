# 🚨 FIX URGENTE - Errore 42P10 Risolto

## Problema
Errore: `42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification`

## ✅ Codice Fixato

Ho corretto **2 file** che usavano il vecchio `onConflict: 'key'`:

1. ✅ `src/hooks/useContent.js` - Ora usa `onConflict: 'section,key'`
2. ✅ `src/pages/Services.jsx` - Ora usa `onConflict: 'section,key'`

---

## 🔧 ORA Devi Fare Queste 3 Cose:

### **1. Esegui lo Script SQL** ⚡ CRITICO

```bash
# IMPORTANTE: Esegui questo PRIMA di tutto!

1. Apri fix_database_quick.sql
2. Copia TUTTO il contenuto
3. Vai su Supabase Dashboard
4. SQL Editor > New Query
5. Incolla e clicca RUN
```

**Cosa fa**: Aggiunge la constraint `UNIQUE (section, key)` al database.

**Risultato atteso**: 
- Prima query: 1 riga che mostra la constraint creata
- Seconda query: ~10 righe con i dati della home

---

### **2. Riavvia il Dev Server** ⚡

Sul PC:

```bash
# Nel terminale dove gira npm run dev:
1. Premi Ctrl+C per fermare
2. Aspetta che si fermi completamente
3. Digita: npm run dev
4. Aspetta che ricompili
```

---

### **3. Hard Refresh Browser** ⚡

**iPhone / Safari:**
```
1. Chiudi completamente Safari (swipe up)
2. Settings > Safari > Clear History and Website Data
3. Riapri Safari e vai sul sito
```

**PC / Chrome/Edge:**
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

---

## 🧪 Test

Dopo aver fatto i 3 step sopra:

### Test 1: Sul PC
```
1. Vai su /admin (login se necessario)
2. Vai sulla Home
3. Clicca su un campo per modificarlo (es: titolo)
4. Cambia il testo
5. Salva
6. Apri DevTools (F12) > Console
7. Dovresti vedere: "Saved successfully: home hero_title"
```

### Test 2: Su iPhone
```
1. Vai su /admin
2. Modifica un campo
3. Salva
4. Ricarica pagina
5. Il testo dovrebbe essere salvato ✅
```

---

## 📊 Verifica SQL (Opzionale)

Dopo aver eseguito `fix_database_quick.sql`, controlla su Supabase SQL Editor:

```sql
-- Verifica che la constraint esista
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'site_content'::regclass 
AND conname = 'site_content_section_key_unique';

-- Dovresti vedere:
-- conname: site_content_section_key_unique
-- contype: u (unique)
```

```sql
-- Verifica i dati
SELECT section, key, type 
FROM site_content 
WHERE section = 'home'
ORDER BY key;

-- Dovresti vedere ~10 righe
```

---

## ❌ Se Continua a Dare Errore

### Errore: "constraint already exists"

**Soluzione**:
```sql
-- Elimina e ricrea
ALTER TABLE site_content DROP CONSTRAINT IF EXISTS site_content_section_key_unique;
ALTER TABLE site_content ADD CONSTRAINT site_content_section_key_unique UNIQUE (section, key);
```

### Errore: Browser cache persistente

**Soluzione iPhone**:
```
Settings > Safari > Advanced > Website Data > Remove All
```

**Soluzione PC**:
```
1. DevTools (F12)
2. Application tab
3. Clear storage
4. Clear site data
```

### Errore: "onConflict still using 'key'"

**Verifica codice**:
```bash
# Cerca nel progetto
grep -r "onConflict: 'key'" src/

# Non dovrebbe trovare nulla!
# Se trova qualcosa, quel file va fixato
```

---

## 📋 Checklist Rapida

- [ ] Script SQL eseguito su Supabase
- [ ] Constraint verificata (query di check)
- [ ] Dev server riavviato
- [ ] Browser cache pulita (hard refresh)
- [ ] Test modifica su PC - OK
- [ ] Test modifica su iPhone - OK
- [ ] Console: "Saved successfully" visibile
- [ ] Nessun errore 400 nel Network tab

---

## 🎯 Motivo dell'Errore

**Prima:**
```javascript
onConflict: 'key'  // ❌ Sbagliato - solo una colonna
```

**Ora:**
```javascript
onConflict: 'section,key'  // ✅ Corretto - entrambe le colonne
```

**Perché?** La constraint UNIQUE sul database usa DUE colonne: `(section, key)`.
L'upsert deve specificare **entrambe** le colonne della constraint!

---

## 💡 Risultato Finale

Dopo il fix:
✅ Puoi modificare contenuti da admin
✅ Le modifiche vengono salvate nel database
✅ Funziona sia su PC che iPhone
✅ Nessun errore 400 / 42P10

---

**FAI I 3 STEP SOPRA E POI TESTA! 🚀**
