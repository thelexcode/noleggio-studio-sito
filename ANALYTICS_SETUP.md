# 📊 Google Analytics & Search Console - Setup Guide

## 🔍 Google Search Console

### Step 1: Verifica Proprietà

Scegli uno dei metodi di verifica:

#### Metodo 1: Meta Tag (Raccomandato)
```html
<!-- Aggiungi in index.html, dentro <head>, dopo gli altri meta tags -->
<meta name="google-site-verification" content="IL_TUO_CODICE_DI_VERIFICA" />
```

#### Metodo 2: File HTML
```
1. Scarica il file da Search Console
2. Carica in public/ (es: public/google1234567890.html)
3. Verrà servito come /google1234567890.html
```

#### Metodo 3: DNS (Più Tecnico)
```
Aggiungi record TXT al DNS del dominio
Nome: @
Valore: google-site-verification=XXXXXX
```

### Step 2: Invia Sitemap

```
URL della sitemap da inviare:
https://noleggiostudio.tv/sitemap.xml

Nella Search Console:
1. Vai su "Sitemap" nel menu laterale
2. Inserisci "sitemap.xml"
3. Clicca "Invia"
```

### Step 3: Richiedi Indicizzazione

```
Per ogni pagina importante:
1. Ispezione URL
2. Inserisci URL completo (es: https://noleggiostudio.tv/servizi)
3. Clicca "Richiedi indicizzazione"

Pagine da indicizzare subito:
- https://noleggiostudio.tv/
- https://noleggiostudio.tv/servizi
- https://noleggiostudio.tv/contatti
- https://noleggiostudio.tv/chi-siamo
- https://noleggiostudio.tv/galleria
```

---

## 📈 Google Analytics 4

### Step 1: Crea Proprietà GA4

```
1. Vai su https://analytics.google.com
2. Crea account "Noleggio Studio TV"
3. Crea proprietà GA4
4. Ottieni MEASUREMENT_ID (formato: G-XXXXXXXXXX)
```

### Step 2: Installa Tracking Code

Crea un nuovo file: `src/components/Analytics.jsx`

```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ⚠️ SOSTITUISCI CON IL TUO ID

  useEffect(() => {
    // Track page views on route change
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default Analytics;
```

### Step 3: Aggiungi in index.html

```html
<!-- Aggiungi in index.html, prima di </head> -->

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Non fare config qui, lo fa il componente React
  // gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Step 4: Aggiungi Analytics in App.jsx

```javascript
import Analytics from './components/Analytics';

function App() {
  // ... resto del codice
  
  return (
    <AuthProvider>
      <Analytics /> {/* ⭐ Aggiungi qui */}
      <ScrollToTop />
      <AnimatePresence mode='wait'>
        {/* ... routes */}
      </AnimatePresence>
    </AuthProvider>
  );
}
```

---

## 🎯 Eventi Custom da Tracciare

### Crea file: `src/utils/analytics.js`

```javascript
// Tracking eventi custom
export const trackEvent = (eventName, parameters = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Eventi specifici
export const trackFormSubmit = (formName) => {
  trackEvent('form_submit', {
    form_name: formName,
    page_location: window.location.href
  });
};

export const trackPhoneClick = () => {
  trackEvent('phone_click', {
    page_location: window.location.href
  });
};

export const trackEmailClick = () => {
  trackEvent('email_click', {
    page_location: window.location.href
  });
};

export const trackCTAClick = (ctaName) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    page_location: window.location.href
  });
};

export const trackServiceView = (serviceName) => {
  trackEvent('service_view', {
    service_name: serviceName
  });
};
```

### Usa nel Form Preventivo (Contact.jsx)

```javascript
import { trackFormSubmit } from '../utils/analytics';

const handleSubmit = async (e) => {
  e.preventDefault();
  // ... codice esistente
  
  try {
    await emailjs.send(/* ... */);
    
    // Track successo form
    trackFormSubmit('preventivo');
    
    showSuccess('Grazie per la tua richiesta!');
  } catch (error) {
    // ...
  }
};
```

### Traccia Click Telefono

```javascript
import { trackPhoneClick } from '../utils/analytics';

<a 
  href="tel:+390212345678" 
  onClick={() => trackPhoneClick()}
  className="..."
>
  +39 02 12345678
