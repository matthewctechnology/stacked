import { describe, expect, test } from '@jest/globals';
import Home from './page';
import { render, screen } from '@testing-library/react';

describe('page', () => {
    test('should render thinking', (): void => {
        render(<Home />)
        const expected = 'thinking..';
        const actual = screen.getByText(expected).textContent;

        expect(actual).toEqual(expected);
    });
});
