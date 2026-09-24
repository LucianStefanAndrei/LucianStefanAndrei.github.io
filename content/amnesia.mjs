// Portfolio copy adapted from the supplied Amnesia README; screenshots are unmodified.
const mediaRoot = 'assets/media/projects/amnesia/';
const screenshots = [
  ['NotesAmnesia.png', 'Journal entries with tags, moods and pinned notes.', 'Însemnări de jurnal cu etichete, stări și note fixate.'],
  ['ChatAmnesia.png', 'Ask Amnesia: a local AI conversation with references to journal entries.', 'Ask Amnesia: conversație cu IA locală și referințe la însemnările din jurnal.'],
  ['VectorSearchAmnesia.png', 'Semantic search results for a query about fitness.', 'Rezultatele căutării semantice pentru o întrebare despre fitness.'],
  ['CalendarAmnesia.png', 'Calendar showing days with entries and the selected day’s notes.', 'Calendarul cu zilele care conțin însemnări și notele zilei selectate.'],
  ['NewNoteAmnesia.png', 'New entry form with title, content, date, category, tags and mood.', 'Formular pentru o însemnare nouă: titlu, conținut, dată, categorie, etichete și stare.'],
  ['ModelsAmnesia.png', 'Local model catalog with download controls and installation status.', 'Catalogul modelelor locale, cu opțiuni de descărcare și starea instalării.'],
  ['SettingsAmnesia.png', 'Settings for application language and typography.', 'Setările pentru limba aplicației și tipografie.'],
  ['ThemeLanguageAmnesia.png', 'The blue theme with Italian selected as the interface language.', 'Tema albastră, cu limba italiană selectată pentru interfață.'],
];

