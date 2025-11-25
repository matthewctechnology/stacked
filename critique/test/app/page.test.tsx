import { describe, expect, test } from '@jest/globals';
import Home from '../../src/app/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe('Home', () => {
  test('should display input field', () => {
    render(<Home />);
    const expected = 'enter an idea';
    const received = screen.getByPlaceholderText(expected).getAttribute('placeholder');

    expect(received).toEqual(expected);
  });

  test('should display submit button', () => {
    render(<Home />);
    const expected = 'submit';
    const received = screen.getByRole('button', { name: 'submit' }).textContent;

    expect(received).toEqual(expected);
  });

  test('should display disclaimer', () => {
    render(<Home />);
    const expected = 'unvalidated responses inferred at individual risk';
    const received = screen.queryByText(expected)?.textContent;

    expect(received).toEqual(expected);
  });

  test('should display thinking while loading', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'an idea');
    fireEvent.click(button);

    expect(screen.queryByText('thinking...')).not.toBeNull();
    await waitFor(() => {
      expect(screen.queryByText('thinking...')).toBeNull();
    });
  });

  test('should display user and AI messages', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'Great! 🚀');
    fireEvent.click(button);

    expect(screen.getByTestId('user').textContent).toBe('Great! 🚀');
    await waitFor(() => {
      expect(screen.getByTestId('ai')).not.toBeNull();
    });
  });

  test('should clear text input on submit', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'another idea');
    fireEvent.click(button);

    await waitFor(() => {
      expect(inputField.textContent).toBe('');
      expect(inputField.textContent).not.toBe('another idea');
    });
  });

  test('should clear chat and display new message on next submit', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'first');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ai')).not.toBeNull();
    });

    await userEvent.clear(inputField);
    await userEvent.type(inputField, 'second');
    fireEvent.click(button);

    expect(screen.getByTestId('user').textContent).toBe('second');
    await waitFor(() => {
      expect(screen.getByTestId('ai')).not.toBeNull();
    });
  });

  test('should disable submit for invalid input', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' }) as HTMLButtonElement;

    await userEvent.type(inputField, 'a'.repeat(257));
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('title')).toBe('input too long');
  });
});
