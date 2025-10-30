import { describe, expect, test } from '@jest/globals';
import Home from './page';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Home', () => {

  test('should display input field', (): void => {
    render(<Home />);
    const expected = 'enter an idea';
    const received = screen.getByPlaceholderText(expected).getAttribute('placeholder');

    expect(received).toEqual(expected);
  });

  test('should display sumbit button', (): void => {
    render(<Home />);
    const expected = 'submit';
    const received = screen.getByRole('button', { name: 'submit' }).textContent;

    expect(received).toEqual(expected);
  });

  test('should display thinking while typing', (): void => {
    render(<Home />);
    const expected = 'greater than 0';
    const respected = 'thinking...';
    const unexpected = ' ';
    const inputField = screen.getByPlaceholderText('enter an idea');
    fireEvent.change(inputField, { target: { value: expected } });
    inputField.textContent = expected;
    const received = screen.getByText(expected).textContent;

    expect(received).toEqual(expected);

    const rereceived = screen.getByText(respected).textContent;

    expect(rereceived).not.toEqual(unexpected);
    expect(rereceived).toEqual(respected);
  });

  test('should toggle display message on click submit', (): void => {
    render(<Home />);
    const expected = 'message';
    const respected = 'another message';
    const unexpected = 'message another message';
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    inputField.textContent = expected;
    fireEvent.click(button);

    const received = screen.getByText(expected).textContent;

    expect(received).toEqual(expected);

    inputField.textContent = respected;
    fireEvent.click(button);

    const rereceived = screen.getByText(respected).textContent;

    expect(rereceived).not.toEqual(unexpected);
    expect(rereceived).toEqual(respected);
  });
});
