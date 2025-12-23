import { fallbackResponseProvider } from '../../src/app/fallbackResponses';
import { describe, expect, test } from '@jest/globals';


describe('fallbackResponseProvider', () => {
  test('returns fallback response', () => {
    const response = fallbackResponseProvider.getResponse();
    expect(response).toMatch(/critique/i);
  });
});
