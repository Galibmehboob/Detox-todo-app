# Detox Life — PWA deployment

This package preserves the supplied Detox Life HTML application and adds installable PWA support.

## Files
- `index.html` — original app with PWA metadata, Install App button, and service-worker registration added.
- `manifest.webmanifest` — install metadata.
- `service-worker.js` — offline app-shell caching and update handling.
- `icons/icon-192.png`, `icons/icon-512.png` — app icons.

## Deploy (free HTTPS)
### Netlify
1. Visit https://app.netlify.com/drop or create a free Netlify account.
2. Drag the entire extracted `detox-life-pwa` folder (not just `index.html`) into the deploy area.
3. Open the generated HTTPS URL. Keep all files and folders together.
4. Reload once while online so the service worker can cache the shell; then test by temporarily enabling airplane mode.
5. For updates, upload the new files together. Change `CACHE_NAME` in `service-worker.js` when changing caching behavior/assets substantially.

### GitHub Pages
1. Create a repository and upload all files while preserving the `icons/` folder.
2. In repository Settings → Pages, choose the deployment branch and root folder.
3. Wait for the HTTPS Pages URL, open it, and reload once online.
4. The relative manifest, scope, and service-worker paths support a repository subpath deployment.

## Install
### Android / Chrome
1. Open the deployed HTTPS URL in Chrome.
2. Tap **Install App** if Chrome offers it. Otherwise use Chrome menu → **Install app** or **Add to Home screen** (wording varies).
3. Confirm and launch Detox Life from the Home Screen.

### iPhone / Safari
1. Open the deployed HTTPS URL in Safari.
2. Tap **Share**.
3. Choose **Add to Home Screen** (you may need to scroll through the share sheet).
4. Confirm the name and tap **Add**. iOS does not use Chrome's `beforeinstallprompt` flow.

## Protect existing data
The app keeps its original storage key (`detox-life-os-v1`) and its existing legacy fallback (`dayforge-os-v1`); this upgrade does not clear or rename them. Browser storage is origin/profile scoped. If your old copy was opened as a local `file://` HTML file, its saved data may not appear on the hosted HTTPS origin. Before moving, open the old app and use **Export backup**. Then open the hosted app and use **Import backup**, reviewing the confirmation because import replaces the hosted app's current data.

The service worker caches the HTML shell and app icons/manifest, not your personal data. HTML navigation is network-first and falls back to the cached shell offline. Browser support and install eligibility vary; HTTPS is required outside localhost. A plain `file://` HTML file cannot provide full PWA installation/service-worker behavior.

## Testing notes
Run locally over localhost (not by double-clicking `index.html`) with a static server, for example:
`python -m http.server 8000`
Then visit `http://localhost:8000`. This permits service-worker testing in supported browsers. Real installation behavior should be checked on the target browser/device over HTTPS.
