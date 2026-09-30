# SV Management Portal — Windows desktop build (Electron)

The portal ships as a normal web app; this folder wraps it in an Electron shell for Windows.

## Run in development

```bash
npm install --save-dev electron @electron/packager
SV_PORTAL_URL=http://localhost:8080 npx electron .
```

## Package for Windows

1. Set `base: './'` in `vite.config.ts` **if** you want the desktop app to load a local build instead of a hosted URL.
2. Build and package:

```bash
npx vite build
npx @electron/packager . "SV Management Portal" \
  --platform=win32 --arch=x64 \
  --out=electron-release --overwrite \
  --ignore='node_modules' --ignore='^/src' --ignore='^/public' --ignore='^/electron-release'
```

The output folder `electron-release/SV Management Portal-win32-x64/` contains `SV Management Portal.exe`.

## Recommended setup

Point the desktop app at the hosted portal so updates ship without re-packaging:

```
SV_PORTAL_URL=https://portal.yourdomain.com
```

The desktop app uses the same PHP/MySQL API on cPanel — no separate backend is needed.

Add `"main": "electron/main.cjs"` to `package.json` before packaging.
