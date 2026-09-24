# Deploy and update the portfolio on GitHub Pages

The included workflow, `.github/workflows/deploy-pages.yml`, builds the website and deploys only `dist/` whenever you push to `main`. It reads the final Pages URL automatically, including any repository subdirectory, to generate canonical links, sharing metadata and the sitemap. You do not need a separate hosting service or a personal access token in the workflow.

## First deployment

1. Install Git and Node.js 24 if they are not already available. Sign into GitHub. The examples below use your supplied username, `LucianStefanAndrei`; substitute your actual account name if different.

2. Create an **empty public repository** on GitHub named `LucianStefanAndrei.github.io` for a site at `https://lucianstefanandrei.github.io/`. Leave the options to create a README, license and .gitignore unchecked, because this project supplies its own files. Alternatively, name the repository `portfolio` for `https://lucianstefanandrei.github.io/portfolio/`. GitHub Free supports Pages from public repositories; private-repository Pages requires an eligible paid plan. [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

3. In the new repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The included custom workflow handles the build and upload. [Publishing with Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

4. Open PowerShell in this project and check the local build:

   ```powershell
   Set-Location E:\PORTOFOLIU
   npm.cmd ci
   npm.cmd run build
   npm.cmd run dev
   ```

   Open `http://localhost:3000`. Use Ctrl+C to stop the preview. With Google Chrome installed, `npm.cmd test` runs the browser checks.

5. Initialize Git and review the files to upload. This workspace had no Git repository when these instructions were prepared:

   ```powershell
   git init -b main
   git add .
   git status --short
   git diff --cached --stat
   ```

   The supplied `.gitignore` keeps `public/projects/`, STEP files, local temporary files, generated pages, generated wireframes and `node_modules/` out of Git. Keep the prepared models, videos and drawings in `assets/media/projects/`: GitHub uses these to rebuild the site without your source CAD files or FFmpeg. Keep `public/posts/` and `public/web_design/` as the sources for articles and design work. Original CAD files and large source videos remain on your PC; back them up separately.

6. Commit and upload. Use the repository URL you created:

   ```powershell
   git commit -m "Publish portfolio"
   git remote add origin https://github.com/LucianStefanAndrei/LucianStefanAndrei.github.io.git
   git push -u origin main
   ```

   Git may ask you to configure your commit name/email or sign in through its credential manager. If you chose `portfolio`, use `https://github.com/LucianStefanAndrei/portfolio.git` instead. Do not rerun `git remote add origin` if an origin is already configured; inspect it with `git remote -v`.

7. Open the repository’s **Actions** tab and wait for **Deploy portfolio to GitHub Pages** to succeed. Open the published link shown by the deployment or in **Settings → Pages**. If the first push happened before Pages was enabled, enable it and use **Actions → Deploy portfolio to GitHub Pages → Run workflow → main**.

8. Check both language versions, a nested project URL, the fullscreen gallery and a 3D model on the published website. Nothing has been published by creating these local files; deployment starts after you push the workflow to GitHub and enable Pages.

## Updating the website

1. Before editing an existing clone, run `git pull --ff-only` while your working directory is clean.
2. Edit the source files listed below. Edit both the `en` and `ro` content where translations are supplied manually.
3. Run `npm.cmd run build`, preview with `npm.cmd run dev`, and run `npm.cmd test` for interactive changes.
4. Review and publish the update:

   ```powershell
   git add .
   git diff --cached --stat
   git commit -m "Update project descriptions and galleries"
   git push
   ```

5. Watch the Actions run. Each successful push to `main` rebuilds and replaces the published site automatically. You do not need to upload `dist/` manually. If the build fails, inspect the failed step’s log; the previous successful deployment remains available.

| Change | Edit |
| --- | --- |
| Name, introduction, socials, skills, milestones, homepage projects | `content/site.mjs` |
| Full project descriptions in EN/RO, gallery filenames, design collections | `content/catalog.mjs` |
| Shared translated labels | `content/sections.mjs` |
| Layout and appearance | `assets/styles.css`, `assets/pages.css`, `scripts/home.mjs`, `scripts/layout.mjs`, `scripts/pages.mjs` |
| Gallery and 3D interactions | `assets/media.js` |
| Portrait | Replace `assets/portrait.jpg` |
| Résumé (currently unpublished) | Keep it local until the portfolio URL is added. When ready, place the approved PDF in `assets/`, set `profile.resume` in `content/site.mjs`, and add an exception for that exact file to `.gitignore`. |
| Articles | `public/posts/<date-slug>/index.md` and its related images/audio |
| Design images | `public/web_design/`, plus the `designWorks` list in `content/catalog.mjs` |

### Updating CAD media

Edit the original files in `public/projects/` locally, then regenerate their prepared copies:

```powershell
node scripts/prepare-media.mjs cad
node scripts/prepare-media.mjs images
node scripts/prepare-media.mjs video
```

Video conversion requires FFmpeg on PATH. After a model changes, run `npm.cmd run build` so the preview server can serve the updated model from `dist/`. Regenerate previews with `npm.cmd run prepare:posters` while the local server is running on port 3000, then rebuild again to publish the new posters. Commit the changed files under `assets/media/projects/`; the original source files remain ignored. Wireframes are regenerated automatically by the normal build.

For a new CAD project, add its folder-to-ID mapping in `scripts/prepare-media.mjs` and its bilingual record in `content/catalog.mjs`. Add its ID in `scripts/model-posters.mjs` if it has a 3D model. Add or remove gallery entries in the catalog when images change. When deleting an image, also delete its prepared copy from `assets/media/projects/<id>/` so that Git removes it from future deployments. Merely editing a `descriere.md` file does not update the translated website text.

### Adding an article

Copy an existing folder under `public/posts/`, give it a new date/slug, and update its `index.md` frontmatter, body, `cover.png` and `narration.mp3`. The current templates expect a cover and narration for every article. Add the Romanian title/summary in `loadArticles()` in `scripts/pages.mjs`. The body and narration remain explicitly labeled as English. Rebuild and push.

### Fixing or reverting a published change

Correct the source and push another commit. To undo one specific commit while keeping history, use `git revert COMMIT_SHA`, then `git push`. A revert creates a new commit and triggers deployment again.

## Hosting details

- The current published site is well below GitHub Pages’ 1 GB site limit, and its largest prepared file is about 39 MiB. The original videos are much larger and intentionally excluded from Git. GitHub blocks individual Git files larger than 100 MiB. Use Git from your terminal for the first upload instead of dragging large models into the website upload form. [Large-file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- Original STEP files are not in the deployment or the planned Git upload. Displayed images, videos and converted 3D geometry are public rendering assets and can still be retrieved by browsers.
- This is a multipage static website with real `index.html` files for its routes. It needs no single-page-app redirect rule. The Pages workflow publishes `dist/`; it does not copy `public/_redirects`.
- When using a custom domain later, configure it in **Settings → Pages** and follow GitHub’s DNS instructions. The workflow reads the configured Pages base URL on the next deployment. [Custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
