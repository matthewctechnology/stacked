# Critique App

A web application for AI-powered creative idea critique.

## Overview

Critique allows users to submit creative ideas and receive concise, logical feedback based on design principles.
The app is built with Next.js, TypeScript, TailwindCSS, and OpenAI.

## Features

- Modern, clean UI with light/dark mode toggle
- Secure input validation
- Hybrid AI/static fallback for reliability
- Fully tested with Jest, React Testing Library, and Playwright

## Full Start

### Prerequisites

- Node.js 22+
- npm

### Install dependencies

```bash
cd critique
npm ci
```

### Run in Development (Dynamic AI)

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Or `<codespace>-3000.app.github.dev`

> **Note:** For dynamic AI, set `GITHUB_TOKEN` in your environment for OpenAI API access.
> In a codespace, `GITHUB_TOKEN` is already in your environment.

### Run Static Build (for GitHub Pages)

```bash
npm run build
npx serve@latest out
```

Visit [http://localhost:3000](http://localhost:3000).  Or `<codespace>-3000.app.github.dev`

### Run Tests

```bash
npm run lint && npm run test && npm run test:e2e
```

## Project Structure

- `/src`: Frontend source code
- `/test`: Unit and e2e tests
- `/public`: Shared assets

## Security

- All user input is validated and sanitized.
- The app is designed to mitigate OWASP Top 10 risks.

## License

MIT (next.js)
