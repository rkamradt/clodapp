# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server (Vite HMR)
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

There is no test framework configured in this project.

## Environment Variables

The app requires two env vars at build time (Vite inlines them):

- `VITE_AUTH0_DOMAIN` — Auth0 tenant domain
- `VITE_AUTH0_CLIENT_ID` — Auth0 application client ID

Create a `.env` file at the project root for local development:
```
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

## Architecture

This is a single-page React 18 + Vite 5 application with a single component (`App.jsx`). All CSS is defined as a template-literal string inside `App.jsx` and injected via a `<style>` tag — there are no separate stylesheet files.

**Auth flow:** `main.jsx` wraps the app in `Auth0Provider` (reading domain/clientId from `import.meta.env`). `App.jsx` uses the `useAuth0` hook to show login/logout state and user identity fields.

The entry point is `/main.jsx` at the project root (not inside a `src/` directory).

## Docker / CI

The `Dockerfile` uses a two-stage build: Node 20 Alpine builds the Vite bundle (accepting `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` as `ARG`s), then nginx Alpine serves the `dist/` output.

`build.yml` is a GitHub Actions workflow that triggers on pushes to `main`, builds the Docker image, and pushes it to GitHub Container Registry (`ghcr.io`). Auth0 secrets are passed in as build args via GitHub repository secrets.
