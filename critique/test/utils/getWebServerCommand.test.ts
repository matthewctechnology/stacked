import { describe, expect, it } from '@jest/globals';
import { getWebServerCommand } from '../../utils/getWebServerCommand';


describe('getWebServerCommand', () => {
  it('returns npm start command when isE2E is true', () => {
    expect(getWebServerCommand(true)).toBe('npm run build && npm start');
  });

  it('returns serve command when isE2E is false', () => {
    expect(getWebServerCommand(false)).toBe('npm run build && npx serve@latest out');
  });
});
