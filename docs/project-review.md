# GitHub and CV review — 24 September 2026

Reviewed the eight public repositories through GitHub’s public API, available READMEs and file listings, plus the supplied Romanian and English CVs locally. This is a portfolio/content review, not an execution of those applications or a security audit. No résumé was uploaded or changed.

## Amnesia

The portfolio now uses the supplied README for bilingual copy, with eight actual screenshots, their translated captions, an optimized preview video and the [repository link](https://github.com/LucianStefanAndrei/Amnesia). The homepage preview is now an application screenshot.

The page explains local RAG, vector search, Argon2id/AES-256-GCM, journaling, calendar, model downloads, import/export, encrypted backups, themes and CLI support. Initial model downloads require internet access. The README’s test count and “zero-knowledge” wording are not presented as independently verified guarantees.

The public repository tree currently has no LICENSE file. If you intend open-source reuse, choose and add an appropriate license; making source publicly readable alone does not grant a reuse license.

## Projects worth adding next

| Priority | Repository | Portfolio value | What to add before featuring it |
| --- | --- | --- | --- |
| 1 | [RomanianEmotionDetection](https://github.com/LucianStefanAndrei/RomanianEmotionDetection) | A concrete Python/PySide6 pipeline: Romanian speech transcription → English translation → text emotion classification → animated visual feedback. Strong complement to the robot and Amnesia. | A short microphone-to-result demo, interface screenshot, pipeline diagram and examples of limitations. Describe emotion classification from transcribed text, not detection from vocal tone. Google speech recognition requires internet. |
| 2 | [Traffic Sign Recognition with TensorFlow](https://github.com/LucianStefanAndrei/Traffic-Sign-Detection-with-Tensorflow) | Computer vision with two CNN approaches, preprocessing, predictions and confusion-matrix visuals. The comparison includes an approach that performed worse, which can support an honest engineering discussion. | State the dataset, train/validation/test split, measured results and why the simpler approach did better. Reuse supplied repository visuals after selecting the clearest examples. |
| 3 | [HeartDiseaseML](https://github.com/LucianStefanAndrei/HeartDiseaseML) | An educational tabular-ML application with a Streamlit interface, feature importance and SHAP explanation images. | Document the evaluation split, limitations and your contribution. Present it as a dataset-based demonstration; the repository does not establish clinical validation. Verify its hosted demo before linking it as a working deployment. |

[ROS2_Muzeu](https://github.com/LucianStefanAndrei/ROS2_Muzeu) belongs with the existing thesis project, rather than as a duplicate project. Its README describes a skeleton workspace with the GUI implemented and other nodes still stubs. Label it as a GUI/workspace repository if linked; do not imply it contains the complete operational robot stack. This does not establish that the physical thesis prototype is incomplete.

[CNNs](https://github.com/LucianStefanAndrei/CNNs) contains MNIST and brain-MRI notebooks; [SparkNotebooks](https://github.com/LucianStefanAndrei/SparkNotebooks) contains tweet classification and heart-disease prediction notebooks. Both would benefit from READMEs, reproducible setup and results before becoming prominent portfolio pieces. [final-project-submission](https://github.com/LucianStefanAndrei/final-project-submission) contains an emotion-detection package, web server, template and tests in a nested project directory; clarify its course context and your contribution before featuring it alongside the more developed emotion application.

The traffic-sign repository also links to your [TensorFlow traffic-sign tutorial on Medium](https://medium.com/@stefanandreilucian2/convolutional-neural-network-tutorial-with-traffic-sign-recognition-tensorflow-29c9a5edc29f). This is a candidate for the Blog archive; it was not imported without its article resources.

## CV correspondence

| CV item | Website correspondence |
| --- | --- |
| Autonomous anthropomorphic museum guide, bachelor’s thesis, 2025–2026 | Featured as Autonomous Museum Guide / Ghid autonom de muzeu. The identity, supervision, approximate height and main technical direction match. |
| Amnesia, June 2026–present | Dedicated bilingual page, now expanded with the README and actual media. |
| RoboDK gear manufacturing simulation | Robotic Gear Manufacturing / Fabricație robotizată de roți dințate. |
| Worm gearbox mechanical design | Worm Gearbox Design / Proiectarea unui reductor melcat. |
| eStudent.ro feedback and validation, March–June 2025 | Listed as platform validation in the milestones. It is not presented as a platform you built. |

The assistive cane, pneumatic arm, CNC simulation and tool changer extend the shorter CV project list using the supplied project resources. The removed warehouse project remains removed.

Before publishing the revised CVs:

- **Reconcile the robot cost:** both CVs state approximately **USD 5,054**, while the existing website/project description states **EUR 4,357**. These might reflect currency conversion, but the source gives no conversion date or basis. The website amount was left unchanged pending a consistent currency/basis.
- **Use the confirmed LinkedIn URL:** both CVs display `linkedin.com/in/andrei-stefan-813b8421b`, whereas the website uses the URL you supplied, `https://www.linkedin.com/in/andrei-lucian-stefan-813b8421b/`. Align the displayed text and hyperlink in both documents.
- Replace the Romanian CV’s literal “punei aici site-ul” placeholder with the final live portfolio URL; include that URL in the English CV too.
- The CVs include FEA validation, Teensy 4.1 motor control and LiFePO4 battery sizing from measured consumption. These are useful future additions to the thesis write-up, ideally with diagrams/calculations/photos. Their omission from the website is not a contradiction.
- Update the [GitHub profile](https://github.com/LucianStefanAndrei) bio from “Robotics student” to reflect your 2026 graduation and populate its currently empty website field once the portfolio is live.

The existing résumé PDF was moved into ignored local storage, the download links were removed, and the published build excludes it. The attached ODT documents remain untouched in their original locations.
