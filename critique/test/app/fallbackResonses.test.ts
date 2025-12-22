import { fallbackResponseProvider } from '../../src/app/fallbackResponses';
import { describe, expect, test } from '@jest/globals';


describe('fallbackResponseProvider', () => {

  test('returns short idea response', () => {
    const input = 'an idea';
    const response = fallbackResponseProvider.getResponse(input);
    expect(response).toMatch(/concise critique referencing core design principles/i);
  });

  test('returns generic response', () => {
    const input = 'a new app for collaborative design critique';
    const response = fallbackResponseProvider.getResponse(input);
    expect(response).toMatch(/generic critique referencing core design principles/i);
  });
});
