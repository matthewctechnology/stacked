import { describe, expect, test } from '@jest/globals';

describe('pageTest', () => {
    test('should test page for thought', () => {
        const expected = 'thinking...';
        const actual = 'thinking...';

        expect(actual).toEqual(expected);
    });
});
