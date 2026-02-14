-- Insert content for Home Page
INSERT INTO site_content (section, key, value, label, type) VALUES
('home', 'hero_badge', '"PROFESSIONAL BROADCAST SERVICES"', 'Badge Hero', 'text'),
('home', 'hero_title', '"Lo Spazio per la Tua Produzione"', 'Titolo Hero', 'text'),
('home', 'hero_desc', '"Studi televisivi premium con attrezzature all''avanguardia. Regia, streaming e supporto tecnico per elevare i tuoi contenuti."', 'Descrizione Hero', 'textarea'),
('home', 'features_title', '"Eccellenza Tecnica"', 'Titolo Features', 'text'),
('home', 'features_desc', '"Ogni dettaglio è stato pensato per offrire la massima qualità produttiva."', 'Sottotitolo Features', 'textarea'),
('home', 'features_list', '[
    { "title": "Studi Attrezzati", "desc": "Set modulari con illuminazione broadcast e limbo/green screen.", "icon": "Video" },
    { "title": "Regia A/V", "desc": "Regie tricaster 4K, mixer audio digitali e workflow SDI.", "icon": "Mic" },
    { "title": "Live Streaming", "desc": "Connettività in fibra dedicata ridondata per dirette stabili.", "icon": "Globe" }
]', 'Lista Features', 'json'),
('home', 'why_us_badge', '"Perché Noi"', 'Badge Perché Noi', 'text'),
('home', 'why_us_title', '"Standard Televisivi, Flessibilità Digitale."', 'Titolo Perché Noi', 'text'),
('home', 'why_us_desc', '"Non offriamo solo uno spazio, ma un partner tecnico per la tua produzione. Dall''idea alla messa in onda, ti supportiamo con esperienza decennale."', 'Descrizione Perché Noi', 'textarea'),
('home', 'why_us_list', '[
    "Tecnologie 4K Ready", 
    "Personale Certificato", 
    "Privacy e Sicurezza", 
    "Location Premium a Milano"
]', 'Lista Perché Noi', 'json')
ON CONFLICT (key) DO NOTHING;

-- Insert content for About Page
INSERT INTO site_content (section, key, value, label, type) VALUES
('about', 'page_title', '"Chi Siamo"', 'Titolo Pagina', 'text'),
('about', 'page_subtitle', '"Professionisti della visione, tecnologi dell''immagine."', 'Sottotitolo Pagina', 'textarea'),
('about', 'main_title', '"Oltre il Semplice Studio"', 'Titolo Principale', 'text'),
('about', 'main_text_1', '"Siamo una realtà consolidata nel mondo delle produzioni televisive e dello streaming. Offriamo non solo spazi, ma soluzioni complete per chi cerca professionalità e tecnologia."', 'Paragrafo 1', 'textarea'),
('about', 'main_text_2', '"Il nostro studio nasce per rispondere alla crescente domanda di contenuti video di alta qualità, offrendo a case di produzione, agenzie e aziende uno spazio versatile e tecnologicamente avanzato."', 'Paragrafo 2', 'textarea'),
('about', 'main_text_3', '"Il nostro team è composto da registi, operatori, tecnici del suono e direttori della fotografia con anni di esperienza nei principali network televisivi."', 'Paragrafo 3', 'textarea'),
('about', 'philosophy_title', '"La Nostra Filosofia"', 'Titolo Filosofia', 'text'),
('about', 'philosophy_list', '[
    { "title": "Innovazione", "text": "Tecnologie all''avanguardia per flussi di lavoro efficienti.", "color": "border-primary" },
    { "title": "Flessibilità", "text": "Adattabili ad ogni esigenza, dallo shooting alla diretta TV.", "color": "border-indigo-400" },
    { "title": "Passione", "text": "Cura del dettaglio per trasformare idee in emozioni.", "color": "border-slate-800" }
]', 'Lista Filosofia', 'json')
ON CONFLICT (key) DO NOTHING;