export const amnesia = {
  id: 'amnesia',
  image: 'media/projects/amnesia/NotesAmnesia.png',
  imageWidth: 1919, imageHeight: 1079,
  tags: ['Python', 'Local AI / RAG', 'Vector search', 'Argon2id / AES-256-GCM'],
  url: 'https://github.com/LucianStefanAndrei/Amnesia',
  media: {
    screenshots: true,
    gallery: screenshots.map(([file, en, ro]) => ({ src: mediaRoot + file, width: 1919, height: 1079, alt: { en, ro } })),
    video: mediaRoot + 'video.mp4',
    poster: mediaRoot + 'poster.jpg',
  },
  en: {
    category: 'Applied AI / Open source', name: 'Amnesia', date: 'JUN 2026 — ONGOING',
    description: 'A private desktop journal that turns your own notes into a searchable memory. Local AI, semantic retrieval and an encrypted vault keep the experience on your computer.',
    alt: 'Amnesia desktop application showing journal entries, filters and navigation.',
    previewLabel: 'APPLICATION SCREENSHOT', linkLabel: 'View on GitHub',
    problem: 'Make personal memories easier to retrieve without sending journal entries to a cloud AI service.',
    contribution: 'I am developing the desktop application, integrating journaling, local language models, retrieval-augmented generation (RAG), vector search and application-level encryption.',
    outcome: 'An ongoing open-source application with a working desktop interface, demonstrated in the screenshots and walkthrough below.',
    paragraphs: [
      'Amnesia brings everyday writing and local AI into one desktop application. I am developing the journal interface, retrieval workflow and encrypted storage around a simple goal: make personal memories useful without sending diary content to a cloud AI service.',
      'The assistant retrieves relevant passages from the journal to support its answers. Models are downloaded through the app, then run locally; internet access is needed for the initial model downloads. Development began in June 2026 and is ongoing.',
    ],
    featuresTitle: 'Inside the application', galleryTitle: 'Application screenshots',
    features: [
      ['Write, organize, revisit', 'Create entries with dates, titles, tags, moods and colors. Filter your notes, pin important entries and browse them through a calendar.'],
      ['Ask your own journal', 'Vector search retrieves relevant notes for the local RAG assistant. Ask date-aware questions in English or Romanian, revisit chat history and stop generation at any time.'],
      ['An encrypted local vault', 'The master password derives a 256-bit key in memory using Argon2id. AES-256-GCM encrypts notes, tags, moods, embeddings and chat sessions at rest. Configurable inactivity locking and a manual lock protect access to the vault.'],
      ['Import, export, back up', 'Import CSV or JSON with English or Romanian column headers, or generate Romanian sample entries. Export individual notes as TXT, DOCX, CSV or PDF. Encrypted .amnesiabak backups support whole-vault export and restore.'],
      ['Make it your own', 'Choose from Cream, Dark, Dark Yellow, Blue and Black themes. Typography options range from handwritten diary styles to serif, sans-serif and monospace fonts, with language controls built into the interface.'],
      ['Desktop and command line', 'Launch on Windows with start.bat or use the Typer CLI. Commands cover hardware diagnostics, locking, desktop shortcuts and vault backups. The server can also run headless, with window, fullscreen and port options documented on GitHub.'],
    ],
  },
  ro: {
    category: 'IA aplicată / Open source', name: 'Amnesia', date: 'IUN 2026 — ÎN DESFĂȘURARE',
    description: 'Un jurnal desktop privat care transformă propriile însemnări într-o memorie ușor de explorat. IA locală, căutarea semantică și stocarea criptată păstrează experiența pe calculatorul tău.',
    alt: 'Aplicația desktop Amnesia, cu însemnări de jurnal, filtre și navigație.',
    previewLabel: 'CAPTURĂ DIN APLICAȚIE', linkLabel: 'Vezi pe GitHub',
    problem: 'Regăsirea mai ușoară a amintirilor personale, fără trimiterea însemnărilor către un serviciu IA din cloud.',
    contribution: 'Dezvolt aplicația desktop, integrând jurnalul, modelele lingvistice locale, generarea augmentată prin regăsirea informațiilor (RAG), căutarea vectorială și criptarea la nivel de aplicație.',
    outcome: 'O aplicație open-source în dezvoltare, cu o interfață desktop funcțională, prezentată în capturile și demonstrația de mai jos.',
    paragraphs: [
      'Amnesia reunește scrisul de zi cu zi și inteligența artificială locală într-o aplicație desktop. Dezvolt interfața jurnalului, mecanismul de regăsire a informațiilor și stocarea criptată cu un scop simplu: amintirile personale să fie utile fără ca însemnările să ajungă la un serviciu IA din cloud.',
      'Asistentul regăsește pasaje relevante din jurnal pentru a-și susține răspunsurile. Modelele se descarcă din aplicație, apoi rulează local; accesul la internet este necesar pentru descărcările inițiale. Dezvoltarea a început în iunie 2026 și continuă.',
    ],
    featuresTitle: 'În interiorul aplicației', galleryTitle: 'Capturi din aplicație',
    features: [
      ['Scrie, organizează, revino', 'Creează însemnări cu dată, titlu, etichete, stare și culoare. Filtrează notele, fixează-le pe cele importante și explorează-le în calendar.'],
      ['Întreabă propriul jurnal', 'Căutarea vectorială găsește notele relevante pentru asistentul RAG local. Pune întrebări despre anumite date în română sau engleză, revino la conversațiile anterioare și oprește generarea oricând.'],
      ['Un seif local criptat', 'Parola principală derivă în memorie o cheie de 256 de biți prin Argon2id. AES-256-GCM criptează însemnările, etichetele, stările, reprezentările vectoriale și conversațiile stocate. Blocarea manuală și blocarea automată după inactivitate protejează accesul la seif.'],
      ['Importă, exportă, salvează', 'Importă fișiere CSV sau JSON cu antete în română sau engleză ori generează însemnări demonstrative în română. Exportă note individuale în TXT, DOCX, CSV sau PDF. Copiile criptate .amnesiabak permit exportul și restaurarea întregului seif.'],
      ['Personalizează experiența', 'Alege dintre temele Cream, Dark, Dark Yellow, Blue și Black. Opțiunile tipografice includ stiluri de scris de mână, fonturi cu sau fără serife și fonturi monospațiate, iar limba se schimbă direct din interfață.'],
      ['Desktop și linie de comandă', 'Pe Windows, pornește aplicația cu start.bat sau folosește interfața Typer CLI. Comenzile includ diagnosticarea hardware, blocarea, crearea unei scurtături și copiile de siguranță. Serverul poate rula și fără fereastră, cu opțiuni pentru afișare și port documentate pe GitHub.'],
    ],
  },
};
