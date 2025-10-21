# Project Overview

This project is a web application the allows the user to engage in dialog with AI models.

The AI Web Application will allow users to prompt an agent to critique a creative idea so they can get feedback on a proposal, such as, objectively if the idea is novel, viable, or valuable.

## Folder Structure

- `/src`: Contains the source code for the frontend.
- `/server`: Contains the source code for the Node.js backend.
- `/public`: Contains shared implementation source code.
- `.github/copilot-instructions.md`: Contains repository specific Copilot instructions

## Libraries and Frameworks

- TypeScript
- NextJS
- TailwindCSS
- NodeJS
- ESLint
- Jest
- SuperTest

## Coding Standards

- Optimize for security and simplicity
- Use semicolons at the end of each statement
- Use single quotes for strings
- Use function based react components in Next
- Use arrow functions for callbacks
- Always provide a seperate test for suggested code
- Test units with Jest when possible and provide brief caveat when not possible
- Test end-to-end with SuperTest

## UI guidelines

- Application should have a modern and clean design that follows typical NextJS and Tailwind style.
- A toggle is provided to switch between light and dark mode
- Core interface consists of a single page with a component to input text into the chat and component to view chat history
- Site navigation and settings should be hidden and disclosed by hamburger menu

## Security guidelines

- Application should migitigate risk of the OWASP Top 10
- Inputs should be validated for malicious content
- Inputs should be reviewed for temprature and submit button disabled for high temprature text in the input field

## Expectations

- Do not search the public internet
- Do not view, edit, or store any personal information
- Do not go beyond the provided context
- Do not go beyond the repository root
- Do not modify any GitHub settings
- Do not modify any VSCode settings
