# Scramples

A word game. You get nine random letters and 90 seconds to find as many words as you can.

**[Play it here →](https://jkisk.github.io/scramples/)**

## Background

This is a refactor of a project I originally built during a coding bootcamp. The original was split across two repos — a backend API and a frontend — with a database, authentication, and the usual complexity of a first serious web project.

This version strips all of that away and rebuilds it as a clean, frontend-only app. It's also an experiment in using AI tools (specifically Claude) to assist with migrating and modernizing legacy code: updating the stack, rethinking the architecture, and iterating on design without losing what made the original worth rebuilding.

## What changed

- **No backend** — the original had a Node/Express API and a database; this version is purely client-side
- **Modern stack** — React 19, Next.js 16, TypeScript, deployed as a static site on GitHub Pages
- **Redesigned** — three color themes (Candy, Neon, Paper), tile-click interaction, and a richer results screen

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/scramples](http://localhost:3000/scramples).
