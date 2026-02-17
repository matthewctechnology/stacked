# stacked
Stacked - A Monorepo

## Overview

`stacked` is a monorepo for personal portfolio project(s).

`ideate` tool is a command line interface and web application that allows users to prompt an AI agent to get a creative idea that is novel, viable, and valuable.

`critique` contains a web application that allows users to prompt an AI agent to critique a creative idea so they can get feedback on a proposal, such as, objectively if the idea is novel, viable, or valuable.

[critique app](https://matthewctechnology.github.io/stacked/) is hosted on GitHub Pages and can be browsed without a development environment for static AI interaction.

`critique` app in a development enviornment requests AI response server-side and can be browsed via localhost for dynamic AI interaction.

## Quickstart

`ideate` tool
- `cd ideate`
- `source .ideate/bin/activate`
- `cd /workspaces/stacked`
- `python3 -m ideate.cli.ideate`

`critique` app
- `cd critique`
- `npm run dev`
- `<codespace_id>-3000.app.github.dev`

## Libraries and Frameworks

`ideate` tool
- Python
- Pylint
- Pytest

`critique` app
- TypeScript
- NextJS
- TailwindCSS
- NodeJS
- OpenAI
- ESLint
- Jest
- React Testing Library
- Playwright
