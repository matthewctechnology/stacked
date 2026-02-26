# Ideate Tool

A command line interface and web application for AI-powered creative idea generation.

## Overview

Ideate allows users to generate creative ideas based on optional topic.
The app is built with Typer, Python, Pydantic, and OpenAI.

## Features

- Modern, clean UI in dark mode
- Secure input and interaction
- Hybrid AI/static fallback for reliability
- Fully tested with Pylint and Pytest

## Full Start

### Prerequisites

- Python 3.11+ (3.12.1)

### Install dependencies

```bash
cd /workspaces/stacked/ideate
python3 -m venv .ideate
source .ideate/bin/activate
python3 -m pip install -r requirements.txt
```

### Run CLI

```bash
cd /workspaces/stacked/ideate
source .ideate/bin/activate
cd /workspaces/stacked
python3 -m ideate.cli.ideate ideate
python3 -m ideate.cli.ideate topics
python3 -m ideate.cli.ideate ideate --topic <topic>
```

### Install and run CLI Completions

```bash
# Configures shell completion with Typer
python3 -m ideate.cli.ideate --install-completion
exec $SHELL
python3 -m ideate.cli.ideate --topic Ar<TAB>
# Removes Typer shell completion installation in codespaces
sed -i '/fpath+=~\/.zfunc; autoload -Uz compinit; compinit/d' ~/.zshrc
rm -rf /home/codespace/.zfunc
```

### Run Dev

```bash
cd /workspaces/stacked/ideate && source .ideate/bin/activate && cd ..
python3 -m ideate.cli.ideate ideate --fallback
python3 -m ideate.cli.ideate ideate -tf <topic>
```

### Run Tests

```bash
cd /workspaces/stacked/ideate
pylint ideate tests && pytest tests
```

## Security

- The app is designed to mitigate OWASP Top 10 risks.

## License
