export const getWebServerCommand = (isE2E: boolean): string => {
  return isE2E
    ? 'npm run build && npm start'
    : 'npm run build && npx serve@latest out';
};
