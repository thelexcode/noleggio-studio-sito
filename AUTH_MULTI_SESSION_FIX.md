# 🔐 Fix Sessioni Multiple - Autenticazione Admin

## Problema
Quando sei loggato come admin su più dispositivi (es: iPhone + PC), uno dei due rimane bloccato con caricamento infinito.

## ✅ Soluzioni Implementate

### 1. **Codice Migliorato** (`AuthContext.jsx`)

Modifiche apportate:
- ✅ **Gestione eventi specifici**: SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, SIGNED_OUT
- ✅ **Refresh automatico**: Token viene rinnovato ogni 50 minuti
- ✅ **Error handling robusto**: Gestione errori di sessione
- ✅ **Logging migliorato**: Per debug

### 2. **Configurazione Supabase** (`supabase.js`)

Aggiunte configurazioni:
- ✅ `autoRefreshToken: true` - Rinnova token automaticamente
- ✅ `flowType: 'pkce'` - Flow di autenticazione più sicuro
- ✅ `storageKey` personalizzata - Evita conflitti

---

## 🔧 Configurazione Supabase Dashboard

### **IMPORTANTE**: Vai su Supabase e configura quanto segue:

### Step 1: Abilita Sessioni Multiple

```
1. Vai su Supabase Dashboard
2. Clicca sul tuo progetto
3. Vai su Authentication > Settings
4. Cerca "Sessions"
5. Verifica che sia abilitato:
   ✅ "Multiple sessions per user" = ENABLED
```

### Step 2: Configura JWT Expiry

```
In Authentication > Settings:

JWT Expiry:
- Access Token (JWT): 3600 secondi (1 ora) ✅ DEFAULT
- Refresh Token: 604800 secondi (7 giorni) ✅ DEFAULT

Se necessario, puoi aumentare:
- Refresh Token: 2592000 (30 giorni) per sessioni più lunghe
```

### Step 3: Security Settings

```
In Authentication > Settings > Security:

✅ Enable Email Confirmations: Dipende dalle tue preferenze
✅ Enable Phone Confirmations: NO (se non usi telefono)
⚠️ Secure email change: YES (raccomandato)
✅ Enable session time limits: NO (già gestito da JWT expiry)
```

---

## 🧪 Test

### Come Testare il Fix:

1. **Device 1 (PC)**:
   ```
   - Vai su /admin
   - Fai login
   - Dovresti vedere la dashboard admin
   ```

2. **Device 2 (iPhone)**:
   ```
   - Vai su /admin (stesso account)
   - Fai login
   - Dovresti vedere la dashboard admin
   ```

3. **Verifica**:
   ```
   - Entrambi i dispositivi dovrebbero funzionare
   - Nessun loading infinito
   - Puoi modificare contenuti da entrambi
   ```

4. **Apri DevTools** (su PC):
   ```
   - F12 > Console
   - Dovresti vedere log tipo:
     "Auth State Change: TOKEN_REFRESHED [user-id]"
     "Auth State Change: SIGNED_IN [user-id]"
   ```

---

## 📊 Come Funziona

### Timeline di una Sessione:

```
0:00 - Login su Device 1
       ↓
       Token creato (valido 1h)
       Session salvata in localStorage

0:30 - Login su Device 2
       ↓
       Nuovo token creato (indipendente)
       Session separata

0:50 - Auto-refresh su Device 1
       ↓
       Token rinnovato automaticamente
       Device 2 non influenzato

1:00 - Auto-refresh su Device 2
       ↓
       Token rinnovato
       Device 1 non influenzato
```

**KEY POINT**: Ogni device ha la **SUA sessione indipendente**!

---

## 🐛 Troubleshooting

### Problema: Ancora loading infinito

**Soluzione 1**: Pulisci localStorage
```javascript
// Apri Console (F12) su entrambi i device
localStorage.clear()
// Poi ricarica e ri-logga
```

**Soluzione 2**: Verifica la tabella profiles
```sql
-- Su Supabase SQL Editor
SELECT id, role 
FROM profiles 
WHERE id = 'TUO-USER-ID';

-- Se non esiste, creala:
INSERT INTO profiles (id, role)
VALUES ('TUO-USER-ID', 'admin');
```

**Soluzione 3**: Controlla RLS policies
```sql
-- Verifica che le policy permettano lettura
SELECT * FROM profiles WHERE id = auth.uid();
-- Dovrebbe tornare il tuo profilo
```

### Problema: Token refresh fallisce

**Debug**:
```javascript
// In Console:
supabase.auth.getSession().then(console.log)
// Controlla che session non sia null
```

**Fix**:
```
1. Logout da tutti i device
2. Pulisci localStorage
3. Ri-logga
```

### Problema: CheckAdminStatus lento

Se `checkAdminStatus()` impiega troppo tempo:

**Ottimizzazione** (opzionale):
```javascript
// In AuthContext, aggiungi caching:
const [adminCache, setAdminCache] = useState({});

const checkAdminStatus = async (userId) => {
    // Check cache first
    if (adminCache[userId] !== undefined) {
        setIsAdmin(adminCache[userId]);
        return;
    }
    
    // Fetch from DB
    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
    
    const isAdminUser = data?.role === 'admin';
    setIsAdmin(isAdminUser);
    setAdminCache(prev => ({ ...prev, [userId]: isAdminUser }));
};
```

---

## 📝 Checklist Finale

- [ ] Codice aggiornato (`AuthContext.jsx` e `supabase.js`)
- [ ] Supabase: "Multiple sessions" abilitato
- [ ] Supabase: JWT expiry configurato
- [ ] Test su Device 1: login OK
- [ ] Test su Device 2: login OK
- [ ] Verifica: nessun loading infinito
- [ ] Verifica: entrambi possono editare
- [ ] Console: nessun errore rosso

---

## 🎯 Risultato Atteso

Dopo queste modifiche:

✅ **Device multipli** - Login simultaneo senza problemi
✅ **Auto-refresh** - Token rinnovato automaticamente
✅ **Nessun conflitto** - Sessioni indipendenti per device
✅ **UX migliore** - Nessun loading infinito
✅ **Sicurezza** - PKCE flow più sicuro

---

## 💡 Note Importanti

1. **LocalStorage**: Ogni browser/device ha il suo localStorage separato
2. **Token diversi**: Ogni sessione ha un token JWT unico
3. **No logout automatico**: Un device non fa logout dell'altro
4. **Refresh indipendente**: Ogni device refresha il suo token

---

## 🆘 Se Continua a Non Funzionare

1. Apri Console su entrambi i device
2. Copia i log di "Auth State Change"
3. Verifica che non ci siano errori 500
4. Controlla Network tab per richieste fallite a Supabase
5. Verifica che `profiles` table esista e abbia RLS corretto

**File da controllare**:
- `src/contexts/AuthContext.jsx`
- `src/supabase.js`
- Supabase Dashboard > Authentication > Settings