</a>
```

---

## 🎨 Google Tag Manager (Alternativa)

Se preferisci GTM invece di GA4 diretto:

### Step 1: Crea Container GTM

```
1. Vai su https://tagmanager.google.com
2. Crea account e container
3. Ottieni GTM-XXXXXXX ID
```

### Step 2: Installa GTM

```html
<!-- Aggiungi in index.html, subito dopo <head> -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->

<!-- Aggiungi subito dopo <body> -->
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

---

## 📊 Dashboard Obiettivi GA4

### Conversioni da Configurare:

1. **Form Preventivo Inviato**
   - Nome evento: `form_submit`
   - Parametro: `form_name` = `preventivo`

2. **Click Telefono**
   - Nome evento: `phone_click`

3. **Click Email**
   - Nome evento: `email_click`

4. **View Servizio**
   - Nome evento: `service_view`
   - Parametro: `service_name`

### Come Configurare in GA4:

```
1. Vai su Admin > Eventi
2. Clicca "Crea evento"
3. Nome evento personalizzato
4. Imposta come conversione
```

---

## 🔔 Alert e Report

### Report Settimanali:

```
1. Search Console:
   - Performance query
   - Top pages
   - CTR medio
   - Impressions

2. Analytics:
   - Utenti nuovi
   - Sessioni
   - Bounce rate
   - Conversioni
```

### Alert da Configurare:

```
- Calo traffico > 50%
- Aumento errori 404
- Nuovo backlink rilevato
- Nuova keyword in top 10
```

---

## 🎯 KPI da Monitorare

### Settimanali:
- [ ] Posizione keywords principali
- [ ] Nuove impressions
- [ ] CTR medio
- [ ] Conversioni

### Mensili:
- [ ] Traffico organico totale
- [ ] Nuove keywords posizionate
- [ ] Backlinks acquisiti
- [ ] Tasso di conversione
- [ ] Bounce rate per pagina

---

## 📝 Template Report Mensile

```markdown
# Report SEO - [Mese Anno]

## Metriche Chiave
- Traffico organico: XXX (+/- X%)
- Keywords in Top 10: XX (+/- X)
- Conversioni: XX (+/- X%)
- CTR medio: X.X% (+/- X%)

## Top Keywords
1. [keyword] - Posizione X (±X)
2. [keyword] - Posizione X (±X)
3. [keyword] - Posizione X (±X)

## Pagine Top
1. [URL] - XXX visite
2. [URL] - XXX visite
3. [URL] - XXX visite

## Azioni del Mese
- [ ] Pubblicato X articoli
- [ ] Ottenuto X backlinks
- [ ] Raccolte X recensioni
- [ ] Ottimizzata pagina X

## Prossimi Steps
- [ ] ...
- [ ] ...
```

---

## 🚀 Quick Start Checklist

### Google Search Console:
- [ ] Account creato
- [ ] Proprietà verificata
- [ ] Sitemap inviata
- [ ] Url indicizzate
- [ ] Report settato

### Google Analytics:
- [ ] Proprietà GA4 creata
- [ ] Codice installato
- [ ] Analytics.jsx creato
- [ ] Eventi configurati
- [ ] Conversioni impostate
- [ ] Report periodici attivati

### Google My Business:
- [ ] Profilo creato/rivendicato
- [ ] Info complete
- [ ] Foto caricate
- [ ] Orari impostati
- [ ] Prime recensioni

---

## 💡 Pro Tips

1. **Page Speed**: Monitora Core Web Vitals in Search Console
2. **Mobile**: 70% traffico è mobile, ottimizza!
3. **Local**: GMB è fondamentale per ricerca locale
4. **Reviews**: Rispondi sempre, influenzano ranking
5. **Content**: Pubblica costantemente, Google ama fresh content

---

## 🆘 Troubleshooting

### Sito non indicizzato dopo 2 settimane?
```
1. Verifica robots.txt
2. Controlla Search Console per errori
3. Richiedi manualmente indicizzazione
4. Verifica sitemap.xml
```

### Tracking non funziona?
```
1. Apri DevTools > Console
2. Digita: window.gtag
3. Deve restituire una funzione
4. Controlla Network tab per richieste a google-analytics.com
```

### Eventi non tracciati?
```
1. GA4 > Rapporti > Realtime
2. Esegui azione sul sito
3. Verifica evento in tempo reale
4. Attendi 24-48h per dati storici
```

---

**Tutto pronto per il decollo! 🚀**
