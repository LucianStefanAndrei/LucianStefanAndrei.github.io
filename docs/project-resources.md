# Project resource checklist

This inventory describes what is available for the portfolio, not whether the engineering or software project itself is finished. It is based on `public/projects/`, prepared media and the current catalog.

All eight projects share one Projects archive. Raw resources are kept in `public/projects/`; browser-ready media is in `assets/media/projects/`; generated HTML exists only in `dist/projects/` and `dist/ro/projects/`.

## Highest priority

| Project | Currently supplied | Resources needed to strengthen the page |
| --- | --- | --- |
| Amnesia | Eight application screenshots, an optimized walkthrough video, bilingual README-based feature descriptions and the supplied GitHub link | Optional next additions: a retrieval/encryption architecture diagram and documented evaluation results. The page already has enough resources to present the application. |
| Autonomous Museum Guide / anthropomorphic robot | Detailed description and one video in `RobotAntropomorf/` | Photos of the physical robot, HMI screenshots and a system/ROS2 architecture diagram would make the featured thesis more concrete. Add a CAD assembly only if you want a 3D view; none has been supplied for this project. |

Amnesia originals are in `public/projects/Amnesia/`; bilingual copy and gallery captions are centralized in `content/amnesia.mjs`, shared by the homepage and project catalog.

## Existing engineering media

| Project / source folder | Available now | Further resources or explanation to add |
| --- | --- | --- |
| Worm Gearbox Design / `ReductorMelcat/` | STEP assembly, one technical drawing, short description | Gear ratio/load requirements, calculation excerpts and explanation of the design choices. A motion demo is optional. |
| Robotic Gear Manufacturing / `CelulaProducereRotiDintate/` | RoboDK video, calculation-report image, short description | Explain the cell sequence, robot/tool choices, your contribution and what the simulation verified. |
| AI Assistive Cane / `BastonNevazatori/` | STEP assembly and concept description | A block diagram and clear distinction between designed and implemented features. Add prototype/test evidence only if it exists; the page currently describes a concept. |
| Pneumatic Arm / `Brat_Pneumatic/` | STEP assembly, six calculation images, short description | A pneumatic circuit or motion sequence and a concise account of requirements, contribution and results. A motion video is optional. |
| CNC Milling Simulation / `Piesa_GCode/` | Simulation video, technical drawing, short description | Explain the setup, machining operations/toolpath and verification. A short G-code excerpt could illustrate your work; no code file has been supplied. |
| Two-Level Robotic Tool Changer / `Schimbator_Scule/` | STEP assembly, one technical drawing, short description | Explain the intended application and tool-change mechanism/sequence. A motion demo or sequence diagram would help. The removed second drawing is no longer used. |

Amnesia links to its supplied GitHub repository. Other project repository/demo URLs remain unset. Public download links for original CAD files remain disabled. See [the GitHub and CV review](project-review.md) for additional candidates and consistency notes.

## Other sections

- **Web Design:** seven collections already have images. They still lack individual briefs, role/contribution, tools and outcomes. Most are visual identity/graphic work; add actual website screenshots and live URLs if you want to demonstrate web-design projects specifically.
- **Blog:** both articles have source text, covers and narration; one also has an inline chart. Their original bodies and narration are English. Add full Romanian article versions only if you want translated bodies as well as the current Romanian titles/navigation.

## Updating project resources

1. Put original files under `public/projects/<folder>/`. This folder is ignored by Git to keep original CAD/source media local.
2. For a new engineering project, add its folder mapping in `scripts/prepare-media.mjs` and its bilingual record/media mapping in `content/catalog.mjs`.
3. Run `npm run prepare:media` (FFmpeg is required for video conversion), then `npm run build`.
4. If a model changed, run the preview server, regenerate posters with `npm run prepare:posters`, then rebuild again.
5. Review both language pages and commit the prepared media and content changes. Do not hand-edit generated `dist/` pages.
