const base = 'assets/media/projects/nasa-bracket/';
const caption = (en, ro) => ({ en, ro });
const video = (name, en, ro) => ({ type: 'video', src: base + name + '.mp4', poster: base + name + '.jpg', alt: caption(en, ro) });
const image = (name, en, ro) => ({ src: base + name, alt: caption(en, ro) });

export const nasaBracket = {
  id: 'nasa-bracket',
  tags: ['Siemens NX', 'Reverse engineering', 'CAD / CAM', 'CNC'],
  url: null,
  sourceDocument: 'https://ntrs.nasa.gov/api/citations/19840025362/downloads/19840025362.pdf',
  media: {
    model: base + 'model.glb',
    orbit: '-145deg 70deg 120%',
    wireframe: base + 'wireframe.glb',
    poster: base + 'Bracket_478019.png',
    galleryFirst: true,
    document: base + 'Nasa_Bracket_Reverse_Eng.pdf',
    gallery: [
      video('Manufacturing_Process', 'Manufacturing process — overview of the machining simulation', 'Procesul de fabricație — prezentarea simulării de prelucrare'),
      image('Bracket_478019.png', 'Reconstructed CAD model of Bracket 478019', 'Modelul CAD reconstruit al suportului 478019'),
      image('Bracket_478019_technical_drawing.png', 'Technical drawing of the reconstructed bracket', 'Desenul tehnic al suportului reconstruit'),
      image('essex nasa 478019 part.jpg', 'Original NASA/Essex engineering drawing — Bracket 478019', 'Desenul tehnic original NASA/Essex — suportul 478019'),
      image('IPW analysis.png', 'Siemens NX In-Process Workpiece (IPW) analysis', 'Analiza piesei în curs de prelucrare (IPW) în Siemens NX'),
      image('Slide 4_3 - 1.png', 'G54 workholding concept — retain sacrificial stock beneath the bracket', 'Conceptul de fixare G54 — păstrarea materialului de sacrificiu sub suport'),
      image('Slide 4_3 - 2.png', 'G55 workholding concept — support the inverted bracket during stock removal', 'Conceptul de fixare G55 — susținerea suportului întors la îndepărtarea surplusului'),
      image('Slide 4_3 - 3.png', 'G56 workholding concept — support and clearance for perpendicular drilling', 'Conceptul de fixare G56 — susținere și spațiu liber pentru găurirea perpendiculară'),
    ],
  },
  en: {
    name: 'NASA Bracket 478019',
    category: 'Reverse engineering / CAD / CAM',
    date: 'OCTOBER 2026',
    description: 'From an original NASA/Essex engineering drawing to a reconstructed 3D model and a three-setup CNC manufacturing simulation in Siemens NX.',
    paragraphs: [
      'I reconstructed Bracket 478019 from the engineering documentation for a NASA robotic docking test facility. This educational study follows the L-shaped aluminium 6061-T6 component from drawing interpretation through CAD modelling, process planning and virtual machining.',
      'The proposed process uses three setups: G54 for the main milling and precision holes, G55 for removing sacrificial stock and finishing the underside, and G56 for perpendicular drilling. Siemens NX simulations and In-Process Workpiece (IPW) analysis helped refine the toolpaths and examine material removal.',
      'The report estimates 7 min 57 s of machining, excluding setup changes, inspection and finishing. A modified generic three-axis machine represents the planned process, with the Haas VF-2SS as reference equipment. Physical machining, machine-specific verification and dimensional inspection remain future validation steps.',
    ],
    galleryTitle: 'Manufacturing film & drawings',
    sourceLabel: 'Original NASA report: Development of Robotics Facility, Docking Test Hardware (PDF, English)',
    documentTitle: 'Manufacturing process report',
    documentSummary: 'The 51-page report documents the reverse engineering, material and stock selection, workholding, cutting tools, Siemens NX CAM programming, simulation results, inspection plan and preliminary time and cost estimates. It is an educational manufacturing study, with assumptions and validation limits documented throughout.',
    documentLink: 'Read the full report (PDF, English · 51 pages)',
  },
  ro: {
    name: 'Suport NASA 478019',
    category: 'Inginerie inversă / CAD / CAM',
    date: 'OCTOMBRIE 2026',
    description: 'De la desenul tehnic original NASA/Essex la un model 3D reconstruit și simularea unui proces CNC în trei prinderi, în Siemens NX.',
    paragraphs: [
      'Am reconstruit suportul 478019 pe baza documentației tehnice a unei instalații NASA pentru testarea andocării robotizate. Studiul educațional urmărește piesa în formă de L, din aluminiu 6061-T6, de la interpretarea desenului la modelarea CAD, planificarea procesului și prelucrarea virtuală.',
      'Procesul propus folosește trei prinderi: G54 pentru frezările principale și găurile de precizie, G55 pentru îndepărtarea materialului de sacrificiu și finisarea feței inferioare, apoi G56 pentru găurirea perpendiculară. Simulările Siemens NX și analiza piesei în curs de prelucrare (IPW) au ajutat la corectarea traiectoriilor și examinarea îndepărtării materialului.',
      'Raportul estimează 7 min 57 s de prelucrare, fără schimbarea prinderilor, inspecție și finisare ulterioară. O mașină generică modificată, cu trei axe, reprezintă procesul planificat, având Haas VF-2SS drept echipament de referință. Prelucrarea fizică, verificarea pe mașina reală și inspecția dimensională rămân etape viitoare de validare.',
    ],
    galleryTitle: 'Simularea fabricației și desene',
    sourceLabel: 'Raportul NASA original: Development of Robotics Facility, Docking Test Hardware (PDF, engleză)',
    documentTitle: 'Raportul procesului de fabricație',
    documentSummary: 'Raportul de 51 de pagini documentează ingineria inversă, alegerea materialului și a semifabricatului, prinderile, sculele, programarea CAM în Siemens NX, rezultatele simulării, planul de inspecție și estimările preliminare de timp și cost. Este un studiu educațional de fabricație, care precizează ipotezele și limitele validării.',
    documentLink: 'Citește raportul integral (PDF, engleză · 51 de pagini)',
  },
};
