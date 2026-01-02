import { fallbackResponseProvider } from '../../src/app/fallbackResponses';
import { describe, jest, expect, test } from '@jest/globals';


describe('fallbackResponseProvider', () => {
  test('returns fallback response', () => {
    const response = fallbackResponseProvider.getResponse();
    expect(response).not.toBeNull();
  });

  test('returns fallback error response', () => {
    fallbackResponseProvider.getResponse = jest.fn(
      fallbackResponseProvider.getResponse
    ).mockReturnValue('Unable to critique because of Error.');
    const response = fallbackResponseProvider.getResponse();
    expect(response).toMatch(/Unable to critique/i);
  });
});
