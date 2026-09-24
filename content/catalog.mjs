import { projects } from './site.mjs';

const data = {
  'museum-robot': {
    folder:'RobotAntropomorf', video:true,
    en:['Autonomous Museum Guide','An anthropomorphic robot for autonomous museum guidance, developed as my Robotics Engineering bachelor’s thesis at UTCN, supervised by Prof. Călin Neamțu.','I designed and built a 1.3 m robot with a modular 3D-printed structure. Its mechanical design includes the transmission, shaft verification, CNC-machined parts and assembly tolerances. The documented component cost is €4,357.','Two NVIDIA Jetson Orin Nano boards run a distributed ROS2 Humble architecture, separating navigation from the human–machine interface. SLAM and Nav2 use a Livox Mid-360 LiDAR, an Orbbec Gemini 336 depth camera and ultrasonic sensors. Closed-loop motors with encoders drive four omnidirectional wheels.','The multilingual voice system combines speech recognition, Claude Sonnet and ElevenLabs Flash. Sentence-level streaming starts playback while the rest of the response is generated.','Accessibility features include guidance handles for visually impaired visitors, a removable screen, text input, and synchronized spoken and on-screen responses.'],
    ro:['Ghid autonom de muzeu','Un robot antropomorf pentru ghidaj autonom în muzee, realizat ca lucrare de licență în Inginerie Robotică la UTCN, sub coordonarea prof. Călin Neamțu.','Am proiectat și construit un robot de 1,3 m, cu o structură modulară imprimată 3D. Proiectarea mecanică include transmisia, verificarea arborilor, piese prelucrate CNC și toleranțele de asamblare. Costul documentat al componentelor este de 4.357 €.','Două plăci NVIDIA Jetson Orin Nano rulează o arhitectură distribuită ROS2 Humble, cu navigația separată de interfața om–mașină. SLAM și Nav2 folosesc un LiDAR Livox Mid-360, o cameră de adâncime Orbbec Gemini 336 și senzori ultrasonici. Motoarele cu encodere și control în buclă închisă acționează patru roți omnidirecționale.','Sistemul vocal multilingv combină recunoașterea vocală, Claude Sonnet și ElevenLabs Flash. Redarea începe la nivel de propoziție, în timp ce restul răspunsului este încă generat.','Funcțiile de accesibilitate includ mânere de ghidaj pentru vizitatorii cu deficiențe de vedere, un ecran detașabil, introducerea de text și răspunsuri vocale sincronizate cu textul afișat.'],
  },
  gearbox:{folder:'ReductorMelcat',model:true,images:['DesenTehnic.png'],tags:['Mechanical design','CAD','Technical drawing'],
    en:['Worm Gearbox Design','Mechanical design of a worm gearbox.','The project includes an assembly model and a technical drawing. The assembly can be explored in the interactive 3D view.'],
    ro:['Proiectarea unui reductor melcat','Proiectarea mecanică a unui reductor melcat.','Proiectul include modelul de ansamblu și un desen tehnic. Ansamblul poate fi explorat în vizualizarea 3D interactivă.']},
  robodk:{folder:'CelulaProducereRotiDintate',video:true,images:['Memoriu_Calcul.png'],tags:['RoboDK','Robotics','Simulation'],
    en:['Robotic Gear Manufacturing','Simulation of a manufacturing cell for gears.','The simulated workflow runs from raw-material handling through cutting, machining, finishing and heat treatment. The video shows the cell in RoboDK; the accompanying image documents the calculation report.'],
    ro:['Fabricație robotizată de roți dințate','Simularea unei celule pentru producerea de roți dințate.','Fluxul simulat acoperă preluarea materiei prime, tăierea, prelucrarea, finisarea și tratamentul termic. Videoclipul prezintă celula în RoboDK, iar imaginea alăturată documentează memoriul de calcul.']},
  'assistive-cane':{folder:'BastonNevazatori',model:true,tags:['Assistive technology','AI concept','Raspberry Pi','CAD'],
    en:['AI Assistive Cane','A concept for an AI-assisted cane for blind people.','A central camera is intended to capture the surroundings through 360° and estimate the distance to nearby objects. A built-in speaker would announce detected objects, while a Raspberry Pi and battery occupy the two side compartments.','Four small vibration motors are intended to provide directional feedback to the user’s hand when an object or person is nearby. This project presents a design concept and CAD assembly.'],
    ro:['Baston asistiv cu IA','Un concept de baston asistat de inteligență artificială pentru persoane nevăzătoare.','Camera centrală este gândită să preia imagini la 360° din mediul înconjurător și să estimeze distanța până la obiectele apropiate. Un difuzor integrat ar anunța obiectele detectate, iar un Raspberry Pi și bateria ocupă cele două compartimente laterale.','Patru motoare mici pentru vibrații sunt prevăzute pentru a transmite mâinii un feedback direcțional când un obiect sau o persoană se află în apropiere. Proiectul prezintă un concept de design și un ansamblu CAD.']},
  'pneumatic-arm':{folder:'Brat_Pneumatic',model:true,images:Array.from({length:6},(_,i)=>`Calcule_${i+1}.png`),tags:['Pneumatics','Mechanical design','CAD'],
    en:['Pneumatic Arm','Design of a pneumatic arm for lifting a simple load.','The mechanism uses a two-finger gripper, two rotations and two translations. The assembly is accompanied by six pages of design calculations.'],
    ro:['Braț pneumatic','Proiectarea unui braț pneumatic pentru ridicarea unei sarcini simple.','Mecanismul folosește un gripper cu două degete, două rotații și două translații. Ansamblul este însoțit de șase pagini de calcule de proiectare.']},
  'cnc-milling':{folder:'Piesa_GCode',video:true,images:['DesenTehnicPiesa.jpg'],tags:['CNC','G-code','Simulation'],
    en:['CNC Milling Simulation','Simulation of CNC milling using G-code.','The project includes a technical drawing of the part and a video of the machining simulation.'],
    ro:['Simularea frezării CNC','Simularea frezării unei piese la CNC folosind limbajul G-code.','Proiectul include desenul tehnic al piesei și un videoclip al simulării prelucrării.']},
  'tool-changer':{folder:'Schimbator_Scule',model:true,images:['Desen_Tehnic.png'],tags:['Mechanical design','Robotics','CAD'],
    en:['Two-Level Robotic Tool Changer','Design of a robotic tool changer arranged on two levels.','Explore the assembly in 3D and the accompanying technical drawing.'],
    ro:['Schimbător de scule robotizat','Proiectarea unui schimbător de scule robotizat pe două etaje.','Explorează ansamblul în 3D și desenul tehnic care îl însoțește.']},
};

