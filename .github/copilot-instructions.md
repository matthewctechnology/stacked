# Project Overview

The stacked repository contains different capabilities defined by sub-directories, primarily software applications that allows engagement with AI models.

`critique` contains a web application that allows users to prompt an AI agent to critique a creative idea so they can get feedback on a proposal, such as, objectively if the idea is novel, viable, or valuable.

## Folder Structure

- `/stacked`: Contains source code for all apps
- `.github/copilot-instructions.md`: Contains Copilot instructions

- `critique/src`: Contains critique frontend
- `critique/server`: Contains critique Node.js backend
- `critique/public`: Contains critique shared implementation
- `critique/test`: Contains critique tests

## Libraries and Frameworks

`critique` App
- TypeScript
- NextJS
- TailwindCSS
- NodeJS
- OpenAI SDK
- ESLint
- Jest
- React Testing Library
- Playwright

## Coding Standards

Overall
- Optimize for security and simplicity
- Structure for incremental evolution
- Preference for idiomatic solutions

TypeScript / JavaScript
- Use semicolons at the end of each statement
- Use single quotes for strings
- Use function based react components in Next
- Use arrow functions for callbacks
- Test units with Jest when possible and provide brief caveat when not possible
- Test with React Testing Library to ensure renders and async work with frameworks
- Test end-to-end with Playwright

## UI guidelines

- Application should have a modern and clean design that follows typical NextJS and Tailwind style.
- A toggle is provided to switch between light and dark mode
- Core interface consists of a single page with a component to input text into the chat and component to view chat history
- Site navigation and settings should be hidden and disclosed by hamburger menu

## Security guidelines

- Application should migitigate risk of the OWASP Top 10
- Inputs should be validated for malicious content
- Inputs should be reviewed for temprature and submit button disabled for high temprature text in the input field

## Example and Recommendation Styles
- Always provide a filename with relative path for where the code should be located in the repository
- Always provide a seperate test for suggested code

## Expectations

- Do not search the public internet
- Do not view, edit, or store any personal information
- Do not go beyond the provided context
- Do not go beyond the repository root
- Do not modify any GitHub settings
- Do not modify any VSCode settings