export const catalog = projects.map(p=>({...p}));
for(const [id,d] of Object.entries(data)){
  let project=catalog.find(p=>p.id===id);
  if(!project){project={id,tags:d.tags,url:null};catalog.push(project);}
  project.media={
    gallery:(d.images||[]).map((name,i)=>({src:`assets/media/projects/${id}/${name}`,alt:{en:`${d.en[0]} — drawing ${i+1}`,ro:`${d.ro[0]} — desenul ${i+1}`}})),
    video:d.video?`assets/media/projects/${id}/video.mp4`:null,
    poster:d.video?`assets/media/projects/${id}/poster.jpg`:d.model?`assets/media/projects/${id}/model-poster.png`:null,
    model:d.model?`assets/media/projects/${id}/model.glb`:null,
    wireframe:d.model?`assets/media/projects/${id}/wireframe.glb`:null,
  };
  for(const lang of ['en','ro'])project[lang]={...project[lang],name:d[lang][0],description:d[lang][1],paragraphs:d[lang].slice(2),category:project[lang]?.category||(lang==='en'?'Engineering / CAD':'Inginerie / CAD'),date:project[lang]?.date||(lang==='en'?'ENGINEERING PROJECT':'PROIECT INGINERESC')};
}

export const designWorks = [
  {id:'modern-logofolio',images:['modern-logofolio.png'],en:'Modern Logofolio',ro:'Logofoliu modern'},
  {id:'black-logofolio',images:['black-logofolio.png'],en:'Black Logofolio',ro:'Logofoliu în negru'},
  {id:'intrus-brand-concept',images:['intrus-brand-concept.png'],en:'Intrus — Brand Concept',ro:'Intrus — Concept de identitate'},
  {id:'meteor-gaming-brand',images:['meteor-gaming-brand.png'],en:'Meteor Gaming',ro:'Meteor Gaming'},
  {id:'poster-collection',images:['poster-collection.png'],en:'Poster Collection',ro:'Colecție de postere'},
  {id:'romanian-patterns',images:['romanian-patterns.png'],en:'Romanian Patterns',ro:'Motive românești'},
  {id:'manila',images:['manila/manila-face.jpg','manila/manila-2.jpg'],en:'Manila',ro:'Manila'},
];
